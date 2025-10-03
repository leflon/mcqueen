import jwt from '@elysiajs/jwt';
import { Elysia, t } from 'elysia';
import { auth } from './routes/auth';

if (typeof Bun === 'undefined') {
  throw new Error('Please run this project with Bun. (https://bun.sh)');
}
const app = new Elysia({
  prefix: '/api',
  cookie: {
    secrets: process.env.COOKIE_SECRET,
    maxAge: 90 * 24 * 60 * 60,
    secure: true,
    sameSite: 'none'
  }
})
  .use(auth)
  .listen(3000);
