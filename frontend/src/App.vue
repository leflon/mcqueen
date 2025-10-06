<script setup lang="ts">
import { RouterView } from 'vue-router';
import MenuBar from './components/MenuBar.vue';
import { useUserStore } from './stores';
import { onMounted } from 'vue';

// Initialize store on mount.
const store = useUserStore();
onMounted(() => store.initializeAuth());
</script>

<template>
  <div class="app-layout">
    <div class="app-layout__menu">
      <MenuBar></MenuBar>
    </div>
    <div class="app-layout__content">
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.app-layout__menu {
  height: 80px;
}
.app-layout__content {
  position: relative;
  flex: 1;
  overflow: hidden;
}
</style>
