<template>
  <div>
    <BookingModal
      :is-open="isModalOpen"
      @close="handleClose"
      @success="handleSuccess"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Lola April Wellness Spa - User Portal',
  meta: [
    { name: 'description', content: 'Login, signup, and manage your Lola April Wellness Spa bookings. Secure, fast, and user-friendly portal.' },
    { name: 'robots', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
    { name: 'googlebot', content: 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Lola April Wellness Spa - User Portal' },
    { property: 'og:description', content: 'Login, signup, and manage your Lola April Wellness Spa bookings. Secure, fast, and user-friendly portal.' },
    { property: 'og:url', content: 'https://lolaapril.com/user' },
    { property: 'og:image', content: 'https://lolaapril.com/assets/img/logo.png' },
    { property: 'og:site_name', content: 'Lola April Wellness Spa' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Lola April Wellness Spa - User Portal' },
    { name: 'twitter:description', content: 'Login, signup, and manage your Lola April Wellness Spa bookings. Secure, fast, and user-friendly portal.' },
    { name: 'twitter:image', content: 'https://lolaapril.com/assets/img/logo.png' },
  ],
  link: [
    { rel: 'canonical', href: 'https://lolaapril.com/user' }
  ]
})

const router = useRouter()
const isModalOpen = ref(true)

const handleClose = () => {
  isModalOpen.value = false
  router.push('/')
}

const handleSuccess = () => {
  isModalOpen.value = false
  // Handle success (redirect to confirmation page, etc.)
}

// Open modal on mount
onMounted(() => {
  isModalOpen.value = true
})
</script>