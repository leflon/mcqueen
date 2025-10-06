<template>
  <div class="search-bar">
    <div class="search-bar__input-wrapper">
      <input
        v-model="localValue"
        type="text"
        :placeholder="placeholder"
        class="search-bar__input"
        @input="onInput"
        @keydown.enter="onEnter"
      />
      <IconButton
        v-if="localValue"
        variant="ghost"
        size="sm"
        ariaLabel="Clear search"
        class="search-bar__clear"
        @click="clearSearch"
      >
        <X :size="16" />
      </IconButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { X } from 'lucide-vue-next';
import IconButton from './IconButton.vue';

interface Props {
  modelValue?: string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Search...'
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  input: [value: string];
  clear: [];
}>();

const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
  }
);

const onInput = () => {
  emit('update:modelValue', localValue.value);
  emit('input', localValue.value);
};

const onEnter = () => {
  emit('input', localValue.value);
};

const clearSearch = () => {
  localValue.value = '';
  emit('update:modelValue', '');
  emit('input', '');
  emit('clear');
};
</script>

<style scoped>
.search-bar {
  width: 100%;
}

.search-bar__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease-in-out;
}

.search-bar__input-wrapper:focus-within {
  box-shadow: var(--shadow-md);
  outline: 2px solid var(--color-blue-secondary);
}

.search-bar__input {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: transparent;
  color: var(--color-blue-main);
  font-size: 1rem;
  line-height: 1.5rem;
  border-radius: var(--radius-lg);
}

.search-bar__input::placeholder {
  color: var(--color-gray-medium);
}

.search-bar__clear {
  margin-right: var(--spacing-sm);
  color: var(--color-gray-medium);
}

.search-bar__clear:hover {
  color: var(--color-blue-main);
}
</style>
