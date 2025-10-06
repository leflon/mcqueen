<script setup lang="ts">
import McCard from '../components/McCard.vue';
import McButton from '../components/McButton.vue';

import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../lib/api';

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const secondsOnCard = ref(0); //Time
const questionNumber = ref(1); //Question number

const isRecto = ref(true);

function chronometer(): void {
  setInterval(() => {
    secondsOnCard.value++;
  }, 1000);
}

function rectoVerso(): void {
  isRecto.value = !isRecto.value;
}

function secondsToMMSS(seconds: number): string {
  return `${Math.floor(seconds / 60)}:${seconds % 60 < 10 ? '0' + (seconds % 60) : seconds % 60}`;
}

function resetAction(): void {
  secondsOnCard.value = 0;
  questionNumber.value = 1;
  isRecto.value = true;
}

interface Flashcard {
  id: string;
  question_text: string | null;
  question_media_id: string | null;
  answer_text: string | null;
  answer_media_id: string | null;
  list_id: string;
  created_at: number;
}

const deck = ref<Flashcard[]>([]);
const list_title = ref('');

async function loadDeckFromBackend() {
  try {
    const data = await api(`/user-content/flashcards/${id}`, 'GET');
    deck.value = data['flashcards'];
  } catch (error) {
    console.log(error);
  }
}

async function get_list_info() {
  try {
    const data = await api('/user-content/collections', 'GET');
    let list_flashcards = data.lists.find((card: any) => card['id'] === id);
    list_title.value = list_flashcards?.name ?? '';
  } catch (err) {
    console.error(err);
  }
}

function exit(): void {
  router.push('/flashcards');
}

onMounted(() => {
  loadDeckFromBackend();

  get_list_info();
});
</script>

<template>
  <div class="Practice-page">
    <h1>Practice</h1>

    <div class="Title-section">
      <h2>{{ list_title }}</h2>
      <div class="Title-buttons">
        <button @click="resetAction">Reset</button>
        <button @click="exit">Exit</button>
      </div>
    </div>

    <div class="Stats-section">
      <div class="Stats-item">
        <p>{{ secondsToMMSS(secondsOnCard) }}</p>
      </div>
      <div class="Stats-item">
        <p>Question : {{ questionNumber }}</p>
      </div>
    </div>

    <McCard
      v-if="deck[questionNumber - 1]"
      :recto="isRecto"
      :rectoText="deck[questionNumber - 1].question_text"
      :versoText="deck[questionNumber - 1].answer_text"
      :questionNumber="questionNumber"
      @cardSeen="chronometer"
    />

    <div class="Control-buttons">
      <McButton
        variant="nextQuestion"
        @click="
          questionNumber > 1 ? (questionNumber--, (isRecto = true)) : null
        "
        >< previous question</McButton
      >
      <McButton variant="nextQuestion" @click="rectoVerso" v-if="!isRecto"
        >See Question</McButton
      >

      <McButton variant="nextQuestion" @click="rectoVerso" v-if="isRecto"
        >See Answer</McButton
      >
      <McButton
        variant="nextQuestion"
        @click="
          questionNumber == deck.length
            ? null
            : (questionNumber++, (isRecto = true))
        "
        >Next question ></McButton
      >
    </div>
  </div>
</template>

<style scoped>
.Practice-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
}

.Practice-page h1 {
  color: white;
  font-size: 48px;
  margin: 0;
  font-weight: bold;
}

.Title-section {
  background-color: #e9b796;
  width: 90%;
  max-width: 800px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 40px;
  border-radius: 15px;
}

.Title-section h2 {
  color: black;
  font-size: 36px;
  margin: 0;
  font-weight: bold;
}

.Title-buttons {
  display: flex;
  gap: 15px;
  position: absolute;
  transform: translateX(300px);
}

.Title-buttons button {
  background-color: transparent;
  border: 2px solid black;
  color: black;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.Stats-section {
  width: 90%;
  max-width: 800px;
  display: flex;
  justify-content: space-between;
}

.Stats-item {
  background-color: #a64039;
  color: white;
  padding: 15px 30px;
  border-radius: 10px;
  flex: 1;
  margin: 0 10px;
  text-align: center;
}

.Stats-item p {
  margin: 0;
  font-size: 20px;
  font-weight: bold;
}

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

.Control-buttons {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.Control-buttons button {
  background-color: #e9b796;
  border: none;
  color: black;
  padding: 15px 25px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  min-width: 150px;
}

.See-answer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
</style>
