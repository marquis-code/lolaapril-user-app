<template>
  <section v-if="faqs?.length || showPlaceholder" id="faq" class="section faq-section">
    <div class="container">
      <h2 class="section-title">{{ title || 'Frequently Asked Questions' }}</h2>
      <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>

      <!-- FAQ Items -->
      <div v-if="faqs?.length" class="faq-list">
        <div 
          v-for="(faq, index) in faqs" 
          :key="faq.id || index"
          class="faq-item"
          :class="{ 'faq-item--open': openIndex === index }"
        >
          <button 
            class="faq-question"
            @click="toggle(index)"
          >
            <span>{{ faq.question }}</span>
            <svg 
              class="faq-icon" 
              :class="{ 'rotate-180': openIndex === index }"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div 
            class="faq-answer"
            :class="{ 'faq-answer--visible': openIndex === index }"
          >
            <p>{{ faq.answer }}</p>
          </div>
        </div>
      </div>

      <!-- Placeholder when no FAQs -->
      <div v-else-if="showPlaceholder" class="faq-placeholder">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-gray-500">FAQs coming soon</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface FAQ {
  id?: string
  question: string
  answer: string
}

interface Props {
  title?: string
  subtitle?: string
  faqs?: FAQ[]
  config?: any
  showPlaceholder?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  faqs: () => [],
  showPlaceholder: false
})

const openIndex = ref<number | null>(null)

const toggle = (index: number) => {
  openIndex.value = openIndex.value === index ? null : index
}
</script>

<style scoped>
.faq-section {
  background: var(--color-background);
  padding: 4rem 0;
}

.section-subtitle {
  text-align: center;
  color: var(--color-muted);
  margin-top: -1rem;
  margin-bottom: 2rem;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  border: 1px solid var(--color-border);
  border-radius: var(--card-radius, 12px);
  margin-bottom: 1rem;
  overflow: hidden;
  background: var(--color-card-background, #fff);
}

.faq-question {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background 0.2s;
}

.faq-question:hover {
  background: var(--color-input-background, #f9fafb);
}

.faq-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  transition: transform 0.2s;
}

.faq-icon.rotate-180 {
  transform: rotate(180deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease, padding 0.3s ease;
}

.faq-answer--visible {
  max-height: 500px;
  padding: 0 1.25rem 1.25rem;
}

.faq-answer p {
  color: var(--color-muted);
  line-height: 1.6;
}

.faq-placeholder {
  text-align: center;
  padding: 3rem 0;
}
</style>
