import Database from 'bun:sqlite';
import FlashCard from '../models/FlashCard';
import Base from '../models/base';

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

type NewFlashCard = Omit<
  Pick<FlashCard, Exclude<keyof FlashCard, keyof Base>>,
  'list_id'
>;
export function createFlashCards(cards: Array<NewFlashCard>, list: string) {
  insert('FlashCard', cards, { list_id: list });
}

//#endregion
//#region READ

//#endregion

export default db;
