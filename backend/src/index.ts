import { Elysia } from 'elysia';

if (typeof Bun === 'undefined') {
  throw new Error('Please run this project with Bun. (https://bun.sh)');
}

const users = new Elysia({ prefix: '/users' })
  .get('/me', () => 'ok')
  .guard({
    beforeHandle: ({ status }) => {
      if (Math.random() > 0.5) return status(401);
    },
  })
  .get('/you', () => 'you');

const app = new Elysia()
  .get('/', () => 'Hello Elysia')
  .use(test)
  .use(users)
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
