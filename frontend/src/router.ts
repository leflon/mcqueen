import { createRouter, createWebHistory } from 'vue-router';

import Home from './views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/flashcards',
    name: 'CheckFlashcards',
    component: () => import('./views/Check_flashcards.vue')
  },
  {
    path: '/edit_mode/:id',
    name: 'Edit_mode',
    component: () => import('./views/Edit_mode.vue')
  },
  {
    path: '/practice/:id',
    name: 'Practice',
    component: () => import('./views/Practice.vue')
  },
  {
    path: '/creation_mode',
    name: 'Creation_mode',
    component: () => import('./views/Creation_mode.vue')
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
