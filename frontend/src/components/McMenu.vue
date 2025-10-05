<template>
  <div class="Menu">
    <RouterLink to="/" class="Menu-Logo">
      <img src="/images/cars-flash-mc-queen-verso.png" alt="Mcqueen" />
      <h1>Flash Cards McQueen</h1>
    </RouterLink>
    <div class="Menu-buttons">
      <RouterLink to="/flashcards">Your Cards</RouterLink>
      <RouterLink to="/edit_mode">Edit mode</RouterLink>
      <RouterLink to="/practice">Practice</RouterLink>
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
import { useUserStore } from '../store';
const store = useUserStore();
</script>

<style scoped>
.Menu {
  display: flex;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  height: 70px;
}

.Menu-Logo {
  width: 40%;
  display: flex;
  align-items: center;
  gap: 20px;
}

.Menu-Logo h1 {
  font-size: 30px;
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
  transition: background-color 0.3s;
  font-family: 'Inter';
}

.Menu-buttons {
  width: 60%;
  display: flex;
  justify-content: right;
}

.auth {
  background: #bb0000;
}
</style>
