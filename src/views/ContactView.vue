<script setup lang="ts">
import { useSEO } from '@/composables/useSEO'
import { ref } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import PageHero from '@/components/PageHero.vue'

useScrollReveal()

useSEO({
  title: 'Contact & Bookings',
  description: 'Book your Ningaloo Reef luxury expedition. Contact Expedition OZ for availability, private charters, and bespoke marine adventures in Western Australia.',
  path: '/contact',
  type: 'website',
  keywords: ['book Ningaloo Reef', 'Expedition OZ contact', 'live-aboard booking', 'Exmouth tours', 'private charter', 'whale shark booking','Expedition OZ'],
jsonLd: {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Contact Expedition OZ",
  "description": "Book your Ningaloo Reef luxury expedition",
  "url": "https://expeditionoz.netlify.app/contact",
  "mainEntity": {
    "@type": "TravelAgency",
    "name": "Expedition OZ",
    "url": "https://expeditionoz.netlify.app",  // ✅ Add this
    "telephone": "+61-8-9123-4567",
    "email": "hello@expeditionoz.com.au",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Exmouth Marina",
      "addressLocality": "Exmouth",
      "addressRegion": "WA",
      "postalCode": "6707",
      "addressCountry": "AU"
    }
  }
}
})

const form = ref({
  name: '',
  email: '',
  phone: '',
  expedition: '',
  guests: '',
  dates: '',
  message: '',
})

const submitted = ref(false)
const submitting = ref(false)

async function handleSubmit() {
  submitting.value = true
  await new Promise(r => setTimeout(r, 1200))
  submitted.value = true
  submitting.value = false
}

const expeditions = [
  'Sylvia – 4 Day Northern Reef Expedition',
  'Millenium – 7 Day Ultimate Reef Expedition',
  'Not sure yet – please advise',
]
</script>

<template>
  <div>
    <PageHero
      tag="Bookings & Enquiries"
      title="Check"
      title-italic="Availability"
      subtitle="Reach out to our team to discuss dates, pricing, and all the details for your perfect expedition."
      image="https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=1920"
      image-alt="Luxury vessel on calm turquoise waters"
      height="55vh"
    />

    <section class="py-24 lg:py-32" style="background: var(--color-ocean-950);">
      <div class="container mx-auto px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div class="section-reveal-left">
            <p class="overline-text mb-4">Get In Touch</p>
            <div class="gold-divider-left mb-6"></div>
            <h2 class="font-display text-4xl font-light mb-6" style="font-family: var(--font-display); color: var(--color-sand-100);">
              Begin Your <span class="italic" style="color: var(--color-gold-400);">Journey</span>
            </h2>
            <p class="text-sm leading-relaxed mb-8 opacity-75" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.8;">
              We personally respond to every enquiry. Our team is happy to discuss expedition options, tailor dates, and answer any questions about life aboard our vessels.
            </p>

            <div class="space-y-6">
              <div class="contact-info-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.42 2 2 0 0 1 3.6 1.24h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 16.92z"/>
                </svg>
                <div>
                  <p class="overline-text mb-1" style="font-size: 0.55rem;">Phone</p>
                  <a href="tel:+61891234567" class="text-sm" style="font-family: var(--font-body); color: var(--color-sand-200); text-decoration: none;">+61-234-567-890</a>
                </div>
              </div>

              <div class="contact-info-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <div>
                  <p class="overline-text mb-1" style="font-size: 0.55rem;">Email</p>
                  <a href="mailto:hello@expeditionoz.com.au" class="text-sm" style="font-family: var(--font-body); color: var(--color-sand-200); text-decoration: none;">hello@expeditionoz.com.au</a>
                </div>
              </div>

              <div class="contact-info-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <div>
                  <p class="overline-text mb-1" style="font-size: 0.55rem;">Departures From</p>
                  <p class="text-sm" style="font-family: var(--font-body); color: var(--color-sand-200);">Exmouth Marina, WA 6707</p>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-2 section-reveal-right">
            <div v-if="!submitted" class="contact-form-wrap">
              <form @submit.prevent="handleSubmit" class="space-y-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="form-group">
                    <label class="form-label">Full Name *</label>
                    <input v-model="form.name" type="text" required class="form-input" placeholder="Your full name" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email Address *</label>
                    <input v-model="form.email" type="email" required class="form-input" placeholder="your@email.com" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <input v-model="form.phone" type="tel" class="form-input" placeholder="+61 4XX XXX XXX" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Number of Guests</label>
                    <input v-model="form.guests" type="number" min="1" max="14" class="form-input" placeholder="e.g. 2" />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Expedition Interest *</label>
                  <select v-model="form.expedition" required class="form-input">
                    <option value="" disabled>Select an expedition</option>
                    <option v-for="exp in expeditions" :key="exp" :value="exp">{{ exp }}</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Preferred Dates</label>
                  <input v-model="form.dates" type="text" class="form-input" placeholder="e.g. March – April 2025, flexible" />
                </div>

                <div class="form-group">
                  <label class="form-label">Message</label>
                  <textarea v-model="form.message" rows="4" class="form-input" placeholder="Tell us about any special requirements, questions, or what you're hoping to experience..."></textarea>
                </div>

                <button type="submit" class="btn-primary w-full" :disabled="submitting" style="padding: 16px; font-size: 0.7rem; width: 100%; text-align: center;">
                  <span v-if="submitting">Sending Enquiry...</span>
                  <span v-else>Send Enquiry</span>
                </button>
              </form>
            </div>

            <div v-else class="success-message">
              <div class="text-center">
                <div class="success-icon mb-6 mx-auto">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" stroke="var(--color-gold-400)" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </div>
                <p class="overline-text mb-4">Enquiry Received</p>
                <div class="gold-divider mb-6"></div>
                <h3 class="font-display text-3xl font-light mb-4" style="font-family: var(--font-display); color: var(--color-sand-100);">
                  Thank you, <span class="italic" style="color: var(--color-gold-400);">{{ form.name.split(' ')[0] }}</span>
                </h3>
                <p class="text-sm opacity-75" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.8;">
                  We've received your enquiry and will be in touch within 24 hours. We look forward to discussing your expedition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact-info-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.contact-form-wrap {
  background: rgba(10, 46, 74, 0.35);
  border: 1px solid rgba(201, 168, 76, 0.15);
  padding: 40px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-family: var(--font-heading);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(248, 245, 239, 0.65);
}

.form-input {
  background: rgba(7, 26, 43, 0.6);
  border: 1px solid rgba(201, 168, 76, 0.2);
  color: var(--color-sand-100);
  padding: 12px 16px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  width: 100%;
  outline: none;
  transition: border-color 0.3s ease;
  -webkit-appearance: none;
  appearance: none;
}

.form-input::placeholder {
  color: rgba(248, 245, 239, 0.3);
}

.form-input:focus {
  border-color: var(--color-gold-400);
}

.success-message {
  background: rgba(10, 46, 74, 0.35);
  border: 1px solid rgba(201, 168, 76, 0.3);
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.success-icon {
  width: 64px;
  height: 64px;
  border: 1px solid rgba(201, 168, 76, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>