
<template>
  <section id="about" class="section-padding bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Heading & Description -->
      <div class="mb-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-6">About</h2>
        <p class="max-w-4xl text-lg text-gray-600 leading-relaxed">
          LA Wellness Spa offers a range of luxurious treatments including revitalizing facials, soothing massages, expert
          waxing, and indulgent body treatments. Our Spa BnB provides a serene atmosphere designed for relaxation and
          rejuvenation, inviting you to immerse yourself in a journey to wellness.
        </p>
      </div>

      <!-- Google Map Section -->
      <div class="mb-12">
        <div class="relative w-full h-[450px] rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7291771900223!2d3.4735391!3d6.4352528!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf44df79e772d%3A0xe9eba1cd2e6d403d!2s11%20Rasheed%20Alaba%20Williams%20St%2C%20Lekki%20Phase%20I%20106104%2C%20Lekki%2C%20Lagos!5e0!3m2!1sen!2sng!4v1707730000000!5m2!1sen!2sng"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div class="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <p class="text-gray-700">11 Rasheed Alaba Williams Street, Lekki Phase I, Lekki, Lagos</p>
          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=11+Rasheed+Alaba+Williams+Street,+Lekki+Phase+I,+Lekki,+Lagos" 
            target="_blank"
            class="text-blue-600 font-medium hover:underline flex items-center gap-1"
          >
            Get directions
          </a>
        </div>
      </div>

      <!-- Details Grid -->
      <div class="grid md:grid-cols-2 gap-16 pt-8 border-t border-gray-100">
        <!-- Opening Times -->
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-8">Opening times</h3>
          <div class="space-y-4">
            <div v-for="day in openingHours" :key="day.name" class="flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <span :class="['w-3 h-3 rounded-full', day.isOpen ? 'bg-green-500' : 'bg-gray-300']"></span>
                <span :class="['font-medium', day.isToday ? 'text-gray-900 font-bold' : 'text-gray-600']">{{ day.name }}</span>
              </div>
              <span :class="['tabular-nums', day.isToday ? 'text-gray-900 font-bold' : 'text-gray-500']">{{ day.hours }}</span>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div>
          <h3 class="text-2xl font-bold text-gray-900 mb-8">Additional information</h3>
          <div class="space-y-6">
            <div class="flex items-start gap-3">
              <lucide-check class="w-5 h-5 text-gray-900 mt-1" />
              <div>
                <p class="font-medium text-gray-900">Instant Confirmation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Check as LucideCheck } from 'lucide-vue-next';
import { computed } from 'vue';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const currentDayIndex = computed(() => {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1; // Adjust so Monday is 0 and Sunday is 6
});

const openingHours = computed(() => {
  return days.map((name, index) => ({
    name,
    hours: '00:00 - 00:00',
    isOpen: true,
    isToday: index === currentDayIndex.value
  }));
});
</script>

<style scoped>
.section-padding {
  padding: 100px 0;
}

@media (max-width: 768px) {
  .section-padding {
    padding: 60px 0;
  }
}
</style>