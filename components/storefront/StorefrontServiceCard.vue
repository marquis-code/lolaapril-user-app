<template>
  <div class="service-card card" :style="cardAccentStyle">
    <!-- Only show image if service actually has one -->
    <div v-if="serviceImage" class="service-card__image">
      <img :src="serviceImage" :alt="serviceName" />
    </div>

    <!-- Content -->
    <div class="service-card__content">
      <!-- Header with name and price -->
      <div class="service-card__header">
        <h4 class="service-card__name">{{ serviceName }}</h4>
        <span v-if="config?.showPrices !== false" class="service-card__price">
          {{ formattedPrice }}
        </span>
      </div>

      <!-- Service Type Badge -->
      <span v-if="service.serviceType" class="service-card__type">
        {{ service.serviceType }}
      </span>
      
      <p v-if="config?.showDescription !== false && service.description" class="service-card__description">
        {{ service.description }}
      </p>

      <div class="service-card__footer">
        <span v-if="config?.showDuration !== false && formattedDuration" class="service-card__duration">
          <svg class="duration-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ formattedDuration }}
        </span>

        <!-- Variants -->
        <div v-if="service.variants?.length" class="service-card__variants">
          <button 
            v-for="variant in service.variants" 
            :key="variant.variantName"
            type="button"
            class="service-card__variant"
            @click.stop.prevent="$emit('select', { ...service, selectedVariant: variant })"
          >
            {{ variant.variantName }} - {{ formatVariantPrice(variant) }}
          </button>
        </div>

        <button 
          v-else 
          type="button"
          class="service-card__book btn-primary" 
          @click.stop.prevent="$emit('select', service)"
        >
          Add to Booking
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  service: any
  config?: any
}

const props = defineProps<Props>()
const emit = defineEmits(['select'])

const serviceName = computed(() => props.service.serviceName || props.service.name)

const serviceImage = computed(() => {
  if (props.service.images?.length) return props.service.images[0]
  if (props.service.image) return props.service.image
  return null
})

// Get category color for accent
const categoryColor = computed(() => {
  const cat = props.service.categoryId
  if (typeof cat === 'object' && cat?.appointmentColor) {
    return cat.appointmentColor
  }
  return null
})

const cardAccentStyle = computed(() => {
  if (categoryColor.value) {
    return {
      '--accent-color': categoryColor.value,
      borderLeftColor: categoryColor.value
    }
  }
  return {}
})

const formattedDuration = computed(() => {
  const duration = props.service.duration
  if (!duration) return ''
  
  // Use totalDuration if available (e.g., "45 min")
  if (duration.totalDuration) {
    return duration.totalDuration
  }
  
  // Handle object format { servicingTime: { value, unit } }
  if (duration.servicingTime) {
    const total = duration.servicingTime.value || 0
    const unit = duration.servicingTime.unit || 'min'
    return `${total} ${unit}`
  }
  
  // Handle simple number format (minutes)
  if (typeof duration === 'number') {
    return `${duration} min`
  }
  
  return ''
})

const formattedPrice = computed(() => {
  const price = props.service.price
  if (!price) return ''
  
  // Handle object format { currency, amount }
  if (typeof price === 'object') {
    const currency = price.currency === 'NGN' ? '₦' : (price.currency || '₦')
    return `${currency}${(price.amount || 0).toLocaleString()}`
  }
  
  // Handle simple number format
  if (typeof price === 'number') {
    return `₦${price.toLocaleString()}`
  }
  
  return ''
})

const formatVariantPrice = (variant: any) => {
  const price = variant.pricing?.price || variant.price
  if (!price) return ''
  
  if (typeof price === 'object') {
    const currency = price.currency === 'NGN' ? '₦' : (price.currency || '₦')
    return `${currency}${(price.amount || 0).toLocaleString()}`
  }
  
  return `₦${price.toLocaleString()}`
}
</script>

<style scoped>
.service-card {
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
  background: var(--color-card-background, #fff);
  border-radius: var(--card-radius, 12px);
  border: 1px solid var(--card-border-color, #e5e7eb);
  border-left: 4px solid var(--accent-color, var(--color-primary));
  display: flex;
  flex-direction: column;
}

.service-card:hover {
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.service-card__image {
  height: 160px;
  overflow: hidden;
  flex-shrink: 0;
}

.service-card__image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.service-card__content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.service-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.service-card__name {
  font-family: var(--font-heading);
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  line-height: 1.3;
  flex: 1;
}

.service-card__price {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
}

.service-card__type {
  display: inline-block;
  font-size: 0.75rem;
  color: var(--color-muted);
  background: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  width: fit-content;
}

.service-card__description {
  font-size: 0.875rem;
  color: var(--color-muted);
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
}

.service-card__footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.service-card__duration {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: var(--color-muted);
}

.duration-icon {
  width: 1rem;
  height: 1rem;
}

.service-card__variants {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.service-card__variant {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background: #f3f4f6;
  border: 1px solid var(--color-border);
  border-radius: var(--btn-radius);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.service-card__variant:hover {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.service-card__book {
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
}
</style>
