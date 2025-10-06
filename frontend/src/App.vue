<script setup lang="ts">
import { RouterView } from 'vue-router';
import MenuBar from './components/MenuBar.vue';
import { useUserStore } from './store';
import { onMounted } from 'vue';

// Initialize store on mount.
const store = useUserStore();
onMounted(() => store.initializeAuth());
</script>

<template>
  <MenuBar></MenuBar>
  <RouterView></RouterView>
</template>
