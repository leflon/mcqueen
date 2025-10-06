<script setup lang="ts">

import { ref, onMounted } from 'vue'

const emit = defineEmits(['cardSeen']) // le moment à partir duquel l'utilisateur à commencé à voir la carte


interface Props {
  questionNumber: number,
  recto: boolean,
  rectoText: string,
  versoText: string,
  
}

const props = defineProps<Props>()


onMounted( () => {
  emit('cardSeen')
})

</script>

<template>
  <div class="Question-card">
    <h3 v-if='recto'>{{ questionNumber ? 'Question '+questionNumber : ' ' }}</h3>
    <p v-if='recto'>{{ rectoText }}</p>
    <p v-else>{{ versoText }}</p>
  </div>
  
</template>

<style scoped>

.Question-card {
    background-color: #ade1ee;
    width: 90%;
    max-width: 800px;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 40px;
    border-radius: 20px;
    text-align: center;
}

.Question-card h3 {
    color: black;
    font-size: 24px;
    margin: 0 0 30px 0;
    font-weight: bold;
}

.Question-card p {
    color: black;
    font-size: 20px;
    margin: 0;
    line-height: 1.4;
}

</style>
