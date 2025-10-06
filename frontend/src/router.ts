import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type NavigationGuardNext
} from 'vue-router';
import { useFlashcardStore } from './stores';

import Home from './views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('./views/Dashboard.vue'),
    beforeEnter: async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ) => {
      const flashcardStore = useFlashcardStore();
      await flashcardStore.initialize();

      const firstListId = flashcardStore.firstAvailableListId;
      if (firstListId) {
        next(`/dashboard/${firstListId}`);
      } else {
        next();
      }
    }
  },
  {
    path: '/dashboard/:list_id',
    name: 'DashboardWithList',
    component: () => import('./views/Dashboard.vue')
  },
  {
    path: '/practice/:id',
    name: 'Practice',
    component: () => import('./views/Practice.vue')
  },
  {
    path: '/auth',
    name: 'Auth',
    component: () => import('./views/Auth.vue')
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
