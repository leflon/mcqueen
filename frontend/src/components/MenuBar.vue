<template>
  <div class="Menu">
    <RouterLink to="/" class="Menu-Logo">
      <img src="/images/cars-flash-mc-queen-verso.png" alt="Mcqueen" />
      <h1>McQueen</h1>
    </RouterLink>
    <div class="Menu-buttons">
      <RouterLink to="/dashboard" v-if="store.currentUser"
        >Dashboard</RouterLink
      >
      <RouterLink class="auth" to="/auth">
        <div v-if="store.currentUser">
          {{ store.currentUser.username }} (Sign out)
        </div>
        <div v-else>Sign in</div>
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useUserStore } from '../stores';
const store = useUserStore();
</script>

<style scoped>
.Menu {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 100%;
}

.Menu-Logo {
  display: flex;
  align-items: center;
  gap: 5px;
}

.Menu-Logo h1 {
  font-size: 30px;
  color: var(--color-accent);
  text-shadow: 3px 3px 3px #0003;
}

img {
  width: 100px;
  height: auto;
}

a {
  text-decoration: none;
  color: white;
  font-weight: bold;
  padding: 10px 15px;
  margin: 0 10px;
  border-radius: 5px;
  transition: 0.25s ease;
  font-family: 'Inter';
}

a:not(.Menu-Logo):hover {
  background: var(--color-accent);
  color: var(--color-blue-main);
}

.Menu-buttons {
  width: 60%;
  display: flex;
  justify-content: right;
}

.auth {
  background: var(--color-secondary);
}
</style>
