<template>
  <div class="home-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            Master Your Knowledge with
            <span class="brand-highlight">McQueen</span>
          </h1>
          <p class="hero-subtitle">
            The smart flashcard app that accelerates your learning. Create,
            study, and track your progress with beautiful, interactive cards.
          </p>
          <div class="hero-actions">
            <Button
              variant="accent"
              size="lg"
              @click="startLearning"
              class="cta-button"
            >
              Start Learning Today
            </Button>
            <Button variant="outline" size="lg" @click="learnMore">
              See How It Works
            </Button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-card">
            <div class="mini-card">
              <h4>Quick Question</h4>
              <p>What makes learning effective?</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Demo Section -->
    <div class="demo-section" id="demo">
      <div class="section-content">
        <div class="demo-visual">
          <div
            class="demo-card"
            :class="{ 'is-flipped': demoFlipped }"
            @click="flipDemo"
          >
            <div class="card-face card-front">
              <div class="card-header">
                <h3>Question</h3>
                <Eye :size="20" class="card-icon" />
              </div>
              <div class="card-content">
                <p>What is the capital of France?</p>
              </div>
            </div>
            <div class="card-face card-back">
              <div class="card-header">
                <h3>Answer</h3>
                <EyeOff :size="20" class="card-icon" />
              </div>
              <div class="card-content">
                <p>Paris</p>
              </div>
            </div>
          </div>
          <p class="demo-hint">Click the card to flip it!</p>
        </div>
        <div class="demo-text">
          <h2>Experience Interactive Learning</h2>
          <p>
            Our beautiful flashcards make studying engaging and effective. With
            smooth animations and intuitive interactions, you'll actually enjoy
            your study sessions.
          </p>
          <ul class="feature-list">
            <li>✨ Smooth flip animations</li>
            <li>🎯 Focus on one card at a time</li>
            <li>📱 Works perfectly on any device</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="cta-section">
      <div class="cta-content">
        <h2>Ready to Accelerate Your Learning?</h2>
        <p>
          Join thousands of students who are already using McQueen to master
          their subjects.
        </p>
        <Button
          variant="primary"
          size="lg"
          @click="startLearning"
          class="final-cta"
        >
          Get Started Now
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Button from '../components/Button.vue';
import { Eye, EyeOff } from 'lucide-vue-next';

const router = useRouter();
const demoFlipped = ref(false);

function flipDemo() {
  demoFlipped.value = !demoFlipped.value;
}

function startLearning() {
  router.push('/auth');
}

function learnMore() {
  const demoSection = document.getElementById('demo');
  if (demoSection) {
    demoSection.scrollIntoView({ behavior: 'smooth' });
  }
}
</script>

<style scoped>
.home-page {
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
}

/* Hero Section */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: var(--spacing-xl) var(--spacing-lg);
  background-color: var(--color-main);
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
}

.hero-text {
  padding-right: var(--spacing-xl);
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: var(--color-white);
  margin-bottom: var(--spacing-lg);
  line-height: 1.1;
}

.brand-highlight {
  color: var(--color-accent);
}

.hero-subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--spacing-2xl);
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.hero-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.floating-card {
  animation: float 3s ease-in-out infinite;
}

.mini-card {
  background-color: var(--color-accent);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 300px;
}

.mini-card h4 {
  color: var(--color-blue-main);
  margin-bottom: var(--spacing-md);
  font-size: 1.25rem;
}

.mini-card p {
  color: var(--color-blue-main);
  font-size: 1.125rem;
  line-height: 1.5;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

/* Section Content Layout */
.section-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
}

.section-content.reverse {
  direction: rtl;
}

.section-content.reverse > * {
  direction: ltr;
}

/* Demo Section */
.demo-section {
  background-color: rgba(255, 255, 255, 0.02);
}

.demo-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.demo-card {
  width: 100%;
  max-width: 400px;
  height: 250px;
  position: relative;
  cursor: pointer;
  perspective: 1000px;
}

.card-face {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: var(--color-blue-secondary);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-lg);
  backface-visibility: hidden;
  transition: transform 0.6s ease-in-out;
  border: 2px solid transparent;
}

.card-face:hover {
  border-color: var(--color-accent);
}

.card-front {
  transform: rotateY(0deg);
}

.card-back {
  transform: rotateY(180deg);
  background-color: var(--color-blue-main);
}

.demo-card.is-flipped .card-front {
  transform: rotateY(-180deg);
}

.demo-card.is-flipped .card-back {
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
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--color-white);
  margin: 0;
}

.demo-hint {
  color: var(--color-accent);
  font-size: 1rem;
  font-weight: 500;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.demo-text h2 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-lg);
  color: var(--color-white);
}

.demo-text p {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: var(--spacing-lg);
}

.feature-list {
  list-style: none;
  padding: 0;
}

.feature-list li {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  margin-bottom: var(--spacing-sm);
  padding-left: var(--spacing-md);
}

/* Features Section */
.features-section {
  background-color: rgba(255, 255, 255, 0.05);
}

.features-text h2 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-xl);
  color: var(--color-white);
}

.features-grid {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  transition: all 0.2s ease-in-out;
}

.feature-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.feature-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: var(--color-accent);
  border-radius: 50%;
  color: var(--color-blue-main);
  flex-shrink: 0;
}

.feature-item h3 {
  font-size: 1.25rem;
  margin-bottom: var(--spacing-xs);
  color: var(--color-white);
}

.feature-item p {
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

.features-visual {
  display: flex;
  justify-content: center;
  align-items: center;
}

.stats-preview {
  background-color: var(--color-secondary);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
  min-width: 250px;
}

.stat-item {
  text-align: center;
  padding: var(--spacing-md);
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-accent);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* CTA Section */
.cta-section {
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
  background-color: var(--color-secondary);
}

.cta-content {
  max-width: 600px;
  margin: 0 auto;
}

.cta-section h2 {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-lg);
  color: var(--color-white);
}

.cta-section p {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: var(--spacing-2xl);
  line-height: 1.6;
}

.final-cta {
  transform: scale(1.1);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content,
  .section-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
    text-align: center;
  }

  .section-content.reverse {
    direction: ltr;
  }

  .hero-text {
    padding-right: 0;
    order: 1;
  }

  .hero-visual {
    order: 2;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.125rem;
  }

  .hero-actions {
    justify-content: center;
  }

  .hero-actions .btn {
    width: 100%;
    max-width: 280px;
  }

  .demo-text h2,
  .features-text h2,
  .cta-section h2 {
    font-size: 2rem;
  }

  .demo-card {
    height: 200px;
  }

  .card-content p {
    font-size: 1.125rem;
  }

  .features-grid {
    gap: var(--spacing-md);
  }

  .feature-item {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
  }

  .feature-item:hover {
    transform: translateY(-2px);
  }
}

@media (max-width: 480px) {
  .home-page {
    padding: 0 var(--spacing-sm);
  }

  .hero-title {
    font-size: 2rem;
  }

  .demo-card {
    height: 180px;
  }

  .card-content p {
    font-size: 1rem;
  }

  .mini-card {
    padding: var(--spacing-lg);
  }
}
</style>
