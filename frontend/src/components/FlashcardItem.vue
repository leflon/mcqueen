<template>
  <div class="flashcard-item">
    <div class="flashcard-item__content">
      <div class="flashcard-item__field">
        <label class="flashcard-item__label">Question</label>
        <input
          ref="questionInput"
          v-model="localQuestion"
          type="text"
          placeholder="Enter question..."
          class="flashcard-item__input"
          :class="{ 'flashcard-item__input--modified': isQuestionModified }"
          @input="onQuestionInput"
          @keydown.enter="confirmChanges"
        />
      </div>

      <div class="flashcard-item__field">
        <label class="flashcard-item__label">Answer</label>
        <input
          ref="answerInput"
          v-model="localAnswer"
          type="text"
          placeholder="Enter answer..."
          class="flashcard-item__input"
          :class="{ 'flashcard-item__input--modified': isAnswerModified }"
          @input="onAnswerInput"
          @keydown.enter="confirmChanges"
        />
      </div>

      <div class="flashcard-item__actions">
        <IconButton
          v-if="hasChanges"
          variant="accent"
          size="md"
          ariaLabel="Confirm changes"
          :loading="saving"
          @click="confirmChanges"
        >
          <Check :size="18" />
        </IconButton>

        <IconButton
          variant="danger"
          size="md"
          ariaLabel="Delete flashcard"
          :loading="deleting"
          @click="confirmDelete"
        >
          <Trash2 :size="18" />
        </IconButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Check, Trash2 } from 'lucide-vue-next';
import IconButton from './IconButton.vue';
import type { Flashcard } from '../stores';

interface Props {
  flashcard: Flashcard;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  update: [data: { question_text: string | null; answer_text: string | null }];
  delete: [];
}>();

// Local state for editing
const localQuestion = ref(props.flashcard.question_text || '');
const localAnswer = ref(props.flashcard.answer_text || '');
const saving = ref(false);
const deleting = ref(false);

// Input refs
const questionInput = ref<HTMLInputElement>();
const answerInput = ref<HTMLInputElement>();

// Computed properties
const isQuestionModified = computed(
  () => localQuestion.value !== (props.flashcard.question_text || '')
);

const isAnswerModified = computed(
  () => localAnswer.value !== (props.flashcard.answer_text || '')
);

const hasChanges = computed(
  () => isQuestionModified.value || isAnswerModified.value
);

// Watch for prop changes to update local state
watch(
  () => props.flashcard,
  (newFlashcard) => {
    if (!hasChanges.value) {
      localQuestion.value = newFlashcard.question_text || '';
      localAnswer.value = newFlashcard.answer_text || '';
    }
  },
  { deep: true }
);

// Methods
const onQuestionInput = () => {
  // Auto-resize or any other input handling can go here
};

const onAnswerInput = () => {
  // Auto-resize or any other input handling can go here
};

const confirmChanges = async () => {
  if (!hasChanges.value) return;

  if (!localQuestion.value.trim() || !localAnswer.value.trim()) {
    alert('Both question and answer are required');
    return;
  }

  saving.value = true;

  try {
    emit('update', {
      question_text: localQuestion.value.trim(),
      answer_text: localAnswer.value.trim()
    });
  } catch (error) {
    console.error('Failed to update flashcard:', error);
  } finally {
    saving.value = false;
  }
};

const confirmDelete = () => {
  if (confirm('Are you sure you want to delete this flashcard?')) {
    deleting.value = true;
    emit('delete');
  }
};
</script>

<style scoped>
.flashcard-item {
  background-color: var(--color-accent);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease-in-out;
  border: 1px solid transparent;
}

.flashcard-item:hover {
  box-shadow: var(--shadow-md);
}

.flashcard-item:focus-within {
  border-color: var(--color-blue-secondary);
}

.flashcard-item__content {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: var(--spacing-md);
  align-items: start;
}

.flashcard-item__field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.flashcard-item__label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-blue-main);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.flashcard-item__input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  background-color: var(--color-white);
  color: var(--color-blue-main);
  font-size: 0.875rem;
  line-height: 1.25rem;
  transition: all 0.2s ease-in-out;
}

.flashcard-item__input:focus {
  border-color: var(--color-blue-secondary);
  outline: none;
}

.flashcard-item__input--modified {
  border-color: var(--color-blue-secondary);
  background-color: #f8fbff;
}

.flashcard-item__input::placeholder {
  color: var(--color-gray-medium);
}

.flashcard-item__actions {
  display: flex;
  gap: var(--spacing-xs);
  align-items: center;
  margin-top: 1.25rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .flashcard-item__content {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }

  .flashcard-item__actions {
    justify-content: flex-end;
    margin-bottom: 0;
  }
}

@media (max-width: 640px) {
  .flashcard-item {
    padding: var(--spacing-sm);
  }

  .flashcard-item__input {
    font-size: 0.75rem;
    padding: var(--spacing-xs) var(--spacing-sm);
  }
}
</style>
