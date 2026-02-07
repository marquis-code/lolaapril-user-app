<template>
  <section v-if="visibleImages?.length" id="gallery" class="section gallery-section">
    <div class="container">
      <h2 class="section-title">{{ title || 'Gallery' }}</h2>
      <p v-if="subtitle" class="section-subtitle">{{ subtitle }}</p>

      <div 
        class="gallery-grid"
        :class="gridClass"
      >
        <div 
          v-for="(image, index) in visibleImages" 
          :key="image.id || index"
          class="gallery-item"
          @click="openLightbox(index)"
        >
          <img :src="getImageUrl(image)" :alt="getImageAlt(image, index)" />
          <div v-if="image.caption" class="gallery-caption">
            <span>{{ image.caption }}</span>
          </div>
        </div>
      </div>

      <!-- Placeholder when no images -->
      <div v-if="!visibleImages?.length && showPlaceholder" class="gallery-placeholder">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p class="text-gray-500">Gallery coming soon</p>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="lightboxOpen" class="lightbox" @click="lightboxOpen = false">
        <button class="lightbox-close" @click="lightboxOpen = false">
          <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <button class="lightbox-prev" @click.stop="prevImage">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div class="lightbox-content" @click.stop>
          <img 
            :src="getImageUrl(visibleImages[currentIndex])" 
            :alt="getImageAlt(visibleImages[currentIndex], currentIndex)"
            class="lightbox-image"
          />
          <p v-if="visibleImages[currentIndex]?.caption" class="lightbox-caption">
            {{ visibleImages[currentIndex].caption }}
          </p>
        </div>
        <button class="lightbox-next" @click.stop="nextImage">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
interface GalleryImage {
  id?: string
  url: string
  thumbnail?: string
  caption?: string
  category?: string
  serviceName?: string
  isVisible?: boolean
  order?: number
}

interface Props {
  title?: string
  subtitle?: string
  config?: any
  images?: GalleryImage[]
  showPlaceholder?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  showPlaceholder: false
})

// Use images prop first, fall back to config.images for backwards compatibility
const visibleImages = computed(() => {
  const imgs = props.images?.length ? props.images : props.config?.images || []
  return imgs
})

const lightboxOpen = ref(false)
const currentIndex = ref(0)

const gridClass = computed(() => {
  const cols = props.config?.columns || 3
  return `grid-cols-${cols}`
})

const getImageUrl = (image: any): string => {
  if (!image) return ''
  if (typeof image === 'string') return image
  return image?.url || image?.thumbnail || image?.src || ''
}

const getImageAlt = (image: any, index: number): string => {
  if (typeof image === 'object') {
    return image?.caption || image?.alt || image?.serviceName || `Gallery image ${index + 1}`
  }
  return `Gallery image ${index + 1}`
}

const openLightbox = (index: number) => {
  currentIndex.value = index
  lightboxOpen.value = true
}

const prevImage = () => {
  currentIndex.value = currentIndex.value === 0 ? visibleImages.value.length - 1 : currentIndex.value - 1
}

const nextImage = () => {
  currentIndex.value = currentIndex.value === visibleImages.value.length - 1 ? 0 : currentIndex.value + 1
}
</script>

<style scoped>
.gallery-section {
  background: var(--color-background);
}

.gallery-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(1, 1fr);
}

.gallery-grid.grid-cols-2 {
  grid-template-columns: repeat(2, 1fr);
}

.gallery-grid.grid-cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

.gallery-grid.grid-cols-4 {
  grid-template-columns: repeat(4, 1fr);
}

@media (max-width: 768px) {
  .gallery-grid.grid-cols-3,
  .gallery-grid.grid-cols-4 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .gallery-grid {
    grid-template-columns: 1fr !important;
  }
}

.gallery-item {
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--card-radius);
  cursor: pointer;
  transition: transform 0.2s;
}

.gallery-item:hover {
  transform: scale(1.02);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.gallery-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 1rem 0.75rem 0.75rem;
  font-size: 0.875rem;
  opacity: 0;
  transition: opacity 0.2s;
}

.gallery-item:hover .gallery-caption {
  opacity: 1;
}

.gallery-item {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: var(--card-radius);
  cursor: pointer;
  transition: transform 0.2s;
}

.gallery-placeholder {
  text-align: center;
  padding: 3rem 0;
}

.no-gallery {
  text-align: center;
  color: var(--color-muted);
  padding: 3rem 0;
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: white;
  background: none;
  border: none;
  cursor: pointer;
}

.lightbox-prev,
.lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  cursor: pointer;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-prev {
  left: 1rem;
}

.lightbox-next {
  right: 1rem;
}

.lightbox-content {
  text-align: center;
}

.lightbox-image {
  max-width: 90%;
  max-height: 85vh;
  object-fit: contain;
}

.lightbox-caption {
  color: white;
  margin-top: 1rem;
  font-size: 0.875rem;
}
</style>
