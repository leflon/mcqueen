<script setup lang="ts">
import Button from '../components/Button.vue';
import IconButton from '../components/IconButton.vue';
import FlipCard from '../components/FlipCard.vue';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { api } from '../lib/api';
import {
  Shuffle,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Home
} from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const id = route.params.id;

const currentCardTime = ref(0);
const questionNumber = ref(1);
const isFlipped = ref(false);
const isShuffled = ref(false);

let timer: number | null = null;

function startTimer(): void {
  if (timer) clearInterval(timer);
  currentCardTime.value = 0;
  timer = setInterval(() => {
    currentCardTime.value++;
  }, 1000);
}

function stopTimer(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function flipCard(): void {
  isFlipped.value = !isFlipped.value;
}

function formatTimer(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`;
}

function resetSession(): void {
  stopTimer();
  currentCardTime.value = 0;
  questionNumber.value = 1;
  isFlipped.value = false;
  if (isShuffled.value) {
    shuffleDeck();
  }
}

function shuffleDeck(): void {
  const shuffled = [...originalDeck.value];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  deck.value = shuffled;
}

function toggleShuffle(): void {
  isShuffled.value = !isShuffled.value;
  if (isShuffled.value) {
    shuffleDeck();
  } else {
    deck.value = [...originalDeck.value];
  }
  questionNumber.value = 1;
  isFlipped.value = false;
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
const originalDeck = ref<Flashcard[]>([]);
const list_title = ref('');

const currentCard = computed(() => {
  const card = deck.value[questionNumber.value - 1];
  return card || null;
});

const canGoPrevious = computed(() => questionNumber.value > 1);
const canGoNext = computed(() => questionNumber.value < deck.value.length);

const progressPercentage = computed(() => {
  if (deck.value.length === 0) return 0;
  return ((questionNumber.value - 1) / deck.value.length) * 100;
});

async function loadDeck() {
  try {
    const data = await api(`/user-content/flashcards/${id}`, 'GET');
    const flashcards = data['flashcards'] || [];
    originalDeck.value = flashcards;
    deck.value = [...flashcards];
  } catch (error) {
    console.error('Failed to load flashcards:', error);
  }
}

async function loadListInfo() {
  try {
    const data = await api('/user-content/collections', 'GET');
    const list = data.lists.find((card: any) => card['id'] === id);
    list_title.value = list?.name ?? 'Unknown List';
  } catch (error) {
    console.error('Failed to load list info:', error);
  }
}

function goToPrevious(): void {
  if (canGoPrevious.value) {
    questionNumber.value--;
    isFlipped.value = false;
    startTimer();
  }
}

function goToNext(): void {
  if (canGoNext.value) {
    questionNumber.value++;
    isFlipped.value = false;
    startTimer();
  }
}

function exitPractice(): void {
  stopTimer();
  router.push('/dashboard');
}

onMounted(() => {
  loadDeck();
  loadListInfo();
  startTimer();
});
</script>

<template>
  <div class="practice-page">
    <!-- Header -->
    <div class="practice-header">
      <div class="header-content">
        <h1>Practice Session</h1>
        <div class="header-actions">
          <IconButton
            variant="ghost"
            size="sm"
            ariaLabel="Toggle shuffle"
            :class="{ 'shuffle-active': isShuffled }"
            @click="toggleShuffle"
          >
            <Shuffle :size="18" />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            ariaLabel="Reset session"
            @click="resetSession"
          >
            <RotateCcw :size="18" />
          </IconButton>
          <IconButton
            variant="ghost"
            size="sm"
            ariaLabel="Exit practice"
            @click="exitPractice"
          >
            <Home :size="18" />
          </IconButton>
        </div>
      </div>
    </div>

    <!-- List Title & Progress -->
    <div class="list-section">
      <h2>{{ list_title }}</h2>
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Stats -->
    <div class="stats-section">
      <div class="stat-card">
        <span class="stat-value">{{ formatTimer(currentCardTime) }}</span>
        <span class="stat-label">Time on Card</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{ questionNumber }} / {{ deck.length }}</span>
        <span class="stat-label">Progress</span>
      </div>
      <div class="stat-card">
        <span class="stat-value">{{
          isShuffled ? 'Shuffled' : 'Sequential'
        }}</span>
        <span class="stat-label">Mode</span>
      </div>
    </div>

    <!-- Card -->
    <div class="card-container" v-if="currentCard">
      <FlipCard
        :is-flipped="isFlipped"
        :front-title="`Question ${questionNumber}`"
        back-title="Answer"
        :front-text="currentCard.question_text || 'No question text available'"
        :back-text="currentCard.answer_text || 'No answer text available'"
        height="100%"
        @flip="flipCard"
      />
    </div>

    <!-- Controls -->
    <div class="controls-section">
      <Button
        variant="secondary"
        size="md"
        :disabled="!canGoPrevious"
        @click="goToPrevious"
      >
        <ArrowLeft :size="18" />
        Previous
      </Button>

      <Button variant="accent" size="md" @click="flipCard">
        <Eye v-if="isFlipped" :size="18" />
        <EyeOff v-else :size="18" />
        {{ isFlipped ? 'Show Answer' : 'Show Question' }}
      </Button>

      <Button
        variant="secondary"
        size="md"
        :disabled="!canGoNext"
        @click="goToNext"
      >
        Next
        <ArrowRight :size="18" />
      </Button>
    </div>

    <!-- Empty State -->
    <div v-if="!currentCard && deck.length === 0" class="empty-state">
      <h3>No flashcards available</h3>
      <p>This list doesn't contain any flashcards yet.</p>
      <Button variant="primary" @click="exitPractice"> Go Back </Button>
    </div>
  </div>
</template>

<style scoped>
.practice-page {
  padding: var(--spacing-sm) var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  max-width: 1000px;
  margin: 0 auto;
  overflow-y: scroll;
  height: 100%;
}

/* Header */
.practice-header {
  display: flex;
  justify-content: center;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  overflow: hidden;
}

.header-content h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-white);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.shuffle-active {
  background-color: var(--color-accent) !important;
  color: var(--color-blue-main) !important;
}

/* List Section */
.list-section {
  background-color: var(--color-accent);
  padding: var(--spacing-md);
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-md);
}

.list-section h2 {
  color: var(--color-blue-main);
  font-size: 1.5rem;
  margin-bottom: var(--spacing-sm);
  text-overflow: ellipsis;
  overflow: hidden;
}

.progress-bar {
  width: 100%;
  height: 6px;
  background-color: rgba(0, 48, 73, 0.2);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-blue-main);
  transition: width 0.3s ease-in-out;
  border-radius: var(--radius-lg);
}

/* Stats */
.stats-section {
  display: grid;
  margin: var(--spacing-sm) 0;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-sm);
}

.stat-card {
  background-color: var(--color-secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  text-align: center;
  box-shadow: var(--shadow-sm);
  border: 2px solid transparent;
  transition: all 0.2s ease-in-out;
}

.stat-card:hover {
  border-color: var(--color-blue-secondary);
  transform: translateY(-1px);
}

.stat-value {
  display: block;
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-blue-secondary);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Card */
.card-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  max-height: 40vh;
  padding: var(--spacing-sm) 0;
}

.card-container :deep(.flip-card) {
  width: 100%;
  max-width: 700px;
  height: 100%;
}

/* Controls */
.controls-section {
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xs) 0;
  flex-shrink: 0;
}

.controls-section .btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  min-width: 130px;
}

/* Empty State */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-lg);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  padding: var(--spacing-xl);
}

.empty-state h3 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-sm);
  color: var(--color-white);
}

.empty-state p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: var(--spacing-md);
}

/* Responsive Design */
@media (max-width: 768px) {
  .practice-page {
    padding: var(--spacing-sm);
  }

  .header-content {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }

  .header-content h1 {
    font-size: 1.5rem;
  }

  .stats-section {
    grid-template-columns: 1fr;
    gap: var(--spacing-xs);
  }

  .stat-card {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .stat-value {
    font-size: 1rem;
  }

  .card-container {
    max-height: 220px;
  }

  .controls-section {
    flex-wrap: wrap;
    gap: var(--spacing-sm);
  }

  .controls-section .btn {
    min-width: 100px;
  }
}

@media (max-width: 480px) {
  .header-content h1 {
    font-size: 1.25rem;
  }

  .list-section h2 {
    font-size: 1.25rem;
  }

  .card-container {
    max-height: 180px;
  }

  .controls-section {
    flex-direction: column;
  }

  .controls-section .btn {
    width: 100%;
  }
}
</style>
