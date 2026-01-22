<template>
  <div>
    <!-- Modal Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        @click.self="isOpen = false"
      >
        <div class="relative w-full h-full max-w-6xl max-h-[95vh] m-4 bg-white rounded-3xl overflow-hidden shadow-2xl">
          <!-- Close Button -->
          <button
            @click="isOpen = false"
            class="absolute top-6 right-6 z-50 w-12 h-12 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center transition-all hover:scale-110 shadow-lg group"
          >
            <svg class="w-6 h-6 text-gray-700 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Floating Hearts Animation -->
          <div class="absolute inset-0 pointer-events-none overflow-hidden z-10">
            <svg
              v-for="i in 15"
              :key="i"
              class="absolute text-pink-300/30 animate-float-heart"
              :style="{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
                width: `${20 + Math.random() * 30}px`,
                height: `${20 + Math.random() * 30}px`,
              }"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <!-- Content Container -->
          <div class="h-full overflow-y-auto custom-scrollbar">
            <!-- Hero Section -->
            <div class="relative bg-gradient-to-br from-[#005967] via-[#006a7a] to-[#005967] text-white px-8 py-16 text-center overflow-hidden">
              <div class="relative z-20 max-w-3xl mx-auto">
                <div class="inline-flex items-center gap-2 bg-pink-500/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6 animate-pulse">
                  <svg class="w-5 h-5 text-pink-300" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                  </svg>
                  <span class="text-sm font-semibold text-pink-100">Limited Time Offer</span>
                </div>
                
                <h1 class="text-5xl md:text-7xl font-bold mb-4 animate-slide-down">
                  Valentine's Day
                  <span class="block text-pink-300 mt-2">Romance Package</span>
                </h1>
                
                <p class="text-xl md:text-2xl text-teal-100 mb-8 animate-slide-up">
                  Celebrate love with an exclusive couples spa experience
                </p>

                <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                  <div class="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                    <div class="text-3xl font-bold text-pink-300">50% OFF</div>
                    <div class="text-sm text-teal-100">Couples Treatment</div>
                  </div>
                  <div class="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                    <div class="text-3xl font-bold text-pink-300">Free</div>
                    <div class="text-sm text-teal-100">Rose Champagne</div>
                  </div>
                  <div class="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/20">
                    <div class="text-3xl font-bold text-pink-300">VIP</div>
                    <div class="text-sm text-teal-100">Private Suite</div>
                  </div>
                </div>

                <NuxtLink to="/book?subdomain=lola-beauty" class="group text-sm bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold px-12 py-3.5 rounded-full shadow-2xl transition-all hover:scale-105 inline-flex items-center gap-3">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Book Your Experience
                  <svg class="w-5 h-5 group-hover:scale-125 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                </NuxtLink>
              </div>

              <!-- Decorative Elements -->
              <div class="absolute top-0 left-0 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl"></div>
              <div class="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
            </div>

            <!-- Marquee Image Gallery - Top Row -->
            <div class="relative overflow-hidden bg-gradient-to-r from-gray-50 to-white py-8">
              <div class="flex gap-6 animate-marquee hover:pause">
                <div
                  v-for="(img, idx) in [...spaImages, ...spaImages, ...spaImages]"
                  :key="`top-${idx}`"
                  class="flex-shrink-0 w-80 h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white transform hover:scale-105 transition-transform"
                >
                  <img
                    :src="img"
                    :alt="`Spa treatment ${idx + 1}`"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <!-- Package Details -->
            <div class="px-8 py-16 bg-white">
              <div class="max-w-4xl mx-auto">
                <h2 class="text-4xl font-bold text-center mb-4 text-[#005967]">
                  What's Included
                </h2>
                <p class="text-center text-gray-600 mb-12 text-lg">
                  Indulge in a day of pure romance and relaxation
                </p>

                <div class="grid md:grid-cols-2 gap-8">
                  <div
                    v-for="(item, idx) in packages"
                    :key="idx"
                    class="flex gap-4 p-6 bg-gradient-to-br from-teal-50 to-pink-50 rounded-2xl border border-[#005967]/10 hover:shadow-lg transition-all"
                  >
                    <div class="text-4xl">{{ item.icon }}</div>
                    <div>
                      <h3 class="text-xl font-bold text-[#005967] mb-2">{{ item.title }}</h3>
                      <p class="text-gray-600">{{ item.desc }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Marquee Image Gallery - Bottom Row (Reverse) -->
            <div class="relative overflow-hidden bg-gradient-to-r from-white to-gray-50 py-8">
              <div class="flex gap-6 animate-marquee-reverse hover:pause">
                <div
                  v-for="(img, idx) in [...spaImagesReverse, ...spaImagesReverse, ...spaImagesReverse]"
                  :key="`bottom-${idx}`"
                  class="flex-shrink-0 w-80 h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white transform hover:scale-105 transition-transform"
                >
                  <img
                    :src="img"
                    :alt="`Spa treatment ${idx + 1}`"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <!-- CTA Section -->
            <div class="bg-gradient-to-br from-[#005967] to-[#006a7a] text-white px-8 py-16 text-center">
              <div class="max-w-3xl mx-auto">
                <h2 class="text-4xl font-bold mb-4">Ready to Make This Valentine's Unforgettable?</h2>
                <p class="text-xl text-teal-100 mb-8">
                  Book now and receive an exclusive 50% discount. Limited slots available!
                </p>
                
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                  <!-- <button class="bg-white text-[#005967] font-bold px-10 py-4 rounded-full text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
                    Call Now: (555) 123-4567
                  </button> -->
                  <NuxtLink to="/book?subdomain=lola-beauty" class="bg-pink-500 hover:bg-pink-600 text-sm text-white font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 shadow-xl">
                    Book Online
                  </NuxtLink>
                </div>

                <p class="text-sm text-teal-200 mt-6">
                  *Offer valid until February 14th, 2026
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)

const spaImages = [
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80',
  'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80',
  'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&q=80',
  'https://images.unsplash.com/photo-1610875461587-c3bb0a78e2f6?w=800&q=80',
  'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&q=80',
  'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800&q=80',
]

const spaImagesReverse = [...spaImages].reverse()

const packages = [
  { icon: '💆‍♀️', title: 'Couples Massage', desc: '90-minute full body massage with aromatherapy' },
  { icon: '🌹', title: 'Rose Petal Bath', desc: 'Private jacuzzi with rose petals and candles' },
  { icon: '🥂', title: 'Champagne Toast', desc: 'Premium champagne with chocolate-dipped strawberries' },
  { icon: '🧖‍♀️', title: 'Facial Treatment', desc: 'Rejuvenating facial for both partners' },
  { icon: '🎁', title: 'Gift Package', desc: 'Luxury spa products to take home' },
  { icon: '🍽️', title: 'Light Refreshments', desc: 'Gourmet appetizers and herbal teas' },
]

onMounted(() => {
  // Show modal after a brief delay on mount
  setTimeout(() => {
    isOpen.value = true
  }, 500)
})
</script>

<style scoped>
@keyframes float-heart {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes marquee-reverse {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

@keyframes slide-down {
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-float-heart {
  animation: float-heart linear infinite;
}

.animate-marquee {
  animation: marquee 40s linear infinite;
  width: max-content;
}

.animate-marquee-reverse {
  animation: marquee-reverse 40s linear infinite;
  width: max-content;
}

.animate-marquee:hover,
.animate-marquee-reverse:hover {
  animation-play-state: paused;
}

.animate-slide-down {
  animation: slide-down 0.6s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.6s ease-out 0.2s both;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #005967;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #004552;
}
</style>