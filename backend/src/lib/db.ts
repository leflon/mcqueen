import Database from 'bun:sqlite';
import Container from '../models/Container';
import User from '../models/User';
import type { NewFlashCard } from '../types/NewFlashCard';
import type { UserContent } from '../types/UserContent';
import FlashCard from '../models/FlashCard';

console.log(process.cwd());
const db = new Database('data/mcqueen.sqlite', { create: true });
db.exec('PRAGMA journal_mode = WAL;');

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
  sharedValues: Record<string, string | number> = {},
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
      ...Object.values(v), // Values proper to eached record
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
  directory?: string,
) {
  const [listId] = insert('Container', {
    name,
    owner,
    type: 'list',
    parent_id: directory || null,
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

const queryGetFlashcards = db
  .query('SELECT * FROM FlashCard WHERE list_id = ?')
  .as(FlashCard);
export function getFlashCards(list: string) {
  return queryGetFlashcards.all(list);
}

//#endregion

export default db;
