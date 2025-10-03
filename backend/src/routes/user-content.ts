import Elysia from 'elysia';
import { authenticated } from '../guards/authenticated';
import {
  checkFlashCardsOwnership,
  getFlashCards,
  getUserContent
} from '../lib/helpers';

export const userContent = new Elysia({ prefix: '/user-content' })
  .use(authenticated)
  .get('/collections', ({ user }) => {
    return getUserContent(user!.id as string);
  })
  .get('/flashcards/:id', ({ set, user, params: { id } }) => {
    const flashcards = getFlashCards(id);
    const isOwner = checkFlashCardsOwnership(id, user!.id as string);
    if (!isOwner) {
      set.status = 403;
      return { ok: false, error: 'These flashcards belong to another user.' };
    }
    return { flashcards };
  });
