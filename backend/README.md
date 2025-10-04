# mcqueen/backend

## Setup

- **Fill in env variables**
- **Run `dbInit.ts`**: `bun run dbInit.ts`

## Routes

### Auth
 - `POST /api/auth/register`: Registers a new user in database:

 Body:
 ```js
	{
		"username": String
		"password": String
	}
 ```
  - `POST /api/auth/login`