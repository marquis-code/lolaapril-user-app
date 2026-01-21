<template>
  <section class="section-padding bg-secondary">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <div class="text-6xl md:text-8xl font-serif text-primary mb-8">"</div>
        
        <div class="relative h-64 overflow-hidden">
          <transition-group name="fade" mode="out-in">
            <div 
              v-for="(testimonial, index) in testimonials" 
              :key="index"
              v-show="currentIndex === index"
              class="absolute inset-0 flex flex-col items-center justify-center"
            >
              <p class="text-xl md:text-2xl text-primary mb-8 italic px-6">
                {{ testimonial.text }}
              </p>
              
              <div class="flex text-accent mb-4">
                <svg v-for="i in 5" :key="i" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              
              <p class="text-primary font-medium">{{ testimonial.author }}</p>
            </div>
          </transition-group>
        </div>

        <!-- Navigation Dots -->
        <div class="flex justify-center space-x-2 mt-8">
          <button 
            v-for="(_, index) in testimonials" 
            :key="index"
            @click="currentIndex = index"
            class="w-3 h-3 rounded-full transition-all duration-300"
            :class="currentIndex === index ? 'bg-primary w-8' : 'bg-primary/30'"
          ></button>
        </div>
      </div>

      <!-- Marquee -->
      <div class="overflow-hidden">
        <div class="marquee whitespace-nowrap">
          <span class="inline-block text-3xl md:text-4xl text-primary font-light mx-8">
            a better life awaits you · a better life awaits you · a better life awaits you ·
          </span>
          <span class="inline-block text-3xl md:text-4xl text-primary font-light mx-8">
            a better life awaits you · a better life awaits you · a better life awaits you ·
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  {
    text: "An absolute sanctuary in the heart of Lagos. The attention to detail and personalized care exceeded all expectations. Every visit feels like a mini-vacation.",
    author: "Chioma O"
  },
  {
    text: "The Spa BnB experience was transformative. From the moment I arrived until checkout, everything was perfect. Will definitely be returning!",
    author: "Amara K"
  },
  {
    text: "Best wellness spa in Lagos! The staff are incredibly professional and the facilities are world-class. Highly recommend their overnight packages.",
    author: "Tunde A"
  }
]

const currentIndex = ref(0)

onMounted(() => {
  setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % testimonials.length
  }, 5000)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.marquee {
  animation: marquee 30s linear infinite;
}
</style>
