<template>
  <footer v-if="config?.enabled !== false" class="storefront-footer">
    <div class="footer-gradient"></div>
    <div class="container footer-inner">
      <!-- Main Footer Content -->
      <div class="footer-grid">
        <!-- Brand Section -->
        <div class="footer-brand">
          <div class="brand-logo">
            <span class="brand-initial">{{ business?.businessName?.charAt(0) || 'L' }}</span>
          </div>
          <h3 class="footer-business-name">{{ business?.businessName }}</h3>
          <p v-if="business?.businessDescription" class="footer-description">
            {{ truncateText(business.businessDescription, 120) }}
          </p>
          
          <!-- Social Media -->
          <div class="footer-social" v-if="socialMedia">
            <a v-if="socialMedia.instagram" :href="socialMedia.instagram" target="_blank" class="social-link instagram" aria-label="Instagram">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a v-if="socialMedia.facebook" :href="socialMedia.facebook" target="_blank" class="social-link facebook" aria-label="Facebook">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a v-if="socialMedia.twitter" :href="socialMedia.twitter" target="_blank" class="social-link twitter" aria-label="Twitter">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
            <a v-if="socialMedia.tiktok" :href="socialMedia.tiktok" target="_blank" class="social-link tiktok" aria-label="TikTok">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-section">
          <h4 class="footer-section-title">Quick Links</h4>
          <nav class="footer-nav">
            <a href="#services" class="footer-link">
              <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              Our Services
            </a>
            <a href="#about" class="footer-link">
              <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              About Us
            </a>
            <a href="#gallery" class="footer-link">
              <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              Gallery
            </a>
            <a href="#contact" class="footer-link">
              <svg class="link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
              Contact
            </a>
          </nav>
        </div>

        <!-- Contact Info -->
        <div class="footer-section">
          <h4 class="footer-section-title">Get in Touch</h4>
          <div class="footer-contact">
            <div v-if="business?.businessPhone" class="contact-item">
              <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <span>{{ business.businessPhone }}</span>
            </div>
            <div v-if="business?.businessEmail" class="contact-item">
              <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
              <span>{{ business.businessEmail }}</span>
            </div>
            <div v-if="business?.businessAddress" class="contact-item">
              <svg class="contact-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <span>{{ business.businessAddress }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <div class="footer-bottom-content">
          <p class="copyright">&copy; {{ new Date().getFullYear() }} {{ business?.businessName }}. All rights reserved.</p>
          <p class="footer-powered">
            Powered by 
            <a href="https://lolapril.com" target="_blank" class="powered-link">
              Lola April
              <svg class="external-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
interface Props {
  config?: any
  business?: any
}

const props = defineProps<Props>()

// Social media can be at business.socialMedia or business.contact.socialMedia
const socialMedia = computed(() => {
  return props.business?.socialMedia || props.business?.contact?.socialMedia || null
})

const truncateText = (text: string, maxLength: number) => {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}
</script>

<style scoped>
.storefront-footer {
  position: relative;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  color: white;
  padding: 4rem 0 0;
  overflow: hidden;
}

.footer-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-accent, #ec4899) 50%, var(--color-primary) 100%);
}

.footer-inner {
  position: relative;
  z-index: 1;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

@media (max-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    text-align: center;
  }
}

/* Brand Section */
.footer-brand {
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .footer-brand {
    align-items: center;
  }
}

.brand-logo {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent, #ec4899) 100%);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.brand-initial {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.footer-business-name {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.footer-description {
  font-size: 0.9rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.7);
  max-width: 300px;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .footer-description {
    max-width: 100%;
  }
}

/* Social Links */
.footer-social {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .footer-social {
    justify-content: center;
  }
}

.social-link {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.3s ease;
}

.social-link svg {
  width: 20px;
  height: 20px;
}

.social-link.instagram:hover {
  background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
}

.social-link.facebook:hover {
  background: #1877f2;
}

.social-link.twitter:hover {
  background: #1da1f2;
}

.social-link.tiktok:hover {
  background: linear-gradient(135deg, #25f4ee, #fe2c55);
}

/* Footer Sections */
.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-section-title {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 1.5rem;
}

/* Navigation Links */
.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

@media (max-width: 768px) {
  .footer-link {
    justify-content: center;
  }
}

.footer-link:hover {
  color: white;
  transform: translateX(4px);
}

.link-icon {
  width: 16px;
  height: 16px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.footer-link:hover .link-icon {
  opacity: 1;
}

/* Contact Info */
.footer-contact {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .contact-item {
    justify-content: center;
    text-align: left;
  }
}

.contact-icon {
  width: 20px;
  height: 20px;
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: 2px;
}

/* Footer Bottom */
.footer-bottom {
  padding: 1.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (max-width: 768px) {
  .footer-bottom-content {
    flex-direction: column;
    text-align: center;
  }
}

.copyright {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
}

.footer-powered {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
}

.powered-link {
  color: var(--color-primary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  transition: color 0.2s;
}

.powered-link:hover {
  color: var(--color-accent, #ec4899);
}

.external-icon {
  width: 14px;
  height: 14px;
}
</style>
