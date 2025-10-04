import jwt from '@elysiajs/jwt';
import { Elysia, t } from 'elysia';
import { auth } from './routes/auth';
import { authenticated } from './guards/authenticated';
import { COOKIE_CONFIG, JWT_CONFIG } from './lib/config';
import { userContent } from './routes/user-content';
import cors from '@elysiajs/cors';

if (typeof Bun === 'undefined') {
  throw new Error('Please run this project with Bun. (https://bun.sh)');
}

const app = new Elysia({
  prefix: '/api',
  cookie: { secrets: process.env.COOKIE_SECRET, ...COOKIE_CONFIG }
})
  .use(cors({
    origin: true, // Accept all origins (TODO: restrict in production)
    credentials: true
  }))
  .use(auth)
  .use(userContent)
  .listen(3000);

console.log(`Server running at :3000`);
