<template>
  <div v-if="loading" class="loading-screen">
    <div class="loading-content">
      <!-- Animated Logo/Icon -->
      <div class="loading-icon">
        <div class="icon-ring icon-ring--outer"></div>
        <div class="icon-ring icon-ring--middle"></div>
        <div class="icon-ring icon-ring--inner"></div>
        <div class="icon-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="spa-icon">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
      </div>

      <!-- Animated Dots -->
      <div class="loading-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>

      <!-- Loading Text -->
      <p class="loading-text">Preparing your experience</p>
      <p class="loading-subtext">{{ route?.params?.subdomain }}</p>

      <!-- Shimmer Elements Preview -->
      <div class="loading-preview">
        <div class="shimmer-card">
          <div class="shimmer-line shimmer-line--title"></div>
          <div class="shimmer-line shimmer-line--text"></div>
          <div class="shimmer-line shimmer-line--text shimmer-line--short"></div>
        </div>
        <div class="shimmer-card">
          <div class="shimmer-line shimmer-line--title"></div>
          <div class="shimmer-line shimmer-line--text"></div>
          <div class="shimmer-line shimmer-line--text shimmer-line--short"></div>
        </div>
        <div class="shimmer-card shimmer-card--hidden-mobile">
          <div class="shimmer-line shimmer-line--title"></div>
          <div class="shimmer-line shimmer-line--text"></div>
          <div class="shimmer-line shimmer-line--text shimmer-line--short"></div>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else-if="error" class="error-screen">
    <div class="text-center">
      <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h1 class="text-2xl font-semibold text-gray-800 mb-2">Business Not Found</h1>
      <p class="text-gray-600 mb-6">{{ error }}</p>
      <NuxtLink 
        to="/" 
        class="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full hover:opacity-90 transition-opacity"
      >
        Go Home
      </NuxtLink>
    </div>
  </div>

  <div v-else class="storefront" :style="storefrontStyles">
    <!-- Preview Banner -->
    <div v-if="isPreviewMode" class="preview-banner">
      ⚠️ Preview Mode - Changes not saved
    </div>

    <!-- Navbar -->
    <StorefrontNavbar 
      :config="theme?.navbar" 
      :logo="theme?.logo"
      :business-name="business?.businessName"
    />

    <!-- Hero Section -->
    <StorefrontHero 
      v-if="layout?.hero?.enabled !== false"
      :config="layout?.hero"
      :business="business"
    />

    <!-- Dynamic Sections -->
    <template v-for="section in sortedSections" :key="section.id">
      <StorefrontServices 
        v-if="section.type === 'services'"
        :title="section.title"
        :subtitle="section.subtitle"
        :config="layout?.serviceDisplay"
        :categories="categories"
        :services="services"
        @select="addToCart"
      />

      <StorefrontStaff 
        v-if="section.type === 'staff'"
        :title="section.title"
        :subtitle="section.subtitle"
        :config="layout?.staffDisplay"
        :staff="staff"
      />

      <StorefrontGallery 
        v-if="section.type === 'gallery'"
        :title="section.title"
        :subtitle="section.subtitle"
        :config="layout?.gallery"
        :images="galleryImages"
      />

      <StorefrontTestimonials 
        v-if="section.type === 'testimonials'"
        :title="section.title"
        :subtitle="section.subtitle"
        :config="layout?.testimonials"
        :testimonials="testimonials"
      />

      <StorefrontAbout 
        v-if="section.type === 'about'"
        :title="section.title"
        :subtitle="section.subtitle"
        :business="business"
        :content="aboutContent"
      />

      <StorefrontContact 
        v-if="section.type === 'contact'"
        :title="section.title"
        :subtitle="section.subtitle"
        :config="layout?.contact"
        :business="business"
      />

      <StorefrontFaq 
        v-if="section.type === 'faq'"
        :title="section.title"
        :subtitle="section.subtitle"
        :faqs="faqs"
        :show-placeholder="true"
      />

      <StorefrontMap 
        v-if="section.type === 'map'"
        :title="section.title"
        :subtitle="section.subtitle"
        :business="business"
      />

      <StorefrontHours 
        v-if="section.type === 'hours'"
        :title="section.title"
        :subtitle="section.subtitle"
        :business-hours="business?.businessHours"
        :timezone="business?.settings?.timezone"
      />
    </template>

    <!-- Default Sections (if no layout sections defined) -->
    <template v-if="!sortedSections.length">
      <StorefrontServices 
        :config="layout?.serviceDisplay || { showFilters: true, columns: 3 }"
        :categories="categories"
        :services="services"
        @select="addToCart"
      />

      <StorefrontStaff 
        v-if="staff?.length"
        :staff="staff"
      />

      <StorefrontAbout 
        :business="business"
      />

      <StorefrontContact 
        :business="business"
      />
    </template>

    <!-- Footer -->
    <StorefrontFooter 
      :config="theme?.footer"
      :business="business"
    />

    <!-- Floating Book Button (Mobile) -->
    <BookingCart 
      :items="cartItems"
      :booking-flow="layout?.bookingFlow"
      :business="business"
      @checkout="startBooking"
      @remove="removeFromCart"
    />
  </div>
</template>

<script setup lang="ts">
import { useStorefront } from '@/composables/modules/storefront/useGetStorefront'
import { useTheme } from '@/composables/core/useTheme'
import { usePreview } from '@/composables/core/usePreview'

const route = useRoute()
const router = useRouter()
const subdomain = computed(() => route.params.subdomain as string)
const previewId = computed(() => route.query.previewId as string)

