<template>
  <div>
    <UiToast class="z-[9999999]" />
    <NuxtLayout class="z-10">
      <NuxtPage class="z-10" />
    </NuxtLayout>
    
    <!-- Chat Widget - Bottom Right -->
    <div class="fixed bottom-6 right-6 z-[999998]">
      <ChatWidget />
    </div>
    
    <!-- Background Audio - Bottom Left -->
    <ClientOnly>
      <div class="fixed bottom-6 left-6 z-[999998]">
        <BackgroundAudio src="/audio/ambient-tranquility-serene-soundscapes-365048.mp3" />
      </div>
    </ClientOnly>
  </div>
</template>

<style>
body {
  font-family: 'Roobert PRO', sans-serif;
}
</style>

<script setup lang="ts">
// Global app configuration
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'

useRealtimeNotifications()

useHead({
  title: 'Lola April Wellness Spa - Outside Health Starts Inside',
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'manifest', href: '/site.webmanifest' }
  ]
})

useSeoMeta({
  title: 'Lola April Wellness Spa — Outside Health Starts Inside',
  ogTitle: 'Lola April Wellness Spa — Outside Health Starts Inside',
  description: 'Premier destination for holistic rejuvenation. Bespoke wellness experiences with 24/7 spa services in Lagos, Nigeria.',
  ogDescription: 'Premier destination for holistic rejuvenation. Bespoke wellness experiences with 24/7 spa services in Lagos, Nigeria.',
  keywords: 'wellness spa Lagos, spa BnB Nigeria, holistic rejuvenation, luxury spa treatments, 24/7 spa services, Lekki spa, Lagos wellness center',
  author: 'Lola April Wellness Spa',
  ogType: 'website',
  ogUrl: 'https://lolaaprilwellnessspa.com',
  ogImage: 'https://lolaaprilwellnessspa.com/og-image.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Lola April Wellness Spa — Outside Health Starts Inside',
  twitterDescription: 'Premier destination for holistic rejuvenation. Bespoke wellness experiences with 24/7 spa services in Lagos, Nigeria.',
  twitterImage: 'https://lolaaprilwellnessspa.com/og-image.jpg'
})
</script>