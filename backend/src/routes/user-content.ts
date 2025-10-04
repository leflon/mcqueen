import Elysia, { t } from 'elysia';
import { authenticated } from '../guards/authenticated';
import {
  checkFlashCardsOwnership,
  getFlashCards,
  getUserContent,
  createDirectory,
  createFlashCardList,
  createFlashCards,
  editContainer,
  editFlashCard,
  deleteContainer,
  deleteFlashCard
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
  })
  // Create directory
  .post(
    '/directory',
    ({ user, body, set }) => {
      const { name } = body;
      createDirectory(name, user!.id as string);
      set.status = 201;
      return { ok: true, message: 'Directory created successfully' };
    },
    {
      body: t.Object({
        name: t.String()
      })
    }
  )
  // Create list
  .post(
    '/list',
    ({ user, body, set }) => {
      const { name, parent_id } = body;
      const listId = createFlashCardList(name, user!.id as string, parent_id);
      set.status = 201;
      return { ok: true, listId, message: 'List created successfully' };
    },
    {
      body: t.Object({
        name: t.String(),
        parent_id: t.Optional(t.String())
      })
    }
  )
  // Edit container (list or directory)
  .patch(
    '/container/:id',
    ({ user, params: { id }, body, set }) => {
      const isOwner = checkFlashCardsOwnership(id, user!.id as string);
      if (!isOwner) {
        set.status = 403;
        return { ok: false, error: 'This container belongs to another user.' };
      }
      editContainer(id, body);
      return { ok: true, message: 'Container updated successfully' };
    },
    {
      body: t.Object({
        name: t.Optional(t.String()),
        parent_id: t.Optional(t.Union([t.String(), t.Null()]))
      })
    }
  )
  // Delete container (list or directory)
  .delete('/container/:id', ({ user, params: { id }, set }) => {
    const isOwner = checkFlashCardsOwnership(id, user!.id as string);
    if (!isOwner) {
      set.status = 403;
      return { ok: false, error: 'This container belongs to another user.' };
    }
    deleteContainer(id);
    return { ok: true, message: 'Container deleted successfully' };
  })
  // Bulk add flashcards to a list
  .post(
    '/flashcards/:listId',
    ({ user, params: { listId }, body, set }) => {
      const isOwner = checkFlashCardsOwnership(listId, user!.id as string);
      if (!isOwner) {
        set.status = 403;
        return { ok: false, error: 'This list belongs to another user.' };
      }
      createFlashCards(body.flashcards, listId);
      set.status = 201;
      return { ok: true, message: 'Flashcards created successfully' };
    },
    {
      body: t.Object({
        flashcards: t.Array(
          t.Object({
            question_text: t.Union([t.String(), t.Null()]),
            question_media_id: t.Union([t.String(), t.Null()]),
            answer_text: t.Union([t.String(), t.Null()]),
            answer_media_id: t.Union([t.String(), t.Null()])
          })
        )
      })
    }
  )
  // Edit individual flashcard
  .patch(
    '/flashcard/:id',
    ({ user, params: { id }, body, set }) => {
      // Note: We need to check if the flashcard's list belongs to the user
      // This requires getting the list_id from the flashcard first
      const flashcard = getFlashCards(id)[0];
      if (!flashcard) {
        set.status = 404;
        return { ok: false, error: 'Flashcard not found.' };
      }

      const isOwner = checkFlashCardsOwnership(flashcard.list_id, user!.id as string);
      if (!isOwner) {
        set.status = 403;
        return { ok: false, error: 'This flashcard belongs to another user.' };
      }

      editFlashCard(id, body);
      return { ok: true, message: 'Flashcard updated successfully' };
    },
    {
      body: t.Object({
        question_text: t.Optional(t.String()),
        answer_text: t.Optional(t.String())
      })
    }
  )
  // Bulk delete flashcards
  .delete(
    '/flashcards',
    ({ user, body, set }) => {
      const { ids } = body;

      // Check ownership for all flashcards
      for (const id of ids) {
        const flashcard = getFlashCards(id)[0];
        if (!flashcard) {
          set.status = 404;
          return { ok: false, error: `Flashcard ${id} not found.` };
        }

        const isOwner = checkFlashCardsOwnership(flashcard.list_id, user!.id as string);
        if (!isOwner) {
          set.status = 403;
          return { ok: false, error: `Flashcard ${id} belongs to another user.` };
        }
      }

      // Delete all flashcards if ownership checks pass
      for (const id of ids) {
        deleteFlashCard(id);
      }

      return { ok: true, message: 'Flashcards deleted successfully' };
    },
    {
      body: t.Object({
        ids: t.Array(t.String())
      })
    }
  );
