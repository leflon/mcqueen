<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <div class="dashboard__sidebar">
      <Sidebar :selected-list-id="selectedListId" @select-list="selectList" />
    </div>

    <!-- Main Content -->
    <div class="dashboard__main">
      <div v-if="!selectedListId" class="dashboard__welcome">
        <div class="dashboard__welcome-content">
          <h1>Welcome to Your Flashcards</h1>
          <p>Create your first flashcard list to get started!</p>
          <Button variant="accent" size="lg" @click="showCreateFirstList">
            Create Your First List
          </Button>
        </div>
      </div>

      <div v-else class="dashboard__content">
        <!-- Header -->
        <div class="dashboard__header">
          <div class="dashboard__header-info">
            <h1 class="dashboard__title">
              {{ selectedList?.name || 'Loading...' }}
            </h1>
            <p class="dashboard__subtitle">
              {{ flashcards.length }}
              {{ flashcards.length === 1 ? 'card' : 'cards' }}
            </p>
          </div>

          <div class="dashboard__header-actions">
            <Button variant="accent" @click="launchPractice">Practice</Button>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="dashboard__search">
          <SearchBar
            v-model="searchQuery"
            placeholder="Search flashcards..."
            @input="onSearchInput"
          />
        </div>

        <!-- Flashcards List -->
        <div class="dashboard__flashcards">
          <div v-if="loading" class="dashboard__loading">
            <div class="spinner"></div>
            <span>Loading flashcards...</span>
          </div>

          <div v-else-if="error" class="dashboard__error">
            <p>{{ error }}</p>
            <Button variant="accent" size="sm" @click="retryLoadFlashcards">
              Try Again
            </Button>
          </div>

          <div v-else class="dashboard__flashcards-list">
            <!-- New Flashcard Creator -->
            <FlashcardCreator @create="createFlashcard" />

            <!-- Empty State or Search Results -->
            <div
              v-if="filteredFlashcards.length === 0"
              class="dashboard__empty"
            >
              <div
                v-if="flashcards.length === 0"
                class="dashboard__empty-content"
              >
                <h3>No flashcards yet</h3>
                <p>
                  Add your first flashcard to this list using the form above!
                </p>
              </div>
              <div v-else class="dashboard__empty-content">
                <h3>No results found</h3>
                <p>No flashcards match your search: "{{ searchQuery }}"</p>
                <Button variant="outline" @click="clearSearch">
                  Clear Search
                </Button>
              </div>
            </div>

            <!-- Existing Flashcards -->
            <FlashcardItem
              v-for="flashcard in filteredFlashcards"
              :key="flashcard.id"
              :flashcard="flashcard"
              @update="(data) => updateFlashcard(flashcard.id, data)"
              @delete="deleteFlashcard(flashcard.id)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFlashcardStore } from '../stores';
import Sidebar from '../components/Sidebar.vue';
import SearchBar from '../components/SearchBar.vue';
import FlashcardItem from '../components/FlashcardItem.vue';
import FlashcardCreator from '../components/FlashcardCreator.vue';
import Button from '../components/Button.vue';

const route = useRoute();
const router = useRouter();
const flashcardStore = useFlashcardStore();

// Reactive state
const selectedListId = ref<string | null>(null);
const searchQuery = ref('');

// Computed properties
const flashcards = computed(() =>
  selectedListId.value
    ? flashcardStore.getFlashcardsByListId(selectedListId.value)
    : []
);
const selectedList = computed(() =>
  selectedListId.value ? flashcardStore.getListById(selectedListId.value) : null
);
const loading = computed(() => flashcardStore.loading);
const error = computed(() => flashcardStore.error);

const filteredFlashcards = computed(() => {
  if (!selectedListId.value) return [];
  return flashcardStore.searchFlashcards(
    selectedListId.value,
    searchQuery.value
  );
});

// Methods
const selectList = (listId: string) => {
  if (listId) {
    router.push(`/dashboard/${listId}`);
  }
};

const loadFlashcards = async (listId: string) => {
  if (listId && !flashcards.value.length) {
    await flashcardStore.fetchFlashcards(listId);
  }
};

const createFlashcard = async (data: {
  question_text: string;
  answer_text: string;
}) => {
  if (!selectedListId.value) return;

  try {
    await flashcardStore.createFlashcard(selectedListId.value, {
      question_text: data.question_text,
      question_media_id: null,
      answer_text: data.answer_text,
      answer_media_id: null
    });
  } catch (error) {
    console.error('Failed to create flashcard:', error);
  }
};

const updateFlashcard = async (
  flashcardId: string,
  data: { question_text: string | null; answer_text: string | null }
) => {
  if (!selectedListId.value) return;

  await flashcardStore.updateFlashcard(flashcardId, selectedListId.value, data);
};

const deleteFlashcard = async (flashcardId: string) => {
  if (!selectedListId.value) return;

  await flashcardStore.deleteFlashcard(flashcardId, selectedListId.value);
};

