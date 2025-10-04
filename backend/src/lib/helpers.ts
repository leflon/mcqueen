import Container from '../models/Container';
import FlashCard from '../models/FlashCard';
import User from '../models/User';
import type { NewFlashCard } from '../types/NewFlashCard';
import type { UserContent } from '../types/UserContent';
import db from './db';

function id() {
  return crypto.randomUUID();
}

/** Available tables in the project */
type Tables = 'User' | 'Container' | 'Media' | 'FlashCard';

/**
 * Allows efficient bulk or single inserts with automatic id and creation date insertion.
 * @param table The table insert
 * @param values The values to assign to each row.
 * @param sharedValues Values that should be equal for each record inserted.
 * @returns The IDs of each inserted row.
 */
function insert<T extends Record<string, string | number | null>>(
  table: Tables,
  values: T[] | T,
  sharedValues: Record<string, string | number> = {}
): string[] {
  if (!(values instanceof Array)) {
    values = [values];
  }

  let rowsCount = values.length;
  let columnsCount =
    Object.values(values[0]).length + Object.values(sharedValues).length + 2; // +2 => id and created_at

  const createdAt = Math.floor(Date.now() / 1000); // Integer timestamp for SQLite

  let placeholders = '';

  for (let i = 0; i < rowsCount; i++) {
    placeholders += '(';
    placeholders += '?,'.repeat(columnsCount);
    placeholders = placeholders.slice(0, -1); // Get rid of last comma
    placeholders += ')';
    if (i < rowsCount - 1) placeholders += ',';
  }

  const rowIds = Array(values.length)
    .fill(null)
    .map((_) => id());

  const bindings = values
    .map((v, i) => [
      rowIds[i],
      createdAt,
      ...Object.values(sharedValues), // Equal values for each record
      ...Object.values(v) // Values proper to eached record
    ])
    .flat();

  const query =
    `INSERT INTO ${table}` +
    `(id, created_at, ${Object.keys(sharedValues).length ? Object.keys(sharedValues).join(',') + ',' : ''}` +
    `${Object.keys(values[0]).join(',')}) VALUES ${placeholders}`;
  console.log(query);
  db.run(query, bindings);

  return rowIds;
}

/**
 * Update one row in a table.
 * @param table The updated table
 * @param changes The changed attributes. `null` sets the value to NULL, `undefined` does not update the attribute.
 * @param id The id of the row to update.
 * @returns The number of rows updated. Should *never* be greater than 1.
 */
function update(
  table: Tables,
  changes: Record<string, string | number | undefined | null>,
  id: string
) {
  const updated = Object.entries(changes).filter(
    ([_k, v]) => v !== undefined
  ) as [string, string | number | null][];

  const query = `UPDATE ${table} SET ${updated.map(([k]) => `${k} = ?`).join(',')} WHERE id = ?`;

  const result = db.run(query, [...updated.map(([k, v]) => v), id]);

  return result.changes;
}

update('User', { username: 'encule' }, 'caca');

//#region CREATE

export function createUser(username: string, password: string) {
  const password_hash = Bun.password.hashSync(password);
  const [userId] = insert('User', { username, password_hash });
  // Create First list for our new user.
  createFlashCardList('Default', userId);
  return userId;
}

export function createDirectory(name: string, owner: string) {
  insert('Container', { name, owner, type: 'directory' });
}

export function createFlashCardList(
  name: string,
  owner: string,
  directory?: string
) {
  const [listId] = insert('Container', {
    name,
    owner,
    type: 'list',
    parent_id: directory || null
  });

  return listId;
}

export function createFlashCards(cards: Array<NewFlashCard>, list: string) {
  insert('FlashCard', cards, { list_id: list });
}

//#endregion
//#region READ

const queryGetUserById = db.query('SELECT * FROM User WHERE id = ?').as(User);
const queryGetUserByUsername = db
  .query('SELECT * FROM User WHERE username = ?')
  .as(User);
export function getUser({ username, id }: { username?: string; id?: string }) {
  if (!username && !id)
    throw Error("'username' or 'id' expected. Got nothing.");
  if (username && id) throw Error("'username' OR 'id' expected. Got both.");
  if (id) return queryGetUserById.get(id);
  if (username) return queryGetUserByUsername.get(username);
  return null;
}

const queryGetAllContainers = db
  .query('SELECT * FROM Container WHERE owner = ?')
  .as(Container);
export function getUserContent(userId: string): any | UserContent {
  const containers = queryGetAllContainers.iterate(userId);

  // Flat store of all containers for O(1) look up.
  const allNodes: Map<string, UserContent> = new Map();
  // Returned tree structure.
  const root: UserContent = { id: 'root', lists: [], directories: [] };
  allNodes.set('root', root);

  const getOrCreateDir = (id: string): UserContent => {
    if (!allNodes.has(id)) {
      allNodes.set(id, { id, lists: [], directories: [] });
    }
    return allNodes.get(id)!;
  };

  for (const container of containers) {
    const parentId = container.parent_id || 'root';
    const parentNode = getOrCreateDir(parentId);

    if (container.type === 'list') {
      parentNode.lists.push(container);
    } else if (container.type === 'directory') {
      const dirNode = getOrCreateDir(container.id);
      // Only add to parent's directories if it's not already there
      if (!parentNode.directories.some((d) => d.id === container.id)) {
        parentNode.directories.push(dirNode);
      }
    }
  }

  return root;
}

const queryGetOwner = db.query('SELECT owner FROM Container WHERE id = ?');
export function checkFlashCardsOwnership(
  list: string,
  userId: string
): boolean | null {
  const result = queryGetOwner.get(list) as { owner: string };
  if (!result) return false;
  return result.owner === userId;
}

const queryGetFlashcards = db
  .query('SELECT * FROM FlashCard WHERE list_id = ?')
  .as(FlashCard);
const queryGetFlashcardById = db
  .query('SELECT * FROM FlashCard WHERE id = ?')
  .as(FlashCard);
export function getFlashCards(listOrId: string) {
  // Try to get by ID first (for single flashcard lookup)
  const single = queryGetFlashcardById.all(listOrId);
  if (single.length > 0) return single;
  // Otherwise get by list_id
  return queryGetFlashcards.all(listOrId);
}
//#endregion

//#region Update

// Doesn't allow to update the type of a container as it would cause too much complexity in the update.
// It is not a useful feature anyway, as a list/directory appear as two distinct entities to the user,
// so there should be no reason for them to ever need to modify the type.

export function editContainer(
  id: string,
  changes: {
    parent_id?: string | null;
    name?: string;
  }
) {
  update('Container', changes, id);
}

// Media edit shall be implemented later.
export function editFlashCard(
  id: string,
  changes: {
    question_text?: string;
    answer_text?: string;
  }
) {
  update('FlashCard', changes, id);
}

//#endregion
//#region Delete

const queryDeleteContainer = db.query('DELETE FROM Container WHERE id = ?');
export function deleteContainer(id: string) {
  // SQLite takes care of all cascade deletes.
  // Deleting one folder will delete all of its children directories, lists and flashcards.
  queryDeleteContainer.run(id);
}

const queryDeleteFlashcard = db.query('DELETE FROM FlashCard WHERE id = ?');
export function deleteFlashCard(id: string) {
  queryDeleteFlashcard.run(id);
}

//#endregion

export default db;
