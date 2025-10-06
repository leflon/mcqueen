<template>
  <div class="sidebar">
    <div class="sidebar__header">
      <h2 class="sidebar__title">My Flashcards</h2>
      <IconButton
        variant="accent"
        size="md"
        ariaLabel="Create new list"
        @click="showNewListModal = true"
      >
        <Plus :size="20" />
      </IconButton>
    </div>

    <div class="sidebar__content">
      <div v-if="loading" class="sidebar__loading">
        <div class="spinner"></div>
        <span>Loading lists...</span>
      </div>

      <div v-else-if="error" class="sidebar__error">
        <p>{{ error }}</p>
        <Button variant="accent" size="sm" @click="retry"> Try Again </Button>
      </div>

      <div v-else-if="lists.length === 0" class="sidebar__empty">
        <p>No flashcard lists yet</p>
        <Button variant="accent" size="sm" @click="showNewListModal = true">
          Create Your First List
        </Button>
      </div>

      <div v-else class="sidebar__lists">
        <SidebarListItem
          v-for="list in lists"
          :key="list.id"
          :list="list"
          :is-active="selectedListId === list.id"
          @select="$emit('selectList', list.id)"
          @update="(name) => updateList(list.id, name)"
          @delete="deleteList(list.id)"
        />
      </div>
    </div>

    <!-- New List Modal -->
    <div
      v-if="showNewListModal"
      class="modal-overlay"
      @click="closeNewListModal"
    >
      <div class="modal" @click.stop>
        <div class="modal__header">
          <h3>Create New List</h3>
          <IconButton
            variant="ghost"
            size="sm"
            ariaLabel="Close modal"
            @click="closeNewListModal"
          >
            <X :size="20" />
          </IconButton>
        </div>

        <div class="modal__content">
          <input
            ref="newListInput"
            v-model="newListName"
            type="text"
            placeholder="Enter list name..."
            class="modal__input"
            @keydown.enter="createNewList"
            @keydown.escape="closeNewListModal"
          />
        </div>

        <div class="modal__actions">
          <Button @click="closeNewListModal"> Cancel </Button>
          <Button
            variant="accent"
            :disabled="!newListName.trim()"
            :loading="creatingList"
            @click="createNewList"
          >
            Create List
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Plus, X } from 'lucide-vue-next';
import { useFlashcardStore } from '../stores';
import Button from './Button.vue';
import IconButton from './IconButton.vue';
import SidebarListItem from './SidebarListItem.vue';

interface Props {
  selectedListId?: string | null;
}

const emit = defineEmits<{
  selectList: [listId: string];
}>();

const props = defineProps<Props>();
const flashcardStore = useFlashcardStore();

// Modal state
const showNewListModal = ref(false);
const newListName = ref('');
const newListInput = ref<HTMLInputElement>();
const creatingList = ref(false);

// Computed properties
const lists = computed(() => flashcardStore.lists);
const loading = computed(() => flashcardStore.loading);
const error = computed(() => flashcardStore.error);

// Methods

const closeNewListModal = () => {
  showNewListModal.value = false;
  newListName.value = '';
  creatingList.value = false;
};

const createNewList = async () => {
  if (!newListName.value.trim()) return;

  creatingList.value = true;

  try {
    const listId = await flashcardStore.createList(newListName.value.trim());

    if (listId) {
      // Select the newly created list
      emit('selectList', listId);
      closeNewListModal();
    }
  } catch (error) {
    console.error('Failed to create list:', error);
  } finally {
    creatingList.value = false;
  }
};

const updateList = async (listId: string, newName: string) => {
  await flashcardStore.updateList(listId, newName);
};

const deleteList = async (listId: string) => {
  const success = await flashcardStore.deleteList(listId);

  if (success && props.selectedListId === listId) {
    // If we deleted the currently selected list, select another one
    const remainingLists = flashcardStore.lists;
    if (remainingLists.length > 0) {
      emit('selectList', remainingLists[0]?.id || '');
    } else {
      emit('selectList', '');
    }
  }
};

const retry = () => {
  flashcardStore.fetchLists();
};

// Initialize
onMounted(() => {
  if (lists.value.length === 0) {
    flashcardStore.fetchLists();
  }
});
</script>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-secondary);
  border-radius: 0 var(--radius-lg) 0 0;
  overflow: hidden;
}

.sidebar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar__title {
  color: var(--color-white);
  font-size: 1.25rem;
  font-weight: 600;
}

.sidebar__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-md);
}

.sidebar__loading,
.sidebar__error,
.sidebar__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--color-white);
}

.sidebar__loading .spinner {
  width: 2rem;
  height: 2rem;
  border: 2px solid transparent;
  border-top: 2px solid var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.sidebar__error p,
.sidebar__empty p {
  font-size: 0.875rem;
  color: var(--color-gray-medium);
}

.sidebar__lists {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  width: 90%;
  max-width: 400px;
  overflow: hidden;
}

.modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-gray-light);
}

.modal__header h3 {
  color: var(--color-blue-main);
  font-size: 1.125rem;
  font-weight: 600;
}

.modal__content {
  padding: var(--spacing-lg);
}

.modal__input {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-gray-light);
  border-radius: var(--radius-md);
  font-size: 1rem;
  color: var(--color-blue-main);
  background-color: var(--color-white);
}

.modal__input:focus {
  border-color: var(--color-blue-secondary);
  outline: none;
}

.modal__input::placeholder {
  color: var(--color-gray-medium);
}

.modal__actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-gray-light);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sidebar {
    border-radius: 0;
  }

  .sidebar__header {
    padding: var(--spacing-md);
  }

  .sidebar__title {
    font-size: 1.125rem;
  }

  .modal {
    width: 95%;
    margin: var(--spacing-md);
  }
}
</style>
