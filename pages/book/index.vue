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