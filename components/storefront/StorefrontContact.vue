<template>
  <section id="contact" class="section contact-section">
    <div class="container">
      <h2 class="section-title">{{ title || 'Contact Us' }}</h2>
      <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>

      <div class="contact-wrapper">
        <!-- Contact Cards -->
        <div class="contact-cards">
          <!-- Phone -->
          <div v-if="business?.contact?.primaryPhone || business?.contact?.phone" class="contact-card">
            <div class="contact-card__icon contact-card__icon--phone">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <div class="contact-card__content">
              <h3 class="contact-card__label">Call Us</h3>
              <a :href="`tel:${business.contact.primaryPhone || business.contact.phone}`" class="contact-card__value">
                {{ business.contact.primaryPhone || business.contact.phone }}
              </a>
            </div>
          </div>

          <!-- Email -->
          <div v-if="business?.contact?.email" class="contact-card">
            <div class="contact-card__icon contact-card__icon--email">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="contact-card__content">
              <h3 class="contact-card__label">Email Us</h3>
              <a :href="`mailto:${business.contact.email}`" class="contact-card__value">
                {{ business.contact.email }}
              </a>
            </div>
          </div>

          <!-- Address -->
          <div v-if="hasAddress" class="contact-card">
            <div class="contact-card__icon contact-card__icon--address">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div class="contact-card__content">
              <h3 class="contact-card__label">Visit Us</h3>
              <address class="contact-card__value contact-card__address">
                {{ formattedAddress }}
              </address>
            </div>
          </div>

          <!-- Hours Preview -->
          <div v-if="business?.businessHours?.length" class="contact-card">
            <div class="contact-card__icon contact-card__icon--hours">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="contact-card__content">
              <h3 class="contact-card__label">Hours Today</h3>
              <p class="contact-card__value">
                <span v-if="todayHours?.isOpen" class="hours-open">
                  {{ formatTime(todayHours.openTime) }} - {{ formatTime(todayHours.closeTime) }}
                </span>
                <span v-else class="hours-closed">Closed Today</span>
              </p>
              <span class="contact-card__status" :class="isCurrentlyOpen ? 'status--open' : 'status--closed'">
                {{ isCurrentlyOpen ? '● Open Now' : '● Currently Closed' }}
              </span>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="contact-cta">
          <div class="cta-content">
            <h3 class="cta-title">Ready to Book?</h3>
            <p class="cta-text">Schedule your appointment today and experience our exceptional service.</p>
            <a href="#services" class="cta-button">
              View Our Services
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  config?: any
  business?: any
}

const props = defineProps<Props>()

const hasAddress = computed(() => {
  const addr = props.business?.address
  return addr && (addr.street || addr.city || addr.state)
})

const formattedAddress = computed(() => {
  const addr = props.business?.address
  if (!addr) return ''
  const parts = [addr.street, addr.city, addr.state, addr.country].filter(Boolean)
  return parts.join(', ')
})

const todayHours = computed(() => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  const today = days[new Date().getDay()]
  return props.business?.businessHours?.find((h: any) => h.day.toLowerCase() === today)
})

const isCurrentlyOpen = computed(() => {
  if (!todayHours.value?.isOpen) return false
  
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  const [openH, openM] = (todayHours.value.openTime || '00:00').split(':').map(Number)
  const [closeH, closeM] = (todayHours.value.closeTime || '00:00').split(':').map(Number)
  
  return currentTime >= (openH * 60 + openM) && currentTime <= (closeH * 60 + closeM)
})

const formatTime = (time?: string): string => {
  if (!time) return ''
  const [hours, minutes] = time.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 || 12
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
}
</script>

<style scoped>
.contact-section {
  background: var(--color-background);
  padding: 5rem 0;
}

.contact-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

.contact-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

@media (max-width: 768px) {
  .contact-cards {
    grid-template-columns: 1fr;
  }
}

.contact-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--color-card-background, #fff);
  border: 1px solid var(--color-border);
  border-radius: var(--card-radius, 12px);
  transition: box-shadow 0.2s, transform 0.2s;
}

.contact-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.contact-card__icon {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-card__icon svg {
  width: 24px;
  height: 24px;
}

.contact-card__icon--phone {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.contact-card__icon--email {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.contact-card__icon--address {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.contact-card__icon--hours {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.contact-card__content {
  flex: 1;
  min-width: 0;
}

.contact-card__label {
  font-family: var(--font-heading);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.375rem;
}

.contact-card__value {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
  display: block;
  word-break: break-word;
}

a.contact-card__value:hover {
  color: var(--color-primary);
}

.contact-card__address {
  font-style: normal;
  line-height: 1.5;
}

.contact-card__status {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.status--open {
  color: #10b981;
}

.status--closed {
  color: #ef4444;
}

.hours-open {
  color: var(--color-text);
}

.hours-closed {
  color: #ef4444;
}

/* CTA Section */
.contact-cta {
  background: linear-gradient(135deg, var(--color-primary) 0%, #1d4ed8 100%);
  border-radius: var(--card-radius, 12px);
  padding: 3rem 2rem;
  text-align: center;
  color: white;
}

.cta-title {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.cta-text {
  font-size: 1rem;
  opacity: 0.9;
  max-width: 400px;
  margin: 0 auto 1.5rem;
}

.cta-button {
  display: inline-block;
  background: white;
  color: var(--color-primary);
  padding: 0.875rem 2rem;
  border-radius: var(--btn-radius, 8px);
  font-weight: 600;
  text-decoration: none;
  transition: transform 0.2s, box-shadow 0.2s;
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
