<template>
  <footer class="bg-parentPrimary text-white pt-16 pb-8">
    <div class="max-w-7xl mx-auto px-6 md:px-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <!-- Brand Section -->
        <div class="space-y-6">
          <NuxtLink to="/" class="inline-block">
            <img src="@/assets/img/logo.png" alt="Lola April Wellness Spa Logo" class="h-12 w-auto brightness-0 invert" />
          </NuxtLink>
          <p class="text-white/70 text-sm leading-relaxed max-w-xs">
            Advancing mental health through spa therapy. Your ultimate sanctuary for physical and mental rejuvenation in Lagos, Nigeria.
          </p>
          <div class="flex items-center gap-4">
            <a href="https://instagram.com/lolaaprilspa" target="_blank" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-parentPrimary transition-all duration-300">
              <lucide-instagram class="w-5 h-5" />
            </a>
            <a href="https://twitter.com/lolaaprilspa" target="_blank" class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-parentPrimary transition-all duration-300">
              <lucide-twitter class="w-5 h-5" />
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h4 class="text-accent font-bold uppercase tracking-wider text-xs mb-6">Quick Links</h4>
          <ul class="space-y-4 text-sm">
            <li><NuxtLink to="/" class="text-white/70 hover:text-accent transition-colors">Home</NuxtLink></li>
            <li><NuxtLink to="/#services" class="text-white/70 hover:text-accent transition-colors">Services</NuxtLink></li>
            <li><NuxtLink to="/#story" class="text-white/70 hover:text-accent transition-colors">Our Story</NuxtLink></li>
            <li><NuxtLink to="/#gallery" class="text-white/70 hover:text-accent transition-colors">Gallery</NuxtLink></li>
          </ul>
        </div>

        <!-- Legal -->
        <div>
          <h4 class="text-accent font-bold uppercase tracking-wider text-xs mb-6">Policies</h4>
          <ul class="space-y-4 text-sm">
            <li><NuxtLink to="/refund-policy" class="text-white/70 hover:text-accent transition-colors">Refund Policy</NuxtLink></li>
            <li><NuxtLink to="/lodging-policy" class="text-white/70 hover:text-accent transition-colors">Lodging Policy</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="space-y-6">
          <h4 class="text-accent font-bold uppercase tracking-wider text-xs mb-6">Contact Us</h4>
          <div class="space-y-4 text-sm">
            <div class="flex items-start gap-3">
              <lucide-map-pin class="w-5 h-5 text-accent flex-shrink-0" />
              <span class="text-white/70">11 Rasheed Alaba Williams Street, Lekki Phase I, Lagos Nigeria</span>
            </div>
            <div class="flex items-center gap-3">
              <lucide-mail class="w-5 h-5 text-accent flex-shrink-0" />
              <a href="mailto:info@lolaapril.com" class="text-white/70 hover:text-accent transition-colors">info@lolaapril.com</a>
            </div>
            <div class="flex items-center gap-3 ml-8">
              <!-- <lucide-mail class="w-5 h-5 text-accent flex-shrink-0" /> -->
              <a href="mailto:reservations@lolaapril.com" class="text-white/70 hover:text-accent transition-colors">reservations@lolaapril.com</a>
            </div>
            <div class="flex items-center gap-3">
              <lucide-phone class="w-5 h-5 text-accent flex-shrink-0" />
              <a href="tel:+2349084821404" class="text-white/70 hover:text-accent transition-colors inline">+234 (908) 482 1404</a>
            </div>
              <div class="flex items-center gap-3 ml-8">
              <!-- <lucide-phone class="w-5 h-5 text-accent flex-shrink-0" /> -->
              <a href="tel:+2347042220934" class="text-white/70 hover:text-accent transition-colors">+234 704 222 0934</a>
            </div>
            <div class="pt-4">
              <NuxtLink to="/book?subdomain=lola-beauty" class="inline-block px-8 py-3 bg-accent text-parentPrimary font-bold rounded-full hover:opacity-90 transition-opacity">
                Book Now
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
        <p>© {{ new Date().getFullYear() }} Lola April Wellness Spa. All rights reserved.</p>
        <div class="flex items-center gap-6">
          <p>Privacy Policy</p>
          <p>Terms of Service</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { 
  Instagram as LucideInstagram, 
  Twitter as LucideTwitter, 
  MapPin as LucideMapPin, 
  Mail as LucideMail, 
  Phone as LucidePhone 
} from 'lucide-vue-next'
</script>

<style scoped>
footer {
  /* Using color variables from the theme if available, otherwise fallbacks */
  --footer-bg: var(--color-parentPrimary, #005967);
  --footer-accent: var(--color-accent, #EAB308);
}
</style>
