import { defineStore } from 'pinia';
import { api } from '../lib/api';
import type { User } from './types';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null
  }),

  getters: {
    currentUser: (state): User | null => state.user
  },

  actions: {
    setUser(user: User | null) {
      this.user = user;
    },

    clearUser() {
      this.user = null;
    },

    async initializeAuth() {
      try {
        const response = await api('/auth/me', 'GET');
        if (response.id && response.username) {
          this.setUser({
            id: response.id,
            username: response.username
          });
        } else {
          this.clearUser();
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        this.clearUser();
      }
    }
  }
});
