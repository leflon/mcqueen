import db from './src/lib/db';

if (process.argv.length > 2 && process.argv[2] === '--wipe') {
  console.log('== WIPING DATABASE ==');
  db.run('DROP TABLE IF EXISTS FlashCard');
  db.run('DROP TABLE IF EXISTS Media');
  db.run('DROP TABLE IF EXISTS Container');
  db.run('DROP TABLE IF EXISTS User');
  console.log('== DROPPED ALL TABLES ==');
}

console.log('== Creating: User == ');
db.run(
  `CREATE TABLE IF NOT EXISTS User(
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )`,
);

console.log('== Creating: Container == ');
db.run(
  `CREATE TABLE IF NOT EXISTS Container(
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner TEXT NOT NULL,
    -- A Directory is just a collection of Lists,
    -- A List is a collection of flashcards.
    type TEXT NOT NULL CHECK(type IN ('directory', 'list')),
    created_at INTEGER NOT NULL,
    parent_id TEXT,
    FOREIGN KEY (owner) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES Container(id) ON DELETE CASCADE
  )`,
);

console.log('== Creating: Media == ');
db.run(
  `CREATE TABLE IF NOT EXISTS Media(
    id TEXT PRIMARY KEY,
    file TEXT NOT NULL, -- file path
    owner TEXT, -- prevent other user from seeing it.
    type TEXT NOT NULL CHECK(type IN ('image', 'video', 'audio')),
    created_at INTEGER NOT NULL,
    FOREIGN KEY (owner) REFERENCES User(id) ON DELETE CASCADE
  )`,
);

console.log('== Creating: FlashCard ==');
db.run(
  `CREATE TABLE IF NOT EXISTS FlashCard(
    id TEXT PRIMARY KEY,
    question_text TEXT,
    question_media_id TEXT, -- If present, can be image, video, audio.
    answer_text TEXT,
    answer_media_id TEXT,
    list_id TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (list_id) REFERENCES Container(id) ON DELETE CASCADE,
    FOREIGN KEY (question_media_id) REFERENCES Media(id),
    FOREIGN KEY (answer_media_id) REFERENCES Media(id),

    -- We can have text and/or media in question and reply, but not neither.
    CHECK (question_text IS NOT NULL OR question_media_id IS NOT NULL),
    CHECK (answer_text IS NOT NULL OR answer_media_id IS NOT NULL)
  )`,
);
