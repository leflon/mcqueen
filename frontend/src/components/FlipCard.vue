<template>
  <div
    class="flip-card"
    :class="{ 'is-flipped': isFlipped }"
    :style="{ width: width, height: height }"
    @click="handleClick"
  >
    <div class="card-face card-front">
      <div class="card-header" v-if="showHeader">
        <h3>{{ frontTitle || 'Question' }}</h3>
        <Eye :size="iconSize" class="card-icon" v-if="showIcon" />
      </div>
      <div class="card-content">
        <slot name="front">
          <p>{{ frontText }}</p>
        </slot>
      </div>
    </div>
    <div class="card-face card-back">
      <div class="card-header" v-if="showHeader">
        <h3>{{ backTitle || 'Answer' }}</h3>
        <EyeOff :size="iconSize" class="card-icon" v-if="showIcon" />
      </div>
      <div class="card-content">
        <slot name="back">
          <p>{{ backText }}</p>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Eye, EyeOff } from 'lucide-vue-next';

interface Props {
  isFlipped?: boolean;
  frontText?: string;
  backText?: string;
  frontTitle?: string;
  backTitle?: string;
  width?: string;
  height?: string;
  clickable?: boolean;
  showHeader?: boolean;
  showIcon?: boolean;
  iconSize?: number;
  frontBackground?: string;
  backBackground?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isFlipped: false,
  frontText: '',
  backText: '',
  frontTitle: 'Question',
  backTitle: 'Answer',
  width: '100%',
  height: '100%',
  clickable: true,
  showHeader: true,
  showIcon: true,
  iconSize: 18,
  frontBackground: 'var(--color-blue-secondary)',
  backBackground: 'var(--color-blue-main)'
});

const emit = defineEmits<{
  flip: [];
  click: [event: MouseEvent];
}>();

function handleClick(event: MouseEvent) {
  emit('click', event);
  if (props.clickable) {
    emit('flip');
  }
}
</script>

<style scoped>
.flip-card {
  position: relative;
  cursor: pointer;
  perspective: 1000px;
}

.flip-card:not(.clickable) {
  cursor: default;
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-lg);
  backface-visibility: hidden;
  transition: transform 0.3s ease-in-out;
  border: 2px solid transparent;
}

.card-face:hover {
  border-color: var(--color-accent);
}

.card-front {
  transform: rotateY(0deg);
  background-color: v-bind('props.frontBackground');
}

.card-back {
  transform: rotateY(180deg);
  background-color: v-bind('props.backBackground');
}

.flip-card.is-flipped .card-front {
  transform: rotateY(-180deg);
}

.flip-card.is-flipped .card-back {
  transform: rotateY(0deg);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-white);
  margin: 0;
}

.card-icon {
  color: var(--color-accent);
}

.card-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.card-content p {
  font-size: 1.125rem;
  line-height: 1.5;
  color: var(--color-white);
  margin: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .card-face {
    padding: var(--spacing-md);
  }

  .card-header h3 {
    font-size: 1.125rem;
  }

  .card-content p {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .card-header h3 {
    font-size: 1rem;
  }

  .card-content p {
    font-size: 0.875rem;
  }
}
</style>
