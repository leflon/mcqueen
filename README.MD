# McQueen

## Great Flash Cards with no ads, for free.

### How to use

#### 1. Clone the repository

**Using Git CLI**

```bash
git clone https://github.com/leflon/mcqueen.git
```

**Using GitHub CLI**

```bash
gh repo clone leflon/mcqueen
```

#### 2. Install dependencies

```bash
cd mcqueen
cd backend && bun install && cd ../frontend && bun install && cd ..
```

#### 3. Run locally

You can either run backend and frontend separately:

```bash
bun client:dev
```

```bash
bun server:dev
```

Or you can run them both using `concurrently`:

```bash
bun dev
```

---

## API Documentation

All routes require authentication unless otherwise specified.

### Authentication

**Base URL:** `/auth`

#### POST `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** `201 Created`
```json
{
  "ok": true,
  "userId": "string",
  "message": "User created successfully"
}
```

#### POST `/auth/login`

Login to an existing account.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:** `200 OK`
```json
{
  "ok": true,
  "token": "string"
}
```

---

### User Content

**Base URL:** `/user-content`

All routes in this section require authentication.

#### GET `/user-content/collections`

Get the user's content tree structure (directories and lists).

**Response:** `200 OK`
```json
{
  "id": "root",
  "lists":
    {
      "id": "string",
      "name": "string",
      "owner": "string",
      "type": "list",
      "created_at": "number",
      "parent_id": "string | null"
    }[],
  "directories":
    {
      "id": "string",
      "lists": [...],
      "directories": [...]
    }[]
}
```

#### GET `/user-content/flashcards/:id`

Get all flashcards in a specific list.

**Parameters:**
- `id` - The list ID

**Response:** `200 OK`
```json
{
  "flashcards":
    {
      "id": "string",
      "question_text": "string | null",
      "question_media_id": "string | null",
      "answer_text": "string | null",
      "answer_media_id": "string | null",
      "list_id": "string",
      "created_at": "number"
    }[]
}
```

**Error Response:** `403 Forbidden`
```json
{
  "ok": false,
  "error": "These flashcards belong to another user."
}
```

#### POST `/user-content/directory`

Create a new directory.

**Request Body:**
```json
{
  "name": "string"
}
```

**Response:** `201 Created`
```json
{
  "ok": true,
  "message": "Directory created successfully"
}
```

#### POST `/user-content/list`

Create a new flashcard list.

**Request Body:**
```json
{
  "name": "string",
  "parent_id": "string (optional)"
}
```

**Response:** `201 Created`
```json
{
  "ok": true,
  "listId": "string",
  "message": "List created successfully"
}
```

#### PATCH `/user-content/container/:id`

Edit a container (list or directory).

**Parameters:**
- `id` - The container ID

**Request Body:**
```json
{
  "name": "string (optional)",
  "parent_id": "string | null (optional)"
}
```

**Response:** `200 OK`
```json
{
  "ok": true,
  "message": "Container updated successfully"
}
```

**Error Response:** `403 Forbidden`
```json
{
  "ok": false,
  "error": "This container belongs to another user."
}
```

#### DELETE `/user-content/container/:id`

Delete a container (list or directory). This will cascade delete all children.

**Parameters:**
- `id` - The container ID

**Response:** `200 OK`
```json
{
  "ok": true,
  "message": "Container deleted successfully"
}
```

**Error Response:** `403 Forbidden`
```json
{
  "ok": false,
  "error": "This container belongs to another user."
}
```

#### POST `/user-content/flashcards/:listId`

Bulk add flashcards to a list.

**Parameters:**
- `listId` - The list ID

**Request Body:**
```json
{
  "flashcards":
    {
      "question_text": "string | null",
      "question_media_id": "string | null",
      "answer_text": "string | null",
      "answer_media_id": "string | null"
    }[]
}
```

**Note:** Each flashcard must have at least one question (text or media) and at least one answer (text or media).

**Response:** `201 Created`
```json
{
  "ok": true,
  "message": "Flashcards created successfully"
}
```

**Error Response:** `403 Forbidden`
```json
{
  "ok": false,
  "error": "This list belongs to another user."
}
```

#### PATCH `/user-content/flashcard/:id`

Edit an individual flashcard.

**Parameters:**
- `id` - The flashcard ID

**Request Body:**
```json
{
  "question_text": "string (optional)",
  "answer_text": "string (optional)"
}
```

**Response:** `200 OK`
```json
{
  "ok": true,
  "message": "Flashcard updated successfully"
}
```

**Error Responses:**

`404 Not Found`
```json
{
  "ok": false,
  "error": "Flashcard not found."
}
```

`403 Forbidden`
```json
{
  "ok": false,
  "error": "This flashcard belongs to another user."
}
```

#### DELETE `/user-content/flashcards`

Bulk delete flashcards.

**Request Body:**
```json
{
  "ids": ["string", "string", ...]
}
```

**Response:** `200 OK`
```json
{
  "ok": true,
  "message": "Flashcards deleted successfully"
}
```

**Error Responses:**

`404 Not Found`
```json
{
  "ok": false,
  "error": "Flashcard {id} not found."
}
```

`403 Forbidden`
```json
{
  "ok": false,
  "error": "Flashcard {id} belongs to another user."
}
```

---

## Database Schema

### User
- `id` (TEXT, PRIMARY KEY)
- `username` (TEXT, UNIQUE, NOT NULL)
- `password_hash` (TEXT, NOT NULL)
- `created_at` (INTEGER, NOT NULL)

### Container
- `id` (TEXT, PRIMARY KEY)
- `name` (TEXT, NOT NULL)
- `owner` (TEXT, NOT NULL, FK → User.id)
- `type` (TEXT, NOT NULL) - 'directory' or 'list'
- `created_at` (INTEGER, NOT NULL)
- `parent_id` (TEXT, FK → Container.id, nullable)

### FlashCard
- `id` (TEXT, PRIMARY KEY)
- `question_text` (TEXT, nullable)
- `question_media_id` (TEXT, FK → Media.id, nullable)
- `answer_text` (TEXT, nullable)
- `answer_media_id` (TEXT, FK → Media.id, nullable)
- `list_id` (TEXT, NOT NULL, FK → Container.id)
- `created_at` (INTEGER, NOT NULL)

**Constraints:**
- At least one question (text or media) required
- At least one answer (text or media) required

### Media
- `id` (TEXT, PRIMARY KEY)
- `file` (TEXT, NOT NULL) - file path
- `owner` (TEXT, FK → User.id, nullable)
- `type` (TEXT, NOT NULL) - 'image', 'video', or 'audio'
- `created_at` (INTEGER, NOT NULL)
