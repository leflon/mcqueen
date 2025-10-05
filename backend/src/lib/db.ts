import Database from 'bun:sqlite';

const db = new Database('data/mcqueen.sqlite', { create: true });
db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

export default db;
