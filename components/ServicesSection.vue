<template>
  <section id="services" class="section-padding bg-white">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl md:text-5xl font-light text-center text-parentPrimary mb-4">
        Our Key Offerings
      </h2>
      <p class="text-center text-parentPrimary/70 mb-12">
        Achieve your self-care goals more effortlessly than ever with our extensive selection of 
        <span class="underline decoration-accent">thoughtfully curated services</span> and our invaluable 
        <span class="underline decoration-accent">Spa Membership package</span>.
      </p>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard 
          v-for="service in services" 
          :key="service.title"
          :title="service.title"
          :image="service.image"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const services = [
  {
    title: 'Spa BnB Experience',
    image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&h=400&fit=crop'
  },
  {
    title: 'Mobile Spa',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop'
  },
  {
    title: 'Targeted Wellness Treatment',
    image: 'https://images.unsplash.com/photo-1519824145371-296894a0daa9?w=600&h=400&fit=crop'
  },
  {
    title: 'Spa Management Services',
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop'
  },
  {
    title: 'Team Bonding and Group Retreats',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&h=400&fit=crop'
  }
]
</script>