<template>
  <section id="about" class="section about-section">
    <div class="container">
      <h2 class="section-title">{{ title || content?.title || 'About Us' }}</h2>
      <p v-if="subtitle || content?.subtitle" class="section-subtitle">{{ subtitle || content?.subtitle }}</p>
      
      <div class="about-wrapper" :class="{ 'about-wrapper--with-image': content?.image }">
        <!-- About Image (if provided in content) -->
        <div v-if="content?.image" class="about-image-container" :class="`about-image--${content?.imagePosition || 'right'}`">
          <img :src="content.image" :alt="content?.title || business?.businessName" class="about-main-image" />
        </div>

        <div class="about-content">
          <!-- Business Name Card -->
          <div class="about-header">
            <div v-if="business?.images?.[0]" class="about-image">
              <img :src="business.images[0]" :alt="business.businessName" />
            </div>
            <div class="about-brand">
              <h3 class="about-business-name">{{ business?.businessName }}</h3>
              <span v-if="business?.businessType" class="about-type">{{ formatBusinessType(business.businessType) }}</span>
            </div>
          </div>

          <!-- Description from content or business -->
          <p v-if="content?.description || business?.businessDescription" class="about-description">
            {{ content?.description || business?.businessDescription }}
          </p>

          <!-- Founder Section -->
          <div v-if="content?.founderName" class="founder-section">
            <div v-if="content?.founderPhoto" class="founder-photo">
              <img :src="content.founderPhoto" :alt="content.founderName" />
            </div>
            <div class="founder-info">
              <p v-if="content?.founderQuote" class="founder-quote">"{{ content.founderQuote }}"</p>
              <p class="founder-name">{{ content.founderName }}</p>
              <p v-if="content?.founderTitle" class="founder-title">{{ content.founderTitle }}</p>
            </div>
          </div>

          <!-- Highlights from content -->
          <div v-if="content?.highlights?.length" class="about-highlights">
            <div v-for="(highlight, index) in content.highlights" :key="index" class="highlight-item">
              <svg class="highlight-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>{{ highlight }}</span>
            </div>
          </div>

          <!-- Stats/Features (default) -->
          <div v-if="!content?.highlights?.length" class="about-features">
            <div class="feature-item">
              <div class="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="feature-text">
                <span class="feature-title">Professional Service</span>
                <span class="feature-desc">Expert care by trained staff</span>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="feature-text">
                <span class="feature-title">Flexible Booking</span>
                <span class="feature-desc">Book online 24/7</span>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div class="feature-text">
                <span class="feature-title">Customer First</span>
                <span class="feature-desc">Your satisfaction guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface AboutContent {
  title?: string
  subtitle?: string
  description?: string
  image?: string
  imagePosition?: 'left' | 'right'
  highlights?: string[]
  founderName?: string
  founderPhoto?: string
  founderTitle?: string
  founderQuote?: string
  showTeamStats?: boolean
}

interface Props {
  title?: string
  subtitle?: string
  business?: any
  content?: AboutContent | null
}

defineProps<Props>()

const formatBusinessType = (type: string) => {
  if (!type) return ''
  return type.charAt(0).toUpperCase() + type.slice(1)
}
</script>

<style scoped>
.about-section {
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  padding: 5rem 0;
}

.about-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.about-wrapper--with-image {
  max-width: 1000px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
}

.about-image-container {
  order: 1;
}

.about-image--left {
  order: 0;
}

.about-main-image {
  width: 100%;
  height: auto;
  border-radius: var(--card-radius, 12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

@media (max-width: 768px) {
  .about-wrapper--with-image {
    grid-template-columns: 1fr;
  }
  
  .about-image-container {
    order: 0;
  }
}

.about-content {
  text-align: center;
}

.about-wrapper--with-image .about-content {
  text-align: left;
}

.about-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
}

.about-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.about-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.about-brand {
  text-align: center;
}

.about-business-name {
  font-family: var(--font-heading);
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.about-type {
  display: inline-block;
  font-size: 0.875rem;
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
}

.about-description {
  font-size: 1.125rem;
  line-height: 1.8;
  color: var(--color-muted);
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.about-features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

@media (max-width: 768px) {
  .about-features {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.5rem;
  background: white;
  border-radius: var(--card-radius, 12px);
  border: 1px solid var(--color-border);
  transition: box-shadow 0.2s, transform 0.2s;
}

.feature-item:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, var(--color-primary) 0%, #1d4ed8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.feature-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.feature-text {
  display: flex;
  flex-direction: column;
}

.feature-title {
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.25rem;
}

.feature-desc {
  font-size: 0.875rem;
  color: var(--color-muted);
}

/* Founder Section */
.founder-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: white;
  border-radius: var(--card-radius, 12px);
  border: 1px solid var(--color-border);
  margin-bottom: 2rem;
}

.founder-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 1rem;
}

.founder-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.founder-info {
  text-align: center;
}

.founder-quote {
  font-style: italic;
  color: var(--color-muted);
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.6;
}

.founder-name {
  font-weight: 600;
  color: var(--color-text);
}

.founder-title {
  font-size: 0.875rem;
  color: var(--color-muted);
}

/* Highlights */
.about-highlights {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text);
}

.highlight-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-primary);
}

.about-wrapper--with-image .about-highlights {
  justify-content: flex-start;
}
</style>
