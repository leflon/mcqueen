import { createRouter, createWebHistory } from "vue-router";

import Home from "./views/Home.vue";
import CheckFlashcards from "./views/Check_flashcards.vue";
import Edit_mode from "./views/Edit_mode.vue";
import Practice from "./views/Practice.vue";
import Creation_mode from "./views/Creation_mode.vue";

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
        path: "/edit_mode/:id",
        name: "Edit_mode",
        component: Edit_mode
    },
    {
        path: "/practice",
        name: "Practice",
        component: Practice
    },
    {
        path: "/creation_mode",
        name: "Creation_mode",
        component: Creation_mode
    }

];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