const onSearchInput = (query: string) => {
  searchQuery.value = query;
};

const clearSearch = () => {
  searchQuery.value = '';
};

const retryLoadFlashcards = () => {
  if (selectedListId.value) {
    flashcardStore.fetchFlashcards(selectedListId.value);
  }
};

const showCreateFirstList = () => {
  // This will trigger the sidebar to show the new list modal
  const sidebarComponent = document.querySelector('.sidebar');
  if (sidebarComponent) {
    const addButton = sidebarComponent.querySelector(
      '[aria-label="Create new list"]'
    ) as HTMLElement;
    addButton?.click();
  }
};

const launchPractice = () => {
  if (!selectedListId.value) return;
  router.push(`/practice/${selectedListId.value}`);
};

// Initialize and handle route changes
const initializeDashboard = async () => {
  // First ensure we have lists loaded
  await flashcardStore.initialize();

  // Get list ID from route
  const routeListId = route.params.list_id as string;

  if (routeListId) {
    selectedListId.value = routeListId;
    await loadFlashcards(routeListId);
  } else {
    // No list ID in route, redirect to first available list
    const firstListId = flashcardStore.firstAvailableListId;
    if (firstListId) {
      router.replace(`/dashboard/${firstListId}`);
    }
  }
};

// Watch for route changes
watch(
  () => route.params.list_id,
  async (newListId) => {
    if (newListId && typeof newListId === 'string') {
      selectedListId.value = newListId;
      await loadFlashcards(newListId);
    }
  }
);

// Watch for list selection changes
watch(selectedListId, async (newListId) => {
  if (newListId) {
    await loadFlashcards(newListId);
  }
});

// Initialize on mount
onMounted(() => {
  initializeDashboard();
});
</script>

<style scoped>
.dashboard {
  position: relative;
  box-sizing: border-box;
  display: flex;
  height: 100%;
}

.dashboard__sidebar {
  width: 300px;
  flex-shrink: 0;
  overflow: scroll;
  height: 100%;
}

.dashboard__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: var(--spacing-lg);
  padding-left: var(--spacing-lg);
  padding-bottom: 0px;
}

.dashboard__welcome {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.dashboard__welcome-content {
  text-align: center;
  max-width: 400px;
}

.dashboard__welcome-content h1 {
  margin-bottom: var(--spacing-md);
  color: var(--color-white);
}

.dashboard__welcome-content p {
  margin-bottom: var(--spacing-xl);
  color: var(--color-white);
  opacity: 0.8;
}

.dashboard__content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.dashboard__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-xs);
  flex-shrink: 0;
  overflow: hidden;
}
.dashboard__header-info {
  position: relative;
  width: 100%;
  overflow: hidden;
}
.dashboard__header-info h1 {
  color: var(--color-white);
  margin-bottom: var(--spacing-xs);
  text-overflow: ellipsis;
  white-space: nowrap;
  word-wrap: break-word;
  width: 100%;
  overflow: hidden;
}

.dashboard__header-info p {
  color: var(--color-white);
  opacity: 0.7;
  font-size: 0.875rem;
}

.dashboard__search {
  margin-bottom: var(--spacing-xl);
  flex-shrink: 0;
  padding: 3px;
}

.dashboard__flashcards {
  flex: 1;
  overflow-y: scroll;
  overflow-x: hidden;
}

.dashboard__loading,
.dashboard__error,
.dashboard__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  height: 300px;
  text-align: center;
}

.dashboard__loading .spinner {
  width: 3rem;
  height: 3rem;
  border: 3px solid transparent;
  border-top: 3px solid var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.dashboard__loading span,
.dashboard__error p {
  color: var(--color-white);
}

.dashboard__empty-content h3 {
  color: var(--color-white);
  margin-bottom: var(--spacing-sm);
}

.dashboard__empty-content p {
  color: var(--color-white);
  opacity: 0.7;
  margin-bottom: var(--spacing-lg);
}

.dashboard__flashcards-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding-bottom: var(--spacing-xl);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive design */
@media (max-width: 1024px) {
  .dashboard__sidebar {
    width: 250px;
  }

  .dashboard__main {
    padding: var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .dashboard {
    flex-direction: column;
  }

  .dashboard__sidebar {
    width: 100%;
    height: auto;
    max-height: 40vh;
    flex-shrink: 0;
  }

  .dashboard__main {
    flex: 1;
    padding: var(--spacing-md);
    overflow-y: auto;
  }

  .dashboard__header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }

  .dashboard__header-actions {
    align-self: center;
  }
}

@media (max-width: 640px) {
  .dashboard__main {
    padding: var(--spacing-sm);
  }

  .dashboard__header {
    margin-bottom: var(--spacing-lg);
  }

  .dashboard__search {
    margin-bottom: var(--spacing-lg);
  }
}
</style>
