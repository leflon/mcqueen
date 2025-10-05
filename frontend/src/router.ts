import { createRouter, createWebHistory } from 'vue-router';

import Auth from './views/Auth.vue';
import CheckFlashcards from './views/Check_flashcards.vue';
import Edit_mode from './views/Creation_and_Edit_mode.vue';
import Home from './views/Home.vue';
import Practice from './views/Practice.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/flashcards',
    name: 'CheckFlashcards',
    component: CheckFlashcards
  },
  {
    path: '/edit_mode',
    name: 'Edit_mode',
    component: Edit_mode
  },
  {
    path: '/practice',
    name: 'Practice',
    component: Practice
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  }
];

export const router = createRouter({
  history: createWebHistory(),
  routes
});
