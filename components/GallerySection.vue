<template>
  <section id="gallery" class="section-padding bg-secondary">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl md:text-5xl font-light text-center text-primary mb-12">Gallery</h2>
      
      <div 
        ref="galleryRef"
        class="flex space-x-6 overflow-x-auto pb-8 scrollbar-hide cursor-grab active:cursor-grabbing"
        @mousedown="startDrag"
        @mousemove="onDrag"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @touchstart="startDrag"
        @touchmove="onDrag"
        @touchend="endDrag"
      >
        <div 
          v-for="(image, index) in galleryImages" 
          :key="index"
          class="flex-shrink-0 w-80 md:w-96"
        >
          <img 
            :src="image" 
            :alt="`Gallery image ${index + 1}`" 
            class="rounded-lg shadow-xl w-full h-96 object-cover"
            draggable="false"
          />
        </div>
      </div>

      <p class="text-center text-primary mt-8">
        ← Drag to explore →
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
const galleryImages = [
  'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&h=800&fit=crop',
  'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=800&fit=crop'
]

const galleryRef = ref<HTMLElement | null>(null)
const isDragging = ref(false)
const startX = ref(0)
const scrollLeft = ref(0)

const startDrag = (e: MouseEvent | TouchEvent) => {
  isDragging.value = true
  const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX
  startX.value = pageX - (galleryRef.value?.offsetLeft || 0)
  scrollLeft.value = galleryRef.value?.scrollLeft || 0
}

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  e.preventDefault()
  const pageX = 'touches' in e ? e.touches[0].pageX : e.pageX
  const x = pageX - (galleryRef.value?.offsetLeft || 0)
  const walk = (x - startX.value) * 2
  if (galleryRef.value) {
    galleryRef.value.scrollLeft = scrollLeft.value - walk
  }
}

const endDrag = () => {
  isDragging.value = false
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
