<template>
  <div v-if="items.length" class="booking-cart">
    <!-- Collapsed State -->
    <button class="booking-cart__toggle" @click="expanded = !expanded">
      <span class="booking-cart__count">{{ items.length }}</span>
      <span class="booking-cart__label">{{ items.length === 1 ? 'Service' : 'Services' }} Selected</span>
      <span class="booking-cart__total">{{ formattedTotal }}</span>
      <svg 
        class="booking-cart__icon" 
        :class="{ 'booking-cart__icon--expanded': expanded }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
      </svg>
    </button>

    <!-- Expanded State -->
    <div v-if="expanded" class="booking-cart__panel">
      <div class="booking-cart__items">
        <div 
          v-for="(item, index) in items" 
          :key="index"
          class="booking-cart__item"
        >
          <div class="booking-cart__item-info">
            <p class="booking-cart__item-name">{{ item.serviceName || item.name }}</p>
            <p v-if="item.selectedVariant" class="booking-cart__item-variant">
              {{ item.selectedVariant.variantName }}
            </p>
          </div>
          <div class="booking-cart__item-price">
            {{ formatItemPrice(item) }}
          </div>
          <button class="booking-cart__item-remove" @click="$emit('remove', index)">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <button class="booking-cart__checkout btn-primary" @click="$emit('checkout')">
        Continue to Booking
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  items: any[]
  bookingFlow?: any
  business?: any
}

const props = withDefaults(defineProps<Props>(), {
  items: () => []
})

const emit = defineEmits(['checkout', 'remove'])

const expanded = ref(false)

const formattedTotal = computed(() => {
  const total = props.items.reduce((sum, item) => {
    const price = getItemPrice(item)
    return sum + price
  }, 0)
  return `₦${total.toLocaleString()}`
})

const getItemPrice = (item: any) => {
  if (item.selectedVariant) {
    const variantPrice = item.selectedVariant.pricing?.price || item.selectedVariant.price
    if (typeof variantPrice === 'object') return variantPrice.amount || 0
    return variantPrice || 0
  }
  
  const price = item.price
  if (typeof price === 'object') return price.amount || 0
  return price || 0
}

const formatItemPrice = (item: any) => {
  const price = getItemPrice(item)
  return `₦${price.toLocaleString()}`
}
</script>

<style scoped>
.booking-cart {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 1rem 1rem 0 0;
}

.booking-cart__toggle {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background: var(--color-primary);
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 1rem 1rem 0 0;
}

.booking-cart__count {
  width: 28px;
  height: 28px;
  background: var(--color-accent);
  color: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
}

.booking-cart__label {
  flex: 1;
  text-align: left;
  font-weight: 500;
}

.booking-cart__total {
  font-weight: 700;
}

.booking-cart__icon {
  width: 20px;
  height: 20px;
  transition: transform 0.2s;
}

.booking-cart__icon--expanded {
  transform: rotate(180deg);
}

.booking-cart__panel {
  padding: 1rem 1.5rem 1.5rem;
  max-height: 60vh;
  overflow-y: auto;
}

.booking-cart__items {
  margin-bottom: 1rem;
}

.booking-cart__item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.booking-cart__item:last-child {
  border-bottom: none;
}

.booking-cart__item-info {
  flex: 1;
}

.booking-cart__item-name {
  font-weight: 500;
  color: var(--color-text);
}

.booking-cart__item-variant {
  font-size: 0.875rem;
  color: var(--color-muted);
}

.booking-cart__item-price {
  font-weight: 600;
  color: var(--color-primary);
}

.booking-cart__item-remove {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.booking-cart__checkout {
  width: 100%;
}
</style>
