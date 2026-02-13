<template>
  <div>
    <!-- Modal Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-md p-0 sm:p-4"
        @click.self="isOpen = false"
      >
        <div class="relative w-full h-[95vh] sm:h-auto sm:max-w-4xl sm:max-h-[90vh] bg-white rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-y-auto overflow-x-hidden custom-scrollbar shadow-2xl border border-white/10">
          
          <!-- Close Button -->
          <button
            @click="isOpen = false"
            class="absolute top-4 right-4 z-50 w-10 h-10 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-all hover:rotate-90 shadow-lg border border-white/20"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Floating Hearts Animation -->
          <div class="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <svg
              v-for="i in 15"
              :key="i"
              class="absolute text-parentPrimaryFirst/30 animate-float-heart"
              :style="{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${10 + Math.random() * 5}s`,
                width: `${15 + Math.random() * 25}px`,
                height: `${15 + Math.random() * 25}px`,
              }"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <!-- Hero Carousel Section (Taller & Clear) -->
          <div class="relative h-[450px] sm:h-[700px] w-full group overflow-hidden">
            <TransitionGroup name="slide">
              <div
                v-for="(img, idx) in carouselImages"
                :key="img"
                v-show="currentSlide === idx"
                class="absolute inset-0 transition-all duration-1000"
              >
                <img
                  :src="img"
                  class="w-full h-full object-cover scale-105 animate-subtle-zoom"
                  alt="Valentine Experience"
                />
              </div>
            </TransitionGroup>

            <!-- Indicators -->
            <div class="absolute bottom-6 right-6 z-30 flex gap-2">
              <button
                v-for="(_, i) in carouselImages"
                :key="i"
                @click="currentSlide = i"
                class="h-1.5 transition-all duration-500 rounded-full shadow-sm"
                :class="currentSlide === i ? 'w-8 bg-parentPrimaryFirst' : 'w-2 bg-white/60 hover:bg-white/90'"
              />
            </div>
          </div>

          <!-- Hero Content (Dedicated Text Area) -->
          <div class="px-6 sm:px-12 py-10 sm:py-16 bg-white relative">
            <div class="max-w-2xl mx-auto text-center animate-fade-in-up">
              <div class="inline-flex items-center gap-2 bg-rose-100 text-parentPrimaryFirst px-4 py-1.5 rounded-full mb-6 border border-parentPrimaryFirst">
                <span class="animate-pulse text-sm">✨</span>
                <span class="text-xs sm:text-sm font-bold tracking-wider uppercase">Valentine's Special 2026</span>
              </div>
              <h1 class="text-3xl sm:text-5xl font-black mb-4 leading-[1.1] tracking-tight text-gray-900">
                Love is in the <span class="text-parentPrimaryFirst">Air</span>, <br class="hidden sm:block" />
                Spa is in the <span class="text-parentPrimaryFirst">Soul</span>
              </h1>
              <p class="text-sm sm:text-lg text-gray-600 mb-8 font-medium leading-relaxed max-w-lg mx-auto">
                Celebrate your love with a curated sanctuary of relaxation. Exclusive Valentine's packages designed for unforgettable moments.
              </p>
              <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  @click="onServiceClick"
                  class="inline-flex text-white items-center justify-center gap-3 bg-parentPrimary px-10 py-4 rounded-full font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 shadow-xl shadow-parentPrimaryFirst group"
                >
                  Book Your Experience
                  <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Features Section -->
          <div class="bg-rose-50/30 px-6 py-12 sm:py-20 border-t border-rose-100">
            <div class="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-10">
              <div v-for="(item, idx) in valentineHighlights" :key="idx" class="text-center group p-4 rounded-2xl transition-all hover:bg-white hover:shadow-xl hover:shadow-rose-100/50">
                <div class="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-2xl flex items-center justify-center text-3xl mb-4 mx-auto shadow-md group-hover:scale-110 transition-transform bg-gradient-to-br from-white to-rose-50">
                  {{ item.icon }}
                </div>
                <h3 class="font-bold text-gray-900 text-sm sm:text-base mb-1 truncate">{{ item.title }}</h3>
                <p class="text-xs sm:text-sm text-gray-500 leading-tight">{{ item.desc }}</p>
              </div>
            </div>

            <div class="mt-16 sm:mt-24 bg-[#8D6628] rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-2xl shadow-parentPrimaryFirst">
              <div class="relative z-10 flex flex-col items-center">
                <div class="text-parentPrimaryFirst font-bold tracking-widest uppercase text-xs mb-2">Exclusive Offer</div>
                <div class="text-3xl sm:text-5xl font-black mb-2">50% DISCOUNT</div>
                <p class="text-rose-100 text-sm sm:text-lg mb-8 max-w-sm font-medium">For all couples treatments booked before February 14th</p>
                <button
                  @click="onServiceClick"
                  class="bg-white text-parentPrimaryFirst px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-rose-50 transition-all shadow-xl shadow-black/10 active:scale-95"
                >
                  Claim Offer Now
                </button>
              </div>

              
              <!-- Abstract shapes for decor -->
              <div class="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-parentPrimaryFirst/30 rounded-full blur-2xl" />
            </div>
            
            <p class="text-center text-gray-400 text-[10px] sm:text-xs mt-8 font-medium italic">
              *Terms and conditions apply. Limited slots available for peak hours.
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useAnalytics } from '@/composables/useAnalytics'


const isOpen = ref(false)
const currentSlide = ref(0)
const { trackEvent } = useAnalytics()

let slideInterval: any = null

// Real images from assets/img/valentine
import val1 from '@/assets/img/valentine/val1.jpg'
import val2 from '@/assets/img/valentine/val2.jpg'
import val4 from '@/assets/img/valentine/val4.jpg'
import val5 from '@/assets/img/valentine/val5.jpg'
import avl3 from '@/assets/img/valentine/avl3.jpg'

const carouselImages = [val1, val2, val4, val5, avl3]

const valentineHighlights = [
  { icon: '💝', title: 'Couples Massage', desc: 'Indulge in side-by-side relaxation' },
  { icon: '🌹', title: 'Rose Rituals', desc: 'Organic rose-infused skin treatments' },
  { icon: '🥂', title: 'Luxury Bubbles', desc: 'Complimentary champagne toast' },
  { icon: '🧖‍♀️', title: 'Private Suite', desc: 'Decorated VIP therapy rooms' },
  { icon: '🍓', title: 'Sweet Treats', desc: 'Gourmet chocolate strawberries' },
  { icon: '✨', title: 'Gold Facial', desc: 'Radiance for your special night' },
]

const startSlideShow = () => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % carouselImages.length
  }, 4500)
}

onMounted(() => {
  setTimeout(() => {
    isOpen.value = true
    startSlideShow()
  }, 800)
})

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval)
})

watch(isOpen, (newVal) => {
  if (newVal) {
    trackEvent('click', 'Valentines Modal', 'open_modal')
  } else {
    trackEvent('click', 'Valentines Modal', 'close_modal')
  }
})


function onServiceClick() {
  trackEvent('click', 'Valentines Modal', 'claim_offer_click')
  navigateTo({
    path: '/book',
    query: {
      subdomain: 'lola-beauty',
    },
  })
}

</script>

<style scoped>
@keyframes float-heart {
  0% { transform: translateY(110vh) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-20vh) rotate(360deg); opacity: 0; }
}

@keyframes subtle-zoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-float-heart { animation: float-heart linear infinite; }
.animate-subtle-zoom { animation: subtle-zoom 10s linear infinite alternate; }
.animate-fade-in-up { animation: fade-in-up 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active {
  transition: all 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-enter-from { opacity: 0; transform: scale(1.05); }
.slide-leave-to { opacity: 0; }

/* Custom Scrollbar for better UX */
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e11d48; border-radius: 10px; }
</style>