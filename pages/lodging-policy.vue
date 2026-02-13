<template>
  <div class="min-h-screen bg-white">
    <TheHeader />
    
    <main class="pt-32 pb-24">
      <div class="max-w-4xl mx-auto px-6">
        <!-- Page Header -->
        <div class="text-center mb-16">
          <h1 class="text-4xl md:text-5xl font-bold text-parentPrimary mb-4">Lodging Policy</h1>
          <div class="w-24 h-1 bg-accent mx-auto"></div>
        </div>

        <!-- Policy Content -->
        <div class="space-y-12 text-gray-700 leading-relaxed">
          
          <!-- 1. Booking and Payment -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">1.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Booking and Payment:</h2>
            </div>
            <div class="pl-8 space-y-3">
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>All room reservations are subject to availability.</p>
              </div>
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Full payment is required at the time of booking.</p>
              </div>
            </div>
          </section>

          <!-- 2. Cancellation and Refund -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">2.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Cancellation and Refund:</h2>
            </div>
            <div class="pl-8 space-y-3">
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Cancellations made within 48 hours of the reservation start time will be charged the full amount.</p>
              </div>
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>No-shows will be charged the full amount.</p>
              </div>
            </div>
          </section>

          <!-- 3. Check-in and Check-out -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">3.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Check-in and Check-out:</h2>
            </div>
            <div class="pl-8 space-y-3">
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Check-in begins at 4:00 PM; check-out by 12:00 PM.</p>
              </div>
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Early check-ins and late check-outs are subject to availability and may incur additional charges.</p>
              </div>
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>The room reverts to the standard hourly lodging rate by 12:01 PM.</p>
              </div>
            </div>
          </section>

          <!-- 4. Guest Assistance -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">4.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Guest Assistance:</h2>
            </div>
            <div class="flex gap-3 pl-8">
              <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
              <p>For anything you may need during your stay, kindly WhatsApp us on <a href="https://wa.me/2349084821404" target="_blank" class="text-accent underline font-bold">09084821404</a> or call us directly on <a href="tel:07042220934" class="text-accent underline font-bold">07042220934</a>. We are available to assist you throughout your stay and ensure your comfort.</p>
            </div>
          </section>

          <!-- 5. Complimentary Breakfast Policy -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">5.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Complimentary Breakfast Policy:</h2>
            </div>
            <div class="pl-8 space-y-3">
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>We provide <strong>complimentary breakfast for 2 guests</strong> when 2 people lodge, and <strong>complimentary breakfast for 1 guest</strong> when only 1 person lodges. Please note that we do not offer breakfast for 2 when only 1 person is checked in.</p>
              </div>
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Complimentary breakfast is served until <strong>9:00 AM</strong>. Any breakfast requested after 9:00 AM will be billed separately.</p>
              </div>
            </div>
          </section>

          <!-- 6. Smoking Policy -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">6.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Smoking Policy:</h2>
            </div>
            <div class="pl-8 space-y-3">
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Smoking is strictly prohibited within the facility, including rooms and common areas.</p>
              </div>
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>A fine of ₦50,000 will be applied for violating the no-smoking policy.</p>
              </div>
            </div>
          </section>

          <!-- 7. Guest Conduct -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">7.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Guest Conduct:</h2>
            </div>
            <div class="pl-8 space-y-3">
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Guests are expected to maintain a respectful and tranquil atmosphere.</p>
              </div>
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Excessive noise or disruptive behavior may result in eviction without refund.</p>
              </div>
            </div>
          </section>

          <!-- 8. Additional Guests -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">8.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Additional Guests:</h2>
            </div>
            <div class="pl-8 space-y-3">
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Maximum occupancy per room: 2 adults.</p>
              </div>
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Additional guests must be registered and may incur extra charges.</p>
              </div>
            </div>
          </section>

          <!-- 9. Room Care -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">9.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Room Care:</h2>
            </div>
            <div class="pl-8 space-y-3">
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Guests are responsible for any damages to the room or property during their stay.</p>
              </div>
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Charges will be applied for missing or damaged items.</p>
              </div>
            </div>
          </section>

          <!-- 10. Security Deposit -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">10.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Security Deposit:</h2>
            </div>
            <div class="flex gap-3 pl-8">
              <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
              <p>A security deposit may be required upon check-in and will be refunded upon check-out, pending room inspection.</p>
            </div>
          </section>

          <!-- 11. Right of Admission -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">11.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Right of Admission:</h2>
            </div>
            <div class="pl-8 space-y-3">
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Lola April Wellness Spa reserves the right to refuse service to anyone.</p>
              </div>
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Any violation of these policies may result in eviction without refund.</p>
              </div>
            </div>
          </section>

          <!-- 12. Hourly Stays -->
          <section class="policy-item">
            <div class="flex items-center gap-3 mb-4">
              <span class="text-2xl font-bold text-parentPrimary">12.</span>
              <h2 class="text-xl font-bold text-parentPrimary uppercase tracking-wide">Hourly Stays:</h2>
            </div>
            <div class="pl-8 space-y-3">
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>Short-term hourly stays are only available to guests with a booked non-refundable spa appointment.</p>
              </div>
              <div class="flex gap-3">
                <lucide-star class="w-5 h-5 text-accent flex-shrink-0 mt-1" />
                <p>The facility cannot be booked for hourly stays without a spa appointment.</p>
              </div>
            </div>
          </section>
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
  title: 'Lodging Policy - Lola April Wellness Spa',
  meta: [
    { name: 'description', content: 'Lola April Wellness Spa lodging and BnB policies, including check-in/out, conduct, and breakfast policy.' }
  ]
})
</script>

<style scoped>
.policy-item {
  @apply transition-all duration-300 hover:translate-x-1;
}
</style>
