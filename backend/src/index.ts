import cors from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { COOKIE_CONFIG } from './lib/config';
import { auth } from './routes/auth';
import { userContent } from './routes/user-content';

const PORT = process.env.PORT || 3000;

if (typeof Bun === 'undefined') {
  throw new Error('Please run this project with Bun. (https://bun.sh)');
}

const app = new Elysia({
  prefix: '/api',
  cookie: { secrets: process.env.COOKIE_SECRET, ...COOKIE_CONFIG }
})
  .use(
    cors({
      origin: true, // Accept all origins (TODO: restrict in production)
      credentials: true
    })
  )
  .get('/health', () => ({
    status: 'alive',
    timestamp: Date.now(),
    version: process.env.npm_package_version
  }))
  .use(auth)
  .use(userContent)
  .listen(PORT);

console.log(`Server running at :${PORT}`);
