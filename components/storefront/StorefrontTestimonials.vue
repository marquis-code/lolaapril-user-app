<template>
  <section v-if="visibleTestimonials?.length" class="section testimonials-section">
    <div class="container">
      <h2 class="section-title">{{ title || 'What Our Clients Say' }}</h2>
      <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>

      <div class="testimonials-grid">
        <div 
          v-for="(testimonial, index) in visibleTestimonials" 
          :key="testimonial.id || index"
          class="testimonial-card card"
        >
          <div class="testimonial-rating">
            <span v-for="star in 5" :key="star">
              {{ star <= (testimonial.rating || 5) ? '⭐' : '☆' }}
            </span>
          </div>
          <p class="testimonial-text">"{{ testimonial.content || testimonial.text }}"</p>
          <div class="testimonial-author">
            <div v-if="testimonial.clientPhoto" class="testimonial-avatar">
              <img :src="testimonial.clientPhoto" :alt="testimonial.clientName" />
            </div>
            <div v-else class="testimonial-avatar testimonial-avatar--placeholder">
              {{ getInitial(testimonial.clientName || testimonial.name) }}
            </div>
            <div class="testimonial-info">
              <p class="testimonial-name">{{ testimonial.clientName || testimonial.name }}</p>
              <p v-if="testimonial.clientTitle" class="testimonial-title">{{ testimonial.clientTitle }}</p>
              <p v-if="testimonial.serviceName" class="testimonial-service">{{ testimonial.serviceName }}</p>
              <p v-if="testimonial.date" class="testimonial-date">{{ formatDate(testimonial.date) }}</p>
            </div>
          </div>
        </div>
      </div>

      <p v-if="!visibleTestimonials?.length" class="no-testimonials">
        No testimonials to display.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Testimonial {
  id?: string
  clientName?: string
  name?: string
  clientPhoto?: string
  avatar?: string
  clientTitle?: string
  content?: string
  text?: string
  rating?: number
  date?: string
  serviceName?: string
  isVisible?: boolean
  order?: number
}

interface Props {
  title?: string
  subtitle?: string
  config?: any
  testimonials?: Testimonial[]
}

const props = withDefaults(defineProps<Props>(), {
  testimonials: () => []
})

const visibleTestimonials = computed(() => {
  // Use testimonials prop first, fall back to config.items for backwards compatibility
  const items = props.testimonials?.length ? props.testimonials : props.config?.items || []
  const maxToShow = props.config?.maxToShow || 6
  return items.slice(0, maxToShow)
})

const getInitial = (name?: string) => {
  return name?.charAt(0)?.toUpperCase() || '?'
}

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return dateString
  }
}
</script>

<style scoped>
.testimonials-section {
  background: #f9fafb;
}

.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.testimonial-card {
  padding: 1.5rem;
}

.testimonial-rating {
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.testimonial-text {
  font-style: italic;
  color: var(--color-text);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.testimonial-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}

.testimonial-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.testimonial-avatar--placeholder {
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.testimonial-name {
  font-weight: 600;
  color: var(--color-text);
}

.testimonial-title {
  font-size: 0.75rem;
  color: var(--color-muted);
  margin-top: 0.125rem;
}

.testimonial-service {
  font-size: 0.75rem;
  color: var(--color-primary);
  margin-top: 0.125rem;
}

.testimonial-date {
  font-size: 0.75rem;
  color: var(--color-muted);
}

.no-testimonials {
  text-align: center;
  color: var(--color-muted);
  padding: 3rem 0;
}
</style>
