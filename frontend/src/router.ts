import { createRouter, createWebHistory } from "vue-router";

import Home from "./views/Home.vue";
import CheckFlashcards from "./views/Check_flashcards.vue";
const routes = [
    {
        path: "/",
        name: "Home",
        component: Home
    },
    {
        path: "/flashcards",
        name: "CheckFlashcards",
        component: CheckFlashcards
    }

];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

