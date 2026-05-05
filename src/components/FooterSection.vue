<script setup lang="ts">
const currentYear = new Date().getFullYear()

const quickLinks = [
  { label: 'Expeditions', to: '/expeditions' },
  { label: 'Sylvia – 4 Day', to: '/expeditions/sylvia' },
  { label: 'Millenium – 7 Day', to: '/expeditions/millenium' },
  { label: 'About Us', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]
</script>

<template>
  <footer class="site-footer">
    <div class="footer-cta-strip">
      <div class="container mx-auto px-6 lg:px-12">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6 py-10">
          <div>
            <p class="font-display text-2xl lg:text-3xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
              Ready to begin your expedition?
            </p>
            <p class="text-sm mt-1 opacity-60" style="font-family: var(--font-body); color: var(--color-sand-200);">
              Limited departures — secure your place today.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 lg:px-12 pt-16 pb-8">
      <div class="footer-brand-row">
        <div class="footer-compass">
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="24" stroke="rgba(201,168,76,0.2)" stroke-width="1"/>
            <line x1="26" y1="4" x2="26" y2="9" stroke="var(--color-gold-400)" stroke-width="1.5"/>
            <line x1="26" y1="43" x2="26" y2="48" stroke="rgba(201,168,76,0.4)" stroke-width="1"/>
            <line x1="4" y1="26" x2="9" y2="26" stroke="rgba(201,168,76,0.4)" stroke-width="1"/>
            <line x1="43" y1="26" x2="48" y2="26" stroke="rgba(201,168,76,0.4)" stroke-width="1"/>
            <polygon points="26,10 23.5,23 26,26 28.5,23" fill="var(--color-gold-400)"/>
            <polygon points="26,42 23.5,29 26,26 28.5,29" fill="rgba(201,168,76,0.35)"/>
            <circle cx="26" cy="26" r="2.5" fill="var(--color-gold-400)"/>
          </svg>
        </div>
        <div>
          <p class="font-display text-3xl font-light" style="font-family: var(--font-display); color: var(--color-gold-400); letter-spacing: 0.08em;">
            EXPEDITION OZ
          </p>
          <p class="font-heading text-xs mt-1 opacity-50" style="font-family: var(--font-heading); letter-spacing: 0.3em; color: var(--color-sand-100); font-size: 0.55rem;">
            LUXURY MEETS NATURE &nbsp;·&nbsp; NINGALOO REEF, WA
          </p>
        </div>
      </div>

      <div class="footer-divider my-10"></div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16">
        <div class="md:col-span-4">
          <p class="text-sm leading-relaxed opacity-65" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.9;">
            Expedition OZ operates luxury live-aboard tours through the world's greatest fringing reef — Ningaloo, Western Australia. Adventure, ocean, and pure luxury in one extraordinary experience.
          </p>
          <div class="flex gap-3 mt-7">
            <a href="https://www.instagram.com/ExpeditionOz/" class="social-icon" aria-label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
              </svg>
            </a>
            <a href="https://www.facebook.com/ExpeditionOz/" class="social-icon" aria-label="Facebook">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://m.youtube.com/@ExpeditionOz" class="social-icon" aria-label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/>
              </svg>
            </a>
          </div>
        </div>

        <div class="md:col-span-3">
          <p class="overline-text mb-5">Explore</p>
          <ul class="space-y-2.5">
            <li v-for="link in quickLinks" :key="link.to">
              <router-link :to="link.to" class="footer-link">
                <span class="footer-link-arrow">›</span>
                {{ link.label }}
              </router-link>
            </li>
          </ul>
        </div>

        <div class="md:col-span-5">
          <p class="overline-text mb-5">Contact & Bookings</p>
          <div class="space-y-4">
            <a href="tel:+61891234567" class="contact-row">
              <div class="contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
                </svg>
              </div>
              <div>
                <p class="contact-label">Phone</p>
                <p class="contact-value">+61-234-567-890</p>
              </div>
            </a>

            <a href="mailto:hello@expeditionoz.com.au" class="contact-row">
              <div class="contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <div>
                <p class="contact-label">Email</p>
                <p class="contact-value">hello@expeditionoz.com.au</p>
              </div>
            </a>

            <div class="contact-row" style="cursor: default;">
              <div class="contact-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p class="contact-label">Departures From</p>
                <p class="contact-value">Exmouth Marina, WA 6707</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="footer-divider mt-12 mb-8"></div>

      <!-- Left Aligned Copyright Section -->
      <div class="flex flex-col items-start gap-3 w-full">
        <p class="footer-meta">&copy; {{ currentYear }} Expedition OZ. All rights reserved.</p>
        
        <div class="flex items-center gap-6">
          <a href="#" class="footer-meta hover:opacity-70 transition-opacity" style="text-decoration: none;">Privacy Policy</a>
          <a href="#" class="footer-meta hover:opacity-70 transition-opacity" style="text-decoration: none;">Terms</a>
          <p class="footer-meta">ABN 00 000 000 000</p>
        </div>
      </div>

    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: #050f1a;
  border-top: 1px solid rgba(201, 168, 76, 0.15);
}

.footer-cta-strip {
  background: rgba(201, 168, 76, 0.06);
  border-bottom: 1px solid rgba(201, 168, 76, 0.12);
}

.footer-brand-row {
  display: flex;
  align-items: center;
  gap: 18px;
}

.footer-compass {
  opacity: 0.7;
}

.footer-divider {
  height: 1px;
  background: rgba(201, 168, 76, 0.1);
}

.footer-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 0.825rem;
  color: rgba(248, 245, 239, 0.55);
  text-decoration: none;
  transition: color 0.25s ease;
}

.footer-link:hover {
  color: var(--color-gold-400);
}

.footer-link-arrow {
  color: var(--color-gold-400);
  opacity: 0.5;
  font-size: 1rem;
  line-height: 1;
  transition: opacity 0.25s ease, transform 0.25s ease;
  display: inline-block;
}

.footer-link:hover .footer-link-arrow {
  opacity: 1;
  transform: translateX(3px);
}

.contact-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  text-decoration: none;
  padding: 10px 14px;
  border: 1px solid rgba(201, 168, 76, 0.08);
  background: rgba(255, 255, 255, 0.02);
  transition: border-color 0.25s ease, background 0.25s ease;
}

.contact-row:hover {
  border-color: rgba(201, 168, 76, 0.3);
  background: rgba(201, 168, 76, 0.04);
}

.contact-icon {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(201, 168, 76, 0.2);
  flex-shrink: 0;
  margin-top: 1px;
}

.contact-label {
  font-family: var(--font-heading);
  font-size: 0.58rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold-400);
  opacity: 0.7;
  margin-bottom: 2px;
}

.contact-value {
  font-family: var(--font-body);
  font-size: 0.8rem;
  color: rgba(248, 245, 239, 0.7);
}

.social-icon {
  width: 38px;
  height: 38px;
  border: 1px solid rgba(201, 168, 76, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(248, 245, 239, 0.5);
  text-decoration: none;
  transition: all 0.25s ease;
}

.social-icon:hover {
  border-color: var(--color-gold-400);
  color: var(--color-gold-400);
  background: rgba(201, 168, 76, 0.07);
}

.footer-meta {
  font-family: var(--font-body);
  font-size: 0.72rem;
  color: rgba(248, 245, 239, 0.3);
  letter-spacing: 0.04em;
}
</style>