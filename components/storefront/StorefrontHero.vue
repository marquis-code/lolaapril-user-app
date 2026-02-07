<template>
  <section 
    v-if="config?.enabled !== false"
    class="hero"
    :style="heroStyles"
    :class="textColorClass"
  >
    <!-- Background based on type -->
    <div class="hero__background">
      <!-- Type: image -->
      <img 
        v-if="heroType === 'image' && config?.coverImage" 
        :src="config.coverImage" 
        alt="Hero background"
        class="hero__bg-media"
      />
      
      <!-- Type: video -->
      <video 
        v-else-if="heroType === 'video' && config?.videoUrl" 
        :src="config.videoUrl" 
        autoplay 
        muted 
        loop 
        playsinline
        class="hero__bg-media"
      />
      
      <!-- Type: slideshow (first image as fallback) -->
      <img 
        v-else-if="heroType === 'slideshow' && config?.slideshowImages?.length" 
        :src="config.slideshowImages[0]" 
        alt="Hero background"
        class="hero__bg-media"
      />
      
      <!-- Type: gradient -->
      <div 
        v-else-if="heroType === 'gradient'" 
        class="hero__gradient" 
        :style="gradientStyle" 
      />
      
      <!-- Fallback: default gradient using theme colors -->
      <div v-else class="hero__gradient hero__gradient--default" />
    </div>

    <!-- Overlay -->
    <div 
      v-if="hasOverlay"
      class="hero__overlay"
      :style="overlayStyle"
    />

    <!-- Content -->
    <div class="hero__content" :style="contentStyles">
      <h1 class="hero__headline">{{ config?.headline || business?.businessName || 'Welcome' }}</h1>
      <p v-if="config?.subheadline || business?.businessDescription" class="hero__subheadline">
        {{ config?.subheadline || business?.businessDescription }}
      </p>
      
      <button 
        v-if="config?.showBookButton !== false"
        class="hero__cta btn-accent"
        @click="scrollToServices"
      >
        {{ config?.bookButtonText || 'Book Now' }}
      </button>

      <!-- Social Proof -->
      <div v-if="business?.stats?.averageRating > 0" class="hero__stats">
        <span>
          ⭐ {{ business.stats.averageRating.toFixed(1) }} 
          ({{ business.stats.totalReviews }} reviews)
        </span>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="hero__scroll-indicator">
      <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Props {
  config?: any
  business?: any
}

const props = defineProps<Props>()

// Determine hero type - normalize the type value
const heroType = computed(() => {
  const type = props.config?.type?.toLowerCase() || 'gradient'
  return type
})

// Check if we have a valid overlay
const hasOverlay = computed(() => {
  const style = props.config?.overlayStyle
  return style && style !== 'none'
})

// Text color class based on overlay
const textColorClass = computed(() => {
  const overlayStyle = props.config?.overlayStyle || 'dark'
  // Light overlay = dark text, Dark overlay = light text
  if (overlayStyle === 'light') {
    return 'hero--dark-text'
  }
  return 'hero--light-text'
})

const heroStyles = computed(() => ({
  height: props.config?.height || '500px',
  minHeight: '400px'
}))

const gradientStyle = computed(() => {
  // If gradient config is provided, use it
  if (props.config?.gradient?.from && props.config?.gradient?.to) {
    const direction = props.config.gradient.direction || 'to right'
    return {
      background: `linear-gradient(${direction}, ${props.config.gradient.from}, ${props.config.gradient.to})`
    }
  }
  // Fallback to theme colors
  return {
    background: `linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%)`
  }
})

const overlayStyle = computed(() => {
  const overlayType = props.config?.overlayStyle || 'dark'
  const opacity = props.config?.overlayOpacity ?? 0.4
  
  if (overlayType === 'light') {
    return { background: `rgba(255, 255, 255, ${opacity})` }
  } else if (overlayType === 'dark') {
    return { background: `rgba(0, 0, 0, ${opacity})` }
  } else if (overlayType === 'gradient') {
    return { background: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)` }
  }
  return { background: 'transparent' }
})

const contentStyles = computed(() => ({
  textAlign: props.config?.textAlignment || 'center'
}))

const scrollToServices = () => {
  document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Text color based on overlay type */
.hero--light-text {
  color: white;
}

.hero--light-text .hero__scroll-indicator {
  color: white;
}

.hero--dark-text {
  color: #1f2937;
}

.hero--dark-text .hero__scroll-indicator {
  color: #1f2937;
}

.hero__background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.hero__bg-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero__gradient {
  width: 100%;
  height: 100%;
}

.hero__gradient--default {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
}

.hero__overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 2;
  padding: 2rem;
  max-width: 800px;
}

.hero__headline {
  font-family: var(--font-heading);
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 1rem;
  animation: fadeIn 1s ease-out;
}

@media (min-width: 768px) {
  .hero__headline {
    font-size: 4rem;
  }
}

.hero__subheadline {
  font-size: 1.125rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn 1s ease-out 0.2s backwards;
}

.hero__cta {
  font-size: 1.125rem;
  padding: 1rem 2rem;
  animation: fadeIn 1s ease-out 0.4s backwards;
}

.hero__stats {
  margin-top: 2rem;
  font-size: 0.875rem;
  opacity: 0.9;
}

.hero__scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  animation: bounce 2s infinite;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}
</style>
