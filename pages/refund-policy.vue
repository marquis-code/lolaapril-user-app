<template>
  <div class="min-h-screen bg-white">
    <TheHeader />
    
    <main class="pt-32 pb-24">
      <div class="max-w-4xl mx-auto px-6">
        <!-- Page Header -->
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-5xl font-bold text-parentPrimary mb-4">Refund Policy</h1>
          <div class="w-24 h-1 bg-accent mx-auto"></div>
        </div>

        <!-- Policy Content -->
        <div class="space-y-12 text-gray-700 leading-relaxed">
          
          <!-- 1. Cancellation Policy -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">1.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Cancellation Policy:</h2>
            </div>
            <div class="flex gap-3 pl-8">
              <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
              <p>Cancellations made within 4 hours of the reservation start time without prior notice will result in a charge of the full amount.</p>
            </div>
          </section>

          <!-- 2. No-shows -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">2.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">No-shows:</h2>
            </div>
            <div class="flex gap-3 pl-8">
              <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
              <p>Guests who fail to check in on the reserved date without prior notice will be charged the full amount.</p>
            </div>
          </section>

          <!-- 3. Refund Eligibility -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">3.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Refund Eligibility:</h2>
            </div>
            <div class="pl-8 space-y-6">
              <div class="space-y-3">
                <h3 class="font-bold text-parentPrimary">Spa Services:</h3>
                <div class="flex gap-3">
                  <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <p>Spa services cannot be refunded but can be rescheduled or converted into a gift card for future use.</p>
                </div>
              </div>
              <div class="space-y-3">
                <h3 class="font-bold text-parentPrimary">Bed & Breakfast Reservations:</h3>
                <div class="flex gap-3">
                  <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <p>BnB Reservations cannot be refunded but can be rescheduled or converted into a gift card for future use.</p>
                </div>
                <div class="flex gap-3">
                  <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                  <p>In cases of extenuating circumstances, such as medical emergencies or unforeseen travel disruptions, management may exercise discretion in granting refunds.</p>
                </div>
              </div>
            </div>
          </section>

          <!-- 4. Booking Modifications -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">4.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Booking Modifications:</h2>
            </div>
            <div class="flex gap-3 pl-8">
              <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
              <p>Changes to bookings are subject to availability and may incur additional charges.</p>
            </div>
          </section>

          <!-- 5. Force Majeure -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">5.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Force Majeure:</h2>
            </div>
            <div class="flex gap-3 pl-8">
              <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
              <p>In the event of unforeseen circumstances such as natural disasters or other events beyond our control, Lola April Wellness Spa reserves the right to modify or cancel reservations. In such cases, guests will be offered alternative dates or a refund.</p>
            </div>
          </section>

          <!-- 6. Refund Request Process -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">6.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Refund Request Process:</h2>
            </div>
            <div class="pl-8 space-y-3">
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Refund requests must be made in writing via email to <a href="mailto:reservations@lolaapril.com" class="text-accent underline">reservations@lolaapril.com</a>.</p>
              </div>
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Refunds, if applicable, will be processed within 14 days of receiving the written request.</p>
              </div>
            </div>
          </section>

          <!-- 7. Security Deposit -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">7.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Security Deposit:</h2>
            </div>
            <div class="flex gap-3 pl-8">
              <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
              <p>Security deposits, if applicable, will be refunded upon check-out, pending room inspection.</p>
            </div>
          </section>

          <!-- 8. Late Arrival -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">8.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Late Arrival:</h2>
            </div>
            <div class="flex gap-3 pl-8">
              <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
              <p>If a guest is more than 20 minutes late for their Spa (not lodging) appointment, without prior notification, a late fee equivalent to 60% of the service fee will be charged.</p>
            </div>
          </section>

          <div class="pt-8 border-t border-gray-100 italic text-sm text-center">
            <p>Please note that Lola April Wellness Spa reserves the right to update or modify this refund policy as necessary. Guests are encouraged to review the policy before making reservations.</p>
          </div>
        </div>

        <!-- Contact Info Footer -->
        <div class="mt-20 pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-gray-500">
          <div class="flex items-center gap-2">
            <lucide-map-pin class="w-4 h-4 text-accent" />
            <span>11B Rasheed Alaba Williams, Lekki Phase 1, Lagos Nigeria</span>
          </div>
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5"><lucide-phone class="w-3 h-3" /> +2349084821404</span>
            <span class="flex items-center gap-1.5"><lucide-mail class="w-3 h-3" /> info@lolaapril.com</span>
            <span class="flex items-center gap-1.5"><lucide-globe class="w-3 h-3" /> www.lolaapril.com</span>
          </div>
        </div>
      </div>
    </main>

    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { 
  Star as LucideStar, 
  MapPin as LucideMapPin, 
  Phone as LucidePhone, 
  Mail as LucideMail, 
  Globe as LucideGlobe 
} from 'lucide-vue-next'

useHead({
  title: 'Refund Policy - Lola April Wellness Spa',
  meta: [
    { name: 'description', content: 'Lola April Wellness Spa refund and cancellation policies for spa services and BnB reservations.' }
  ]
})
</script>

<style scoped>
.policy-item {
  @apply transition-all duration-300 hover:translate-x-1;
}
</style>
