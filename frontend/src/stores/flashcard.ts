import { defineStore } from 'pinia';
import { api } from '../lib/api';
import type {
  Flashcard,
  FlashcardList,
  CreateFlashcardData,
  UpdateFlashcardData
} from './types';

export const useFlashcardStore = defineStore('flashcard', {
  state: () => ({
    lists: [] as FlashcardList[],
    flashcards: {} as Record<string, Flashcard[]>,
    loading: false,
    error: null as string | null
  }),

  getters: {
    getListById:
      (state) =>
      (id: string): FlashcardList | undefined => {
        return state.lists.find((list) => list.id === id);
      },

    getFlashcardsByListId:
      (state) =>
      (listId: string): Flashcard[] => {
        return state.flashcards[listId] || [];
      },

    searchFlashcards:
      (state) =>
      (listId: string, query: string): Flashcard[] => {
        const flashcards = state.flashcards[listId] || [];
        if (!query.trim()) return flashcards;

        const lowercaseQuery = query.toLowerCase();
        return flashcards.filter(
          (card) =>
            card.question_text?.toLowerCase().includes(lowercaseQuery) ||
            card.answer_text?.toLowerCase().includes(lowercaseQuery)
        );
      },

    firstAvailableListId: (state): string | null => {
      return state.lists.length > 0 ? state.lists[0]?.id || null : null;
    }
  },

  actions: {
    setError(error: string | null) {
      this.error = error;
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },

    // Lists management
    async fetchLists() {
      try {
        this.setLoading(true);
        this.setError(null);

        const response = await api('/user-content/collections', 'GET');
        this.lists = response.lists || [];
      } catch (error) {
        console.error('Failed to fetch lists:', error);
        this.setError('Failed to load flashcard lists');
      } finally {
        this.setLoading(false);
      }
    },

    async createList(
      name: string,
      parentId: string | null = null
    ): Promise<string | null> {
      try {
        this.setLoading(true);
        this.setError(null);

        const response = await api('/user-content/list', 'POST', {
          name,
          parent_id: parentId || ''
        });

        // Refresh lists after creation
        await this.fetchLists();

        return response.listId;
      } catch (error) {
        console.error('Failed to create list:', error);
        this.setError('Failed to create list');
        return null;
      } finally {
        this.setLoading(false);
      }
    },

    async updateList(id: string, name: string): Promise<boolean> {
      try {
        this.setLoading(true);
        this.setError(null);

        await api(`/user-content/container/${id}`, 'PATCH', {
          name,
          parent_id: null
        });

        // Update local state
        const list = this.lists.find((l) => l.id === id);
        if (list) {
          list.name = name;
        }

        return true;
      } catch (error) {
        console.error('Failed to update list:', error);
        this.setError('Failed to update list');
        return false;
      } finally {
        this.setLoading(false);
      }
    },

    async deleteList(id: string): Promise<boolean> {
      try {
        this.setLoading(true);
        this.setError(null);

        await api(`/user-content/container/${id}`, 'DELETE');

        // Remove from local state
        this.lists = this.lists.filter((list) => list.id !== id);
        delete this.flashcards[id];

        return true;
      } catch (error) {
        console.error('Failed to delete list:', error);
        this.setError('Failed to delete list');
        return false;
      } finally {
        this.setLoading(false);
      }
    },

    // Flashcards management
    async fetchFlashcards(listId: string) {
      try {
        this.setLoading(true);
        this.setError(null);

        const response = await api(`/user-content/flashcards/${listId}`, 'GET');
        this.flashcards[listId] = response.flashcards || [];
      } catch (error) {
        console.error('Failed to fetch flashcards:', error);
        this.setError('Failed to load flashcards');
        this.flashcards[listId] = [];
      } finally {
        this.setLoading(false);
      }
    },

    async createFlashcard(
      listId: string,
      flashcardData: CreateFlashcardData
    ): Promise<boolean> {
      try {
        this.setError(null);

        await api(`/user-content/flashcards/${listId}`, 'POST', {
          flashcards: [flashcardData]
        });

        // Add the new flashcard to local state immediately
        if (!this.flashcards[listId]) {
          this.flashcards[listId] = [];
        }

        // Create a temporary flashcard object with a generated ID
        const tempFlashcard: Flashcard = {
          id: `temp_${Date.now()}`,
          question_text: flashcardData.question_text,
          question_media_id: flashcardData.question_media_id,
          answer_text: flashcardData.answer_text,
          answer_media_id: flashcardData.answer_media_id,
          list_id: listId,
          created_at: Date.now()
        };

        this.flashcards[listId].push(tempFlashcard);

        // Refresh flashcards in background to get real IDs
        this.fetchFlashcards(listId);

        return true;
      } catch (error) {
        console.error('Failed to create flashcard:', error);
        this.setError('Failed to create flashcard');
        return false;
      }
    },

    async updateFlashcard(
      id: string,
      listId: string,
      data: UpdateFlashcardData
    ): Promise<boolean> {
      try {
        this.setError(null);

        // Update local state immediately for responsive UI
        const flashcards = this.flashcards[listId];
        if (flashcards) {
          const flashcard = flashcards.find((f) => f.id === id);
          if (flashcard) {
            Object.assign(flashcard, data);
          }
        }

        await api(`/user-content/flashcard/${id}`, 'PATCH', data);

        return true;
      } catch (error) {
        console.error('Failed to update flashcard:', error);
        this.setError('Failed to update flashcard');

        await this.fetchFlashcards(listId);
        return false;
      }
    },

    async deleteFlashcard(id: string, listId: string): Promise<boolean> {
      try {
        this.setError(null);

        // Remove from local state immediately
        if (this.flashcards[listId]) {
          this.flashcards[listId] = this.flashcards[listId].filter(
            (f) => f.id !== id
          );
        }

        // Send delete to server in background
        await api('/user-content/flashcards', 'DELETE', {
          ids: [id]
        });

        return true;
      } catch (error) {
        console.error('Failed to delete flashcard:', error);
        this.setError('Failed to delete flashcard');

        // Revert local changes on error
        await this.fetchFlashcards(listId);
        return false;
      }
    },

    async deleteMultipleFlashcards(
      ids: string[],
      listId: string
    ): Promise<boolean> {
      try {
        this.setLoading(true);
        this.setError(null);

        await api('/user-content/flashcards', 'DELETE', { ids });

        // Remove from local state
        if (this.flashcards[listId]) {
          this.flashcards[listId] = this.flashcards[listId].filter(
            (f) => !ids.includes(f.id)
          );
        }

        return true;
      } catch (error) {
        console.error('Failed to delete flashcards:', error);
        this.setError('Failed to delete flashcards');
        return false;
      } finally {
        this.setLoading(false);
      }
    },

    async initialize() {
      await this.fetchLists();
    },

    clearAll() {
      this.lists = [];
      this.flashcards = {};
      this.error = null;
      this.loading = false;
    }
  }
});
