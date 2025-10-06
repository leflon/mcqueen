<template>
  <button
    :class="[
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      {
        'btn--loading': loading,
        'btn--full-width': fullWidth
      }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="btn__spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'accent' | 'blue' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false
});

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  border-radius: var(--radius-lg);
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}

.btn:focus {
  outline: 2px solid var(--color-blue-secondary);
  outline-offset: 2px;
}

.btn:active {
  transform: translateY(1px);
}

/* Sizes */
.btn--sm {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.btn--md {
  padding: var(--spacing-md) var(--spacing-lg);
  font-size: 1rem;
  line-height: 1.5rem;
}

.btn--lg {
  padding: var(--spacing-lg) var(--spacing-xl);
  font-size: 1.125rem;
  line-height: 1.75rem;
}

/* Variants */
.btn--primary {
  background-color: var(--color-secondary);
  color: var(--color-white);
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--color-main);
  box-shadow: var(--shadow-md);
}

.btn--secondary {
  background-color: var(--color-blue-main);
  color: var(--color-white);
}

.btn--secondary:hover:not(:disabled) {
  background-color: var(--color-blue-secondary);
  box-shadow: var(--shadow-md);
}

.btn--danger {
  background-color: var(--color-danger);
  color: var(--color-white);
}

.btn--danger:hover:not(:disabled) {
  background-color: #b91c1c;
  box-shadow: var(--shadow-md);
}

.btn--accent {
  background-color: var(--color-accent);
  color: var(--color-blue-main);
}

.btn--accent:hover:not(:disabled) {
  background-color: #f7e7b8;
  box-shadow: var(--shadow-md);
}

.btn--blue {
  background-color: var(--color-blue-secondary);
  color: var(--color-white);
}

.btn--blue:hover:not(:disabled) {
  background-color: var(--color-blue-main);
  box-shadow: var(--shadow-md);
}

.btn--outline {
  background-color: transparent;
  color: var(--color-white);
  border: 2px solid var(--color-accent);
}

.btn--outline:hover:not(:disabled) {
  background-color: var(--color-accent);
  color: var(--color-blue-main);
}

/* Modifiers */
.btn--full-width {
  width: 100%;
}

.btn--loading {
  pointer-events: none;
}

/* Spinner */
.btn__spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
