import jwt from '@elysiajs/jwt';
import { Elysia, t } from 'elysia';
import { auth } from './routes/auth';
import { authenticated } from './guards/authenticated';
import { COOKIE_CONFIG, JWT_CONFIG } from './lib/config';
import { userContent } from './routes/user-content';

if (typeof Bun === 'undefined') {
  throw new Error('Please run this project with Bun. (https://bun.sh)');
}
const app = new Elysia({
  prefix: '/api',
  cookie: { secrets: process.env.COOKIE_SECRET, ...COOKIE_CONFIG }
})
  .use(auth)
  .use(userContent)
  .listen(3000);
