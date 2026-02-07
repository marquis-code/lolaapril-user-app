<template>
  <section v-if="hasAddress" id="map" class="section map-section">
    <div class="container">
      <h2 class="section-title">{{ title || 'Find Us' }}</h2>
      <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>

      <div class="map-container">
        <!-- Google Maps Embed -->
        <iframe
          v-if="mapUrl"
          :src="mapUrl"
          width="100%"
          height="450"
          style="border:0;"
          :allowfullscreen="true"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          class="map-iframe"
        ></iframe>

        <!-- Address Card Overlay -->
        <div v-if="showAddressCard" class="map-address-card">
          <div class="address-card-content">
            <h3 class="address-title">{{ businessName }}</h3>
            <address class="address-text">
              <p v-if="address?.street">{{ address.street }}</p>
              <p v-if="address?.city || address?.state">
                {{ address.city }}{{ address.city && address.state ? ', ' : '' }}{{ address.state }}
              </p>
              <p v-if="address?.postalCode">{{ address.postalCode }}</p>
              <p v-if="address?.country">{{ address.country }}</p>
            </address>
            <a 
              v-if="directionsUrl" 
              :href="directionsUrl" 
              target="_blank" 
              rel="noopener noreferrer"
              class="directions-btn btn-primary"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface Address {
  street?: string
  city?: string
  state?: string
  country?: string
  postalCode?: string
}

interface Props {
  title?: string
  subtitle?: string
  business?: any
  config?: any
  showAddressCard?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAddressCard: true
})

const businessName = computed(() => props.business?.businessName || '')
const address = computed<Address | null>(() => props.business?.address || null)

const hasAddress = computed(() => {
  const addr = address.value
  return addr && (addr.street || addr.city || addr.state || addr.country)
})

// Build Google Maps embed URL from address
const mapUrl = computed(() => {
  if (!hasAddress.value) return ''
  
  const addr = address.value
  const parts = [
    addr?.street,
    addr?.city,
    addr?.state,
    addr?.country,
    addr?.postalCode
  ].filter(Boolean)
  
  const query = encodeURIComponent(parts.join(', '))
  return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${query}`
})

// Build Google Maps directions URL
const directionsUrl = computed(() => {
  if (!hasAddress.value) return ''
  
  const addr = address.value
  const parts = [
    addr?.street,
    addr?.city,
    addr?.state,
    addr?.country,
    addr?.postalCode
  ].filter(Boolean)
  
  const destination = encodeURIComponent(parts.join(', '))
  return `https://www.google.com/maps/dir/?api=1&destination=${destination}`
})
</script>

<style scoped>
.map-section {
  background: var(--color-background);
  padding: 4rem 0;
}

.section-subtitle {
  text-align: center;
  color: var(--color-muted);
  margin-top: -1rem;
  margin-bottom: 2rem;
}

.map-container {
  position: relative;
  border-radius: var(--card-radius, 12px);
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.map-iframe {
  display: block;
  border-radius: var(--card-radius, 12px);
}

.map-address-card {
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 10;
}

.address-card-content {
  background: var(--color-card-background, #fff);
  border-radius: var(--card-radius, 12px);
  padding: 1.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  max-width: 280px;
}

.address-title {
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 0.75rem;
}

.address-text {
  font-style: normal;
  font-size: 0.875rem;
  color: var(--color-muted);
  line-height: 1.6;
  margin-bottom: 1rem;
}

.address-text p {
  margin: 0;
}

.directions-btn {
  display: inline-block;
  width: 100%;
  text-align: center;
  text-decoration: none;
}

@media (max-width: 640px) {
  .map-address-card {
    position: static;
    margin-top: 1rem;
  }

  .address-card-content {
    max-width: none;
    box-shadow: none;
    border: 1px solid var(--color-border);
  }
}
</style>
