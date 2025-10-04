import { createRouter, createWebHistory } from "vue-router";

import Home from "./views/Home.vue";
import CheckFlashcards from "./views/Check_flashcards.vue";
import Edit_mode from "./views/Edit_mode.vue";

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
    },
    {
        path: "/edit_mode",
        name: "Edit_mode",
        component: Edit_mode
    }

];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

