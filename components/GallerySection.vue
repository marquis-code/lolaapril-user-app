<template>
  <section id="gallery" class="section-padding bg-parentSecondary">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl md:text-5xl font-light text-center text-parentPrimary mb-12">Gallery</h2>
      
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

      <p class="text-center text-parentPrimary mt-8">
        ← Drag to explore →
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import spa1 from '@/assets/img/spa1.png'
import spa2 from '@/assets/img/spa2.png'
import spa18 from '@/assets/img/spa18.jpg'
import spa16 from '@/assets/img/spa16.jpg'
import spa15 from '@/assets/img/spa15.jpg'
import spa6 from '@/assets/img/spa6.png'
import spa4 from '@/assets/img/spa4.png'
import home from '@/assets/img/home.webp'
const galleryImages = [
  spa2,
  spa1,
  spa18,
  spa16,
  spa15,
  spa6,
  spa4,
  home
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
