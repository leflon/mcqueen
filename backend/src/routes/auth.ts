import jwt from '@elysiajs/jwt';
import { Elysia, t } from 'elysia';
import { createUser, getUser } from '../lib/helpers';

const COOKIE_SETTINGS = {
  httpOnly: true,
  maxAge: 90 * 24 * 60 * 60,
  path: '/',
  sameSite: 'none' as 'none'
};

export const auth = new Elysia({ prefix: '/auth' })
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET!,
      exp: '90d'
    })
  )
  .post(
    '/register',
    async ({ body, jwt, cookie, set }) => {
      const { username, password } = body;
      const user = getUser({ username });
      if (user !== null) {
        set.status = 409;
        return { error: 'Username already in use.', ok: false };
      }
      const userId = createUser(username, password);
      const token = await jwt.sign({ id: userId, username });
      cookie.auth.set({
        ...COOKIE_SETTINGS,
        value: token
      });
      return { id: userId, username, token };
    },
    {
      body: t.Object({
        username: t.String({
          minLength: 4,
          maxLength: 16,
          pattern: '^[A-za-z0-9_]+$'
        }),
        password: t.String({ minLength: 12, maxLength: 32 })
      })
    }
  )
  .post(
    '/login',
    async ({ body, jwt, cookie, set }) => {
      const { username, password } = body;
      const user = getUser({ username });
      if (!user) {
        set.status = 404;
        return { error: 'Incorrect username or password.', ok: false };
      }
      const clientUser = { id: user.id, username: user.username };

      const authCookie = cookie.auth.value as string;
      const parsed = (await jwt.verify(authCookie || '')) as {
        id: string;
        username: string;
      };

      // Already logged in with this account
      if (parsed.id === user.id) {
        return { username: user.username, id: user.id };
      }

      // Password check
      const isCorrect = Bun.password.verifySync(password, user.password_hash);
      if (!isCorrect) {
        set.status = 400;
        return { error: 'Incorrect username or password.', ok: false };
      }

      // Log in successfull, sending cookie
      const token = await jwt.sign({ id: user.id, username: user.username });
      cookie.auth.set({
        ...COOKIE_SETTINGS,
        value: token
      });
      return { id: user.id, username: user.username };
    },
    {
      body: t.Object({
        username: t.String(),
        password: t.String()
      })
    }
  )
  .get('/logout', ({ cookie }) => {
    cookie.auth.remove();
    return { ok: true };
  });
