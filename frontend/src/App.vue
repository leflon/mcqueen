<script setup lang="ts">
import { RouterView } from 'vue-router';
import McMenu from './components/McMenu.vue';
import { useUserStore } from './store';
import { onMounted } from 'vue';

// Initialize store on mount.
const store = useUserStore();
onMounted(() => store.initializeAuth());
</script>

<template>
  <McMenu></McMenu>
  <RouterView></RouterView>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
