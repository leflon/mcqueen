<template>
  <div
    class="sidebar-list-item"
    :class="{ 'sidebar-list-item--active': isActive }"
  >
    <div
      v-if="!isEditing"
      class="sidebar-list-item__content"
      @click="$emit('select')"
    >
      <span class="sidebar-list-item__name">{{ list.name }}</span>
      <div class="sidebar-list-item__actions">
        <IconButton
          variant="ghost"
          size="sm"
          ariaLabel="Edit list name"
          @click.stop="startEditing"
        >
          <Edit2 :size="14" />
        </IconButton>
        <IconButton
          variant="ghost"
          size="sm"
          ariaLabel="Delete list"
          @click.stop="confirmDelete"
        >
          <Trash2 :size="14" />
        </IconButton>
      </div>
    </div>

    <div v-else class="sidebar-list-item__edit">
      <input
        ref="editInput"
        v-model="editName"
        type="text"
        class="sidebar-list-item__input"
        @keydown.enter="saveEdit"
        @keydown.escape="cancelEdit"
        @blur="saveEdit"
      />
      <div class="sidebar-list-item__edit-actions">
        <IconButton
          variant="accent"
          size="sm"
          ariaLabel="Save changes"
          @click="saveEdit"
        >
          <Check :size="14" />
        </IconButton>
        <IconButton
          variant="ghost"
          size="sm"
          ariaLabel="Cancel editing"
          @click="cancelEdit"
        >
          <X :size="14" />
        </IconButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import { Edit2, Trash2, Check, X } from 'lucide-vue-next';
import IconButton from './IconButton.vue';
import type { FlashcardList } from '../stores';

interface Props {
  list: FlashcardList;
  isActive?: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  select: [];
  update: [name: string];
  delete: [];
}>();

const isEditing = ref(false);
const editName = ref('');
const editInput = ref<HTMLInputElement>();

const startEditing = async () => {
  editName.value = props.list.name;
  isEditing.value = true;
  await nextTick();
  editInput.value?.focus();
  editInput.value?.select();
};

const saveEdit = () => {
  if (editName.value.trim() && editName.value.trim() !== props.list.name) {
    emit('update', editName.value.trim());
  }
  cancelEdit();
};

const cancelEdit = () => {
  isEditing.value = false;
  editName.value = '';
};

const confirmDelete = () => {
  if (
    confirm(
      `Are you sure you want to delete "${props.list.name}"? This will also delete all flashcards in this list.`
    )
  ) {
    emit('delete');
  }
};
</script>

<style scoped>
.sidebar-list-item {
  border-radius: var(--radius-md);
  transition: all 0.2s ease-in-out;
  margin-bottom: var(--spacing-xs);
}

.sidebar-list-item:not(.sidebar-list-item--active):hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.sidebar-list-item--active {
  background-color: var(--color-accent);
}

.sidebar-list-item--active .sidebar-list-item__name {
  color: var(--color-blue-main);
  font-weight: 600;
}

.sidebar-list-item--active .sidebar-list-item__actions {
  opacity: 1;
}

.sidebar-list-item__content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  cursor: pointer;
  min-height: 3rem;
}

.sidebar-list-item__name {
  flex: 1;
  color: var(--color-white);
  font-weight: 500;
  font-size: 0.875rem;
  line-height: 1.25rem;
  margin-right: var(--spacing-sm);
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  transition: color 0.2s ease-in-out;
}

.sidebar-list-item__actions {
  display: flex;
  gap: var(--spacing-xs);
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.sidebar-list-item:hover .sidebar-list-item__actions {
  opacity: 1;
}

.sidebar-list-item__edit {
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  min-height: 3rem;
}

.sidebar-list-item__input {
  display: block;
  width: 100%;
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  background-color: var(--color-white);
  color: var(--color-blue-main);
  font-size: 0.875rem;
  line-height: 1.25rem;
  border: 2px solid transparent;
}

.sidebar-list-item__input:focus {
  border-color: var(--color-blue-secondary);
  outline: none;
}

.sidebar-list-item__edit-actions {
  display: flex;
  gap: var(--spacing-xs);
}

@media (max-width: 768px) {
  .sidebar-list-item__actions {
    opacity: 1; /* Always show on mobile */
  }

  .sidebar-list-item__name {
    font-size: 0.8rem;
  }
}
</style>