const { storefront, loading, error, fetchStorefront } = useStorefront()
const { applyTheme, applyComponentStyles } = useTheme()
const { fetchPreview, mergeWithPreview, isPreviewMode } = usePreview()

// Fetch data on mount
onMounted(async () => {
  try {
    await fetchStorefront(subdomain.value)
    
    // Check for preview mode
    if (previewId.value) {
      await fetchPreview(previewId.value)
    }

    // Apply theme
    if (storefront.value) {
      console.log('Storefront loaded:', storefront.value)
      
      const finalTheme = mergeWithPreview(storefront.value.theme)
      applyTheme(finalTheme)
      
      if (storefront.value.componentStyles) {
        applyComponentStyles(storefront.value.componentStyles)
      }

      // Set page meta
      const seo = storefront.value.theme?.seo
      useHead({
        title: seo?.title || `${storefront.value.business?.businessName} - Book Now`,
        meta: [
          { name: 'description', content: seo?.description || storefront.value.business?.businessDescription },
          { property: 'og:image', content: seo?.ogImage }
        ].filter(m => m.content),
        link: storefront.value.theme?.favicon?.url 
          ? [{ rel: 'icon', href: storefront.value.theme.favicon.url }] 
          : []
      })
    }
  } catch (err) {
    console.error('Failed to load storefront:', err)
  }
})

// Computed
const business = computed(() => storefront.value?.business)
const theme = computed(() => storefront.value?.theme)
const layout = computed(() => storefront.value?.layout)
const categories = computed(() => storefront.value?.categories || [])
const services = computed(() => storefront.value?.services || [])
const staff = computed(() => storefront.value?.staff || [])

// Content from layout.content
const faqs = computed(() => {
  const contentFaqs = storefront.value?.layout?.content?.faqs || []
  return contentFaqs.filter((faq: any) => faq.isVisible !== false)
})

const testimonials = computed(() => {
  const contentTestimonials = storefront.value?.layout?.content?.testimonials || []
  return contentTestimonials
    .filter((t: any) => t.isVisible !== false)
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
})

const galleryImages = computed(() => {
  const contentImages = storefront.value?.layout?.content?.galleryImages || []
  return contentImages
    .filter((img: any) => img.isVisible !== false)
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
})

const aboutContent = computed(() => storefront.value?.layout?.content?.about || null)

const sortedSections = computed(() => {
  const sections = layout.value?.sections || []
  console.log('Sections from layout:', sections)
  return sections
    .filter((s: any) => s.enabled)
    .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
})

const storefrontStyles = computed(() => ({
  '--max-width': storefront.value?.componentStyles?.maxContentWidth || '1200px'
}))

// Cart state
const cartItems = ref<any[]>([])

const addToCart = (service: any) => {
  console.log('Adding to cart:', service)
  // Store the service in session storage for the booking page
  sessionStorage.setItem('selected_service', JSON.stringify(service))
  // Navigate to booking page with subdomain as query param
  router.push(`/book?subdomain=${subdomain.value}`)
}

const removeFromCart = (index: number) => {
  cartItems.value.splice(index, 1)
}

const startBooking = () => {
  // Store cart items in session/state and navigate to booking
  if (cartItems.value.length) {
    sessionStorage.setItem('booking_cart', JSON.stringify(cartItems.value))
  }
  router.push(`/book?subdomain=${subdomain.value}`)
}
</script>

<style>
@import '@/assets/css/storefront-variables.css';

.storefront {
  font-family: var(--font-body);
  background-color: var(--color-background);
  color: var(--color-text);
}

.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
  padding: 2rem;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Animated Logo Icon */
.loading-icon {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 2rem;
}

.icon-ring {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
}

.icon-ring--outer {
  inset: 0;
  border-top-color: #3b82f6;
  border-right-color: #3b82f6;
  animation: spin 2s linear infinite;
}

.icon-ring--middle {
  inset: 12px;
  border-bottom-color: #10b981;
  border-left-color: #10b981;
  animation: spin 1.5s linear infinite reverse;
}

.icon-ring--inner {
  inset: 24px;
  border-top-color: #f59e0b;
  animation: spin 1s linear infinite;
}

.icon-center {
  position: absolute;
  inset: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.spa-icon {
  width: 28px;
  height: 28px;
  color: #3b82f6;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

/* Loading Dots */
.loading-dots {
  display: flex;
  gap: 8px;
  margin-bottom: 1.5rem;
}

.dot {
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border-radius: 50%;
  animation: bounce 1.4s ease-in-out infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
  background: #10b981;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
  background: #f59e0b;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Loading Text */
.loading-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
  letter-spacing: -0.025em;
}

.loading-subtext {
  font-size: 0.875rem;
  color: #6b7280;
  text-transform: capitalize;
  margin-bottom: 2.5rem;
}

/* Shimmer Preview Cards */
.loading-preview {
  display: flex;
  gap: 1rem;
  width: 100%;
  max-width: 600px;
}

.shimmer-card {
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.shimmer-card--hidden-mobile {
  display: none;
}

@media (min-width: 640px) {
  .shimmer-card--hidden-mobile {
    display: block;
  }
}

.shimmer-line {
  height: 12px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  border-radius: 6px;
  animation: shimmer 1.5s infinite;
  margin-bottom: 0.75rem;
}

.shimmer-line--title {
  width: 60%;
  height: 14px;
  margin-bottom: 1rem;
}

.shimmer-line--text {
  width: 100%;
}

.shimmer-line--short {
  width: 70%;
  margin-bottom: 0;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}

.preview-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: #FEF3C7;
  color: #92400E;
  text-align: center;
  padding: 8px;
  z-index: 9999;
  font-weight: 600;
}
</style>
