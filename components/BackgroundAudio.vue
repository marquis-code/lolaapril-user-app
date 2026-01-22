<template>
  <div
    v-if="showControls"
    class="fixed bottom-6 right-6 z-[999999]"
  >
    <button
      @click="togglePlay"
      class="group relative w-14 h-14 rounded-full bg-primary shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center transform hover:scale-110"
    >
      <!-- Play Icon -->
      <svg 
        v-if="!isPlaying" 
        viewBox="0 0 24 24" 
        class="w-6 h-6 text-white ml-0.5" 
        fill="currentColor"
      >
        <polygon points="8,5 19,12 8,19" />
      </svg>

      <!-- Pause Icon -->
      <svg 
        v-else 
        viewBox="0 0 24 24" 
        class="w-6 h-6 text-white" 
        fill="currentColor"
      >
        <rect x="7" y="5" width="3" height="14" rx="1" />
        <rect x="14" y="5" width="3" height="14" rx="1" />
      </svg>

      <!-- Ripple Effect when Playing -->
      <span 
        v-if="isPlaying"
        class="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-20"
      ></span>
      
      <!-- Music Note Icon (decorative) -->
      <svg 
        class="absolute -top-1 -right-1 w-4 h-4 text-white bg-pink-500 rounded-full p-0.5" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
      </svg>
    </button>

    <audio
      ref="audioRef"
      :src="src"
      loop
      playsinline
      preload="auto"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  src: string
}>()

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const showControls = ref(true)
const hasInteracted = ref(false)

// Aggressive play attempt
const attemptPlay = async () => {
  if (!audioRef.value) return

  try {
    audioRef.value.muted = false
    audioRef.value.volume = 0.4
    await audioRef.value.play()
    isPlaying.value = true
    hasInteracted.value = true
  } catch (e) {
    // If unmuted fails, try muted
    try {
      audioRef.value.muted = true
      await audioRef.value.play()
      isPlaying.value = true
      hasInteracted.value = true
    } catch (err) {
      console.warn('Audio blocked - waiting for user interaction')
      isPlaying.value = false
    }
  }
}

// Handle user interactions to unlock audio
const handleUserInteraction = async () => {
  if (!hasInteracted.value && audioRef.value) {
    await attemptPlay()
  }
}

onMounted(async () => {
  if (!audioRef.value) return

  // Set initial volume
  audioRef.value.volume = 0.4

  // Try to play immediately
  await attemptPlay()

  // Listen for ANY user interaction to unlock audio
  const events = ['click', 'touchstart', 'keydown', 'scroll']
  events.forEach(event => {
    document.addEventListener(event, handleUserInteraction, { once: true, passive: true })
  })

  // Also listen for page visibility changes to resume
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && audioRef.value && !audioRef.value.paused) {
      attemptPlay()
    }
  })
})

const togglePlay = async () => {
  if (!audioRef.value) return

  if (audioRef.value.paused) {
    try {
      await audioRef.value.play()
      isPlaying.value = true
    } catch (e) {
      console.error('Failed to play:', e)
    }
  } else {
    audioRef.value.pause()
    isPlaying.value = false
  }
}

// Cleanup
onUnmounted(() => {
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.src = ''
  }
})
</script>

<style scoped>
@keyframes ping {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>