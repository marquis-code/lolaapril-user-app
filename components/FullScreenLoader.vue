<!-- components/FullScreenLoader.vue -->
<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="isLoading"
        class="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-primary via-primary/95 to-primary/90 backdrop-blur-sm"
      >
        <!-- Animated Background Circles -->
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float-slow"></div>
          <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float-slower"></div>
          <div class="absolute top-1/2 right-1/3 w-48 h-48 bg-white/5 rounded-full blur-2xl animate-float"></div>
        </div>

        <!-- Loader Content -->
        <div class="relative z-10 flex flex-col items-center px-4">
          <!-- Outer Rotating Ring -->
          <div class="relative">
            <!-- Rotating Border -->
            <div class="absolute inset-0 -m-4">
              <div class="w-40 h-40 border-4 border-transparent border-t-accent border-r-accent rounded-full animate-spin-slow"></div>
            </div>
            
            <!-- Secondary Rotating Ring -->
            <div class="absolute inset-0 -m-2">
              <div class="w-36 h-36 border-4 border-transparent border-b-accent/50 border-l-accent/50 rounded-full animate-spin-reverse"></div>
            </div>

            <!-- Pulsing Background Circle -->
            <div class="absolute inset-0 -m-6">
              <div class="w-44 h-44 bg-accent/5 rounded-full animate-pulse-slow"></div>
            </div>

            <!-- Logo Container -->
            <div class="relative w-32 h-32 flex items-center justify-center bg-white rounded-full shadow-2xl animate-pulse-subtle">
              <!-- Replace with your logo -->
              <img 
                src="@/assets/img/logo.png" 
                alt="Lola April Wellness Spa" 
                class="w-24 h-24 object-contain"
              />
            </div>

            <!-- Orbiting Dots -->
            <div class="absolute inset-0 animate-spin-slower">
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rounded-full shadow-lg shadow-accent/50"></div>
            </div>
            <div class="absolute inset-0 animate-spin-reverse-slow">
              <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-accent rounded-full shadow-lg shadow-accent/50"></div>
            </div>
          </div>

          <!-- Loading Text -->
          <div class="mt-12 text-center space-y-3">
            <h3 class="text-lg  font-semibold text-white animate-fade-in-up">
              {{ loadingText }}
            </h3>
            
            <!-- Animated Dots -->
            <div class="flex items-center justify-center gap-2">
              <span class="text-white/80 text-sm">Please wait</span>
              <div class="flex gap-1">
                <span class="w-1.5 h-1.5 bg-accent rounded-full animate-bounce-dot" style="animation-delay: 0ms"></span>
                <span class="w-1.5 h-1.5 bg-accent rounded-full animate-bounce-dot" style="animation-delay: 150ms"></span>
                <span class="w-1.5 h-1.5 bg-accent rounded-full animate-bounce-dot" style="animation-delay: 300ms"></span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="w-64 h-1 bg-white/10 rounded-full overflow-hidden mt-6">
              <div class="h-full bg-gradient-to-r from-accent via-white to-accent animate-progress"></div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const isLoading = ref(false)
const loadingText = ref('Loading')

// Listen for loading state changes
onMounted(() => {
  if (process.client) {
    window.addEventListener('loading-start', handleLoadingStart)
    window.addEventListener('loading-stop', handleLoadingStop)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('loading-start', handleLoadingStart)
    window.removeEventListener('loading-stop', handleLoadingStop)
  }
})

const handleLoadingStart = (event: Event) => {
  const customEvent = event as CustomEvent<{ text?: string }>
  loadingText.value = customEvent.detail?.text || 'Loading'
  isLoading.value = true
  
  // Prevent body scroll when loader is active
  if (process.client) {
    document.body.style.overflow = 'hidden'
  }
}

const handleLoadingStop = () => {
  isLoading.value = false
  
  // Re-enable body scroll
  if (process.client) {
    document.body.style.overflow = ''
  }
}
</script>

<style scoped>
/* Floating Animation */
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(-10px) translateX(-10px);
  }
  75% {
    transform: translateY(-15px) translateX(5px);
  }
}

@keyframes float-slow {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
  }
  50% {
    transform: translateY(-30px) translateX(20px) scale(1.1);
  }
}

@keyframes float-slower {
  0%, 100% {
    transform: translateY(0) translateX(0) scale(1);
  }
  50% {
    transform: translateY(20px) translateX(-30px) scale(0.95);
  }
}

/* Spinning Animations */
@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

@keyframes spin-slower {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse-slow {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

/* Pulse Animations */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(1.05);
  }
}

@keyframes pulse-subtle {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
}

/* Bounce Dots Animation */
@keyframes bounce-dot {
  0%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-8px);
    opacity: 1;
  }
}

/* Progress Bar Animation */
@keyframes progress {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Fade In Up Animation */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Apply Animations */
.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}

.animate-float-slower {
  animation: float-slower 10s ease-in-out infinite;
}

.animate-spin-slow {
  animation: spin-slow 3s linear infinite;
}

.animate-spin-reverse {
  animation: spin-reverse 2s linear infinite;
}

.animate-spin-slower {
  animation: spin-slower 4s linear infinite;
}

.animate-spin-reverse-slow {
  animation: spin-reverse-slow 5s linear infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 2s ease-in-out infinite;
}

.animate-pulse-subtle {
  animation: pulse-subtle 3s ease-in-out infinite;
}

.animate-bounce-dot {
  animation: bounce-dot 1s ease-in-out infinite;
}

.animate-progress {
  animation: progress 1.5s ease-in-out infinite;
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}
</style>