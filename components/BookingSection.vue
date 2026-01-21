<template>
  <section id="book" class="section-padding bg-primary text-white text-center">
    <div class="max-w-2xl mx-auto">
      <h2 class="text-4xl md:text-5xl font-light mb-12">Book Now</h2>
      
      <div class="space-y-4 mb-12">
        <p class="text-lg">11B Rasheed Alaba Williams,</p>
        <p class="text-lg">Lekki Phase 1,</p>
        <p class="text-lg">Lagos, Nigeria</p>
        <p class="text-lg mt-6">T: +234 704 222 0934</p>
        <p class="text-lg">E: reservations@lolaapril.com</p>
      </div>

      <button @click="$emit('open-booking')" class="btn-primary text-lg">
        Reserve Your Experience
      </button>

      <!-- Social Media -->
      <div class="flex justify-center space-x-6 mt-12">
        <a href="#" class="hover:text-accent transition-colors">
        <svg data-v-debda76e="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-twitter-icon"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
        </a>
        <a href="#" class="hover:text-accent transition-colors">
          <svg data-v-debda76e="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-facebook-icon"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
        </a>
        <a href="#" class="hover:text-accent transition-colors">
          <svg data-v-debda76e="" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram-icon"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
        </a>
      </div>

      <p class="mt-12 text-sm">© 2025 Lola April.</p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineEmits(['open-booking'])
</script>