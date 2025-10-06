<template>
  <div class="flashcard-creator">
    <div class="flashcard-creator__content">
      <div class="flashcard-creator__field">
        <label class="flashcard-creator__label">Question</label>
        <input
          v-model="question"
          type="text"
          placeholder="Enter question..."
          class="flashcard-creator__input"
          @keydown.enter="createFlashcard"
        />
      </div>

      <div class="flashcard-creator__field">
        <label class="flashcard-creator__label">Answer</label>
        <input
          v-model="answer"
          type="text"
          placeholder="Enter answer..."
          class="flashcard-creator__input"
          @keydown.enter="createFlashcard"
        />
      </div>

      <div class="flashcard-creator__actions">
        <IconButton
          variant="accent"
          size="md"
          ariaLabel="Add flashcard"
          :disabled="!canCreate"
          :loading="creating"
          @click="createFlashcard"
        >
          <Plus :size="18" />
        </IconButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus } from 'lucide-vue-next';
import IconButton from './IconButton.vue';

const emit = defineEmits<{
  create: [data: { question_text: string; answer_text: string }];
}>();

// Local state
const question = ref('');
const answer = ref('');
const creating = ref(false);

// Computed properties
const canCreate = computed(() => question.value.trim() && answer.value.trim());

// Methods
const createFlashcard = async () => {
  if (!canCreate.value || creating.value) return;

  creating.value = true;

  try {
    emit('create', {
      question_text: question.value.trim(),
      answer_text: answer.value.trim()
    });

    // Clear fields after successful creation
    clearFields();
  } catch (error) {
    console.error('Failed to create flashcard:', error);
  } finally {
    creating.value = false;
  }
};

const clearFields = () => {
  question.value = '';
  answer.value = '';
};
</script>

<style scoped>
.flashcard-creator {
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  transition: all 0.2s ease-in-out;
  border: 1px dashed rgba(255, 255, 255, 0.3);
}

.flashcard-creator:hover {
  background-color: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.5);
}

.flashcard-creator:focus-within {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: var(--color-blue-secondary);
  border-style: solid;
}

.flashcard-creator__content {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: var(--spacing-md);
  align-items: start;
}

.flashcard-creator__field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.flashcard-creator__label {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.flashcard-creator__input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-sm);
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 0.2s ease-in-out;
}

.flashcard-creator__input:focus {
  border-color: var(--color-blue-secondary);
  background-color: rgba(255, 255, 255, 0.15);
  outline: none;
}

.flashcard-creator__input::placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-style: italic;
}

.flashcard-creator__actions {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
  margin-top: 1.25rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .flashcard-creator__content {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .flashcard-creator__actions {
    justify-content: flex-end;
    margin-bottom: 0;
  }
}

@media (max-width: 640px) {
  .flashcard-creator {
    padding: var(--spacing-sm);
  }

  .flashcard-creator__input {
    font-size: 0.75rem;
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}
</style>
