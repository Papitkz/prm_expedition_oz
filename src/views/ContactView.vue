<script setup lang="ts">
import { useSEO } from '@/composables/useSEO'
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import PageHero from '@/components/PageHero.vue'
import NoImagePlaceholder from '@/components/NoImagePlaceholder.vue'
import { useComponentCMS } from '@/composables/useComponentCMS'
import { getFirebaseDb, initFirebase } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useEmail } from '@/composables/useEmail'

useScrollReveal()

const route = useRoute()

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
    "url": "https://expeditionoz.netlify.app",
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

const heroCms = useComponentCMS('ContactView')
const heroImage = computed(() => heroCms.getImageUrl('hero', 0))

// Trip data (same as BookView)
const trips = {
  sylvia: {
    id: 'sylvia',
    name: 'Sylvia – 4-Day Northern Reef Expedition',
    duration: '4 Days / 3 Nights',
    guests: 12,
    price: 2495,
    priceCurrency: 'AUD',
  },
  millenium: {
    id: 'millenium',
    name: 'Millenium – 7-Day Ultimate Reef Expedition',
    duration: '7 Days / 6 Nights',
    guests: 14,
    price: 3995,
    priceCurrency: 'AUD',
  },
}

// Pre-select trip from URL query (same as BookView)
const preselectedTrip = computed(() => {
  const query = route.query.trip as string
  return query && trips[query as keyof typeof trips] ? query : ''
})

const form = ref({
  name: '',
  email: '',
  phone: '',
  expedition: preselectedTrip.value,
  guests: '',
  dateFrom: '',
  dateTo: '',
  message: '',
})

const submitted = ref(false)
const submitting = ref(false)
const error = ref('')

const { sendBookingEmails } = useEmail()

const expeditionOptions = [
  { value: 'sylvia', label: 'Sylvia – 4 Days – AUD $2,495 pp' },
  { value: 'millenium', label: 'Millenium – 7 Days – AUD $3,995 pp' },
  { value: 'unsure', label: 'Not sure yet – please advise' },
]

const selectedTripDetails = computed(() => {
  if (!form.value.expedition || form.value.expedition === 'unsure') return null
  return trips[form.value.expedition as keyof typeof trips] || null
})

async function handleSubmit() {
  error.value = ''
  if (!form.value.name.trim() || !form.value.email.trim() || !form.value.expedition) {
    error.value = 'Please fill in all required fields'
    return
  }

  submitting.value = true

  try {
    initFirebase()
    const db = getFirebaseDb()

    const tripName = selectedTripDetails.value?.name || form.value.expedition

    await addDoc(collection(db, 'bookings'), {
      name: form.value.name.trim(),
      email: form.value.email.trim().toLowerCase(),
      phone: form.value.phone.trim(),
      tripName: tripName,
      tripId: selectedTripDetails.value?.id || null,
      guests: form.value.guests ? parseInt(form.value.guests) : null,
      dateFrom: form.value.dateFrom,
      dateTo: form.value.dateTo,
      message: form.value.message.trim(),
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Send email notification (non-blocking)
    sendBookingEmails({
      fullName: form.value.name.trim(),
      email: form.value.email.trim().toLowerCase(),
      phone: form.value.phone.trim() || 'Not provided',
      tripName: tripName,
      selectedDate: form.value.dateFrom && form.value.dateTo 
        ? `${form.value.dateFrom} to ${form.value.dateTo}` 
        : (form.value.dateFrom || 'Not specified'),
      participants: form.value.guests ? parseInt(form.value.guests) : 1,
      specialRequirements: form.value.message.trim() || 'None',
    }).catch(console.error)

    submitted.value = true
  } catch (e: any) {
    error.value = e.message || 'Failed to send enquiry. Please try again.'
  }

  submitting.value = false
}

onMounted(async () => {
  await heroCms.load()
})
</script>

<template>
  <div>
    <PageHero
      tag="Bookings & Enquiries"
      title="Check"
      title-italic="Availability"
      subtitle="Reach out to our team to discuss dates, pricing, and all the details for your perfect expedition."
      image=""
      image-alt="Luxury vessel on calm turquoise waters"
      height="55vh"
    >
      <template #default>
        <template v-if="heroImage">
          <img
            :src="heroImage"
            alt="Luxury vessel on calm turquoise waters"
            class="absolute inset-0 w-full h-full object-cover"
          />
        </template>
        <NoImagePlaceholder v-else class="absolute inset-0" />
      </template>
    </PageHero>

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

            <!-- Trip Summary Card (shows when expedition selected) -->
            <div
              v-if="selectedTripDetails"
              class="p-6 border border-[#C9A84C]/20 mb-8"
              style="background: rgba(10, 46, 74, 0.4);"
            >
              <p class="overline-text mb-3">Selected Expedition</p>
              <h3 class="font-display text-lg font-light mb-3" style="font-family: var(--font-display); color: var(--color-sand-100);">
                {{ selectedTripDetails.name }}
              </h3>
              <div class="grid grid-cols-2 gap-3 text-sm" style="color: var(--color-sand-200);">
                <div>
                  <span class="overline-text block" style="font-size: 0.55rem;">Duration</span>
                  {{ selectedTripDetails.duration }}
                </div>
                <div>
                  <span class="overline-text block" style="font-size: 0.55rem;">Max Guests</span>
                  {{ selectedTripDetails.guests }}
                </div>
                <div class="col-span-2">
                  <span class="overline-text block" style="font-size: 0.55rem;">Price</span>
                  <span style="color: var(--color-gold-400); font-weight: 600;">
                    {{ selectedTripDetails.priceCurrency }} ${{ selectedTripDetails.price.toLocaleString() }} per person
                  </span>
                </div>
              </div>
            </div>

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
                <div v-if="error" class="error-message">{{ error }}</div>
                
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
                    <input 
                      v-model="form.guests" 
                      type="number" 
                      min="1" 
                      :max="selectedTripDetails?.guests || 14" 
                      class="form-input" 
                      placeholder="e.g. 2" 
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Expedition Interest *</label>
                  <select v-model="form.expedition" required class="form-input">
                    <option value="" disabled>Select an expedition</option>
                    <option v-for="exp in expeditionOptions" :key="exp.value" :value="exp.value">{{ exp.label }}</option>
                  </select>
                </div>

                <!-- Date Range (replaces single text input) -->
                <div class="form-group">
                  <label class="form-label">Preferred Dates</label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input 
                        v-model="form.dateFrom" 
                        type="date" 
                        class="form-input" 
                        :min="new Date().toISOString().split('T')[0]"
                      />
                      <span class="text-xs opacity-50 mt-1 block" style="color: var(--color-sand-200);">From</span>
                    </div>
                    <div>
                      <input 
                        v-model="form.dateTo" 
                        type="date" 
                        class="form-input" 
                        :min="form.dateFrom || new Date().toISOString().split('T')[0]"
                      />
                      <span class="text-xs opacity-50 mt-1 block" style="color: var(--color-sand-200);">To</span>
                    </div>
                  </div>
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

/* Date input dark theme styling */
input[type="date"].form-input {
  color-scheme: dark;
}

input[type="date"].form-input::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(0.8) sepia(1) hue-rotate(180deg) saturate(3);
  cursor: pointer;
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

.error-message {
  background: rgba(224, 123, 90, 0.1);
  border: 1px solid rgba(224, 123, 90, 0.3);
  color: #e07b5a;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
}
</style>