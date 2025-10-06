<template>
  <button
    :class="[
      'icon-btn',
      `icon-btn--${variant}`,
      `icon-btn--${size}`,
      {
        'icon-btn--loading': loading
      }
    ]"
    :disabled="disabled || loading"
    :aria-label="ariaLabel"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="icon-btn__spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'danger' | 'accent' | 'blue' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  ariaLabel: string;
}

withDefaults(defineProps<Props>(), {
  variant: 'ghost',
  size: 'md',
  disabled: false,
  loading: false
});

defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<style scoped>
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;
}

.icon-btn:focus {
  outline: 2px solid var(--color-blue-secondary);
  outline-offset: 2px;
}

.icon-btn:active {
  transform: translateY(1px);
}

/* Sizes */
.icon-btn--sm {
  width: 2rem;
  height: 2rem;
  padding: var(--spacing-xs);
}

.icon-btn--sm :deep(svg) {
  width: 1rem;
  height: 1rem;
}

.icon-btn--md {
  width: 2.5rem;
  height: 2.5rem;
  padding: var(--spacing-sm);
}

.icon-btn--md :deep(svg) {
  width: 1.25rem;
  height: 1.25rem;
}

.icon-btn--lg {
  width: 3rem;
  height: 3rem;
  padding: var(--spacing-md);
}

.icon-btn--lg :deep(svg) {
  width: 1.5rem;
  height: 1.5rem;
}

/* Variants */
.icon-btn--primary {
  background-color: var(--color-secondary);
  color: var(--color-white);
}

.icon-btn--primary:hover:not(:disabled) {
  background-color: var(--color-main);
  box-shadow: var(--shadow-md);
}

.icon-btn--secondary {
  background-color: var(--color-blue-main);
  color: var(--color-white);
}

.icon-btn--secondary:hover:not(:disabled) {
  background-color: var(--color-blue-secondary);
  box-shadow: var(--shadow-md);
}

.icon-btn--danger {
  background-color: var(--color-danger);
  color: var(--color-white);
}

.icon-btn--danger:hover:not(:disabled) {
  background-color: #b91c1c;
  box-shadow: var(--shadow-md);
}

.icon-btn--accent {
  background-color: var(--color-accent);
  color: var(--color-blue-main);
}

.icon-btn--accent:hover:not(:disabled) {
  background-color: #f7e7b8;
  box-shadow: var(--shadow-md);
}

.icon-btn--blue {
  background-color: var(--color-blue-secondary);
  color: var(--color-white);
}

.icon-btn--blue:hover:not(:disabled) {
  background-color: var(--color-blue-main);
  box-shadow: var(--shadow-md);
}

.icon-btn--ghost {
  background-color: transparent;
  color: var(--color-white);
}

.icon-btn--ghost:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Modifiers */
.icon-btn--loading {
  pointer-events: none;
}

/* Spinner */
.icon-btn__spinner {
  width: 1.25rem;
  height: 1.25rem;
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
