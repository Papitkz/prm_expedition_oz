<script setup lang="ts">
const currentYear = new Date().getFullYear()

const quickLinks = [
  { label: 'Expeditions', to: '/expeditions' },
  { label: 'Sylvia – 4 Day', to: '/expeditions/sylvia' },
  { label: 'Millenium – 7 Day', to: '/expeditions/millenium' },
  { label: 'About Us', to: '/about' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]
</script>

<template>
  <footer style="background: #050f1a; border-top: 1px solid rgba(201, 168, 76, 0.15);">
    <div class="container mx-auto px-6 lg:px-12 py-16 lg:py-20">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
        <div>
          <div class="mb-6">
            <p class="font-display text-3xl font-light" style="font-family: var(--font-display); color: var(--color-gold-400); letter-spacing: 0.1em;">
              EXPEDITION OZ
            </p>
            <p class="font-heading text-xs mt-1 opacity-60" style="font-family: var(--font-heading); letter-spacing: 0.25em; color: var(--color-sand-100);">
              LUXURY MEETS NATURE
            </p>
          </div>
          <div class="gold-divider-left mb-5"></div>
          <p class="text-sm leading-relaxed opacity-70" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.8;">
            Discover the world's greatest marine wilderness aboard our luxury live-aboard vessels in Ningaloo Reef, Western Australia.
          </p>
          <div class="flex gap-4 mt-6">
            <a href="#" class="social-icon" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="#" class="social-icon" aria-label="Facebook">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>

        <div>
          <p class="overline-text mb-6">Quick Links</p>
          <div class="gold-divider-left mb-6"></div>
          <ul class="space-y-3">
            <li v-for="link in quickLinks" :key="link.to">
              <router-link
                :to="link.to"
                class="footer-link text-sm"
                style="font-family: var(--font-body); color: rgba(248, 245, 239, 0.65);"
              >
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <div>
          <p class="overline-text mb-6">Contact & Bookings</p>
          <div class="gold-divider-left mb-6"></div>
          <div class="space-y-4">
            <div class="flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5" class="mt-0.5 flex-shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              <p class="text-sm opacity-70" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.7;">
                Ningaloo Reef, Western Australia<br/>Exmouth &amp; Coral Bay
              </p>
            </div>
            <div class="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5" class="flex-shrink-0">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
              </svg>
              <a href="tel:+61891234567" class="text-sm opacity-70 hover:opacity-100 transition-opacity" style="font-family: var(--font-body); color: var(--color-sand-200); text-decoration: none;">
                +61 8 9123 4567
              </a>
            </div>
            <div class="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5" class="flex-shrink-0">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <a href="mailto:hello@expeditionoz.com.au" class="text-sm opacity-70 hover:opacity-100 transition-opacity" style="font-family: var(--font-body); color: var(--color-sand-200); text-decoration: none;">
                hello@expeditionoz.com.au
              </a>
            </div>
            <div class="mt-6">
              <router-link to="/contact" class="btn-primary" style="padding: 12px 28px; font-size: 0.62rem;">
                Check Availability
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="border-t mt-14 pt-8" style="border-color: rgba(201, 168, 76, 0.12);">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-xs opacity-40" style="font-family: var(--font-body); color: var(--color-sand-200); letter-spacing: 0.05em;">
            &copy; {{ currentYear }} Expedition OZ. All rights reserved.
          </p>
          <p class="text-xs opacity-40" style="font-family: var(--font-body); color: var(--color-sand-200); letter-spacing: 0.05em;">
            Ningaloo Reef, Western Australia &nbsp;·&nbsp; ABN 00 000 000 000
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: var(--color-gold-400) !important;
}

.social-icon {
  width: 40px;
  height: 40px;
  border: 1px solid rgba(201, 168, 76, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(248, 245, 239, 0.6);
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-icon:hover {
  border-color: var(--color-gold-400);
  color: var(--color-gold-400);
  background: rgba(201, 168, 76, 0.08);
}
</style>
