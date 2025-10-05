import Elysia from 'elysia';
import { JWT_CONFIG } from '../lib/config';
import jwt from '@elysiajs/jwt';

export const authenticated = (app: Elysia) =>
  app
    .use(jwt(JWT_CONFIG))
    .derive(async ({ jwt, cookie }) => {
      const authCookie = cookie.auth.value as string;
      if (!authCookie) return { user: null };
      try {
        const user = await jwt.verify(authCookie);
        if (!user) return { user: null };
        return { user: { id: user.id, username: user.username } }; // Attach user to context
      } catch {
        return { user: null };
      }
    })
    .guard({
      beforeHandle: ({ user, set }) => {
        if (user == null) {
          set.status = 403;
          return { ok: false, error: 'Please login to access this resource.' };
        }
      }
    });
