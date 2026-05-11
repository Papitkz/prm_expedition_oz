<script setup lang="ts">
import { useSEO } from '@/composables/useSEO'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import BookingForm from '@/components/BookingForm.vue'
import NoImagePlaceholder from '@/components/NoImagePlaceholder.vue'
import { getFirebaseDb, initFirebase } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useEmail } from '@/composables/useEmail'

useScrollReveal()

const route = useRoute()
const { sendBookingEmails } = useEmail()

// Trip configurations
const trips = {
  sylvia: {
    id: 'sylvia',
    name: 'Sylvia – 4-Day Northern Reef Expedition',
    shortName: 'Sylvia',
    duration: '4 Days / 3 Nights',
    guests: 12,
    price: 2495,
    priceCurrency: 'AUD',
    heroImage: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?q=80&w=2400&auto=format&fit=crop',
    description:
      'An intimate 4-day live-aboard expedition exploring the pristine northern reaches of Ningaloo Reef. Perfect for those seeking whale shark encounters, coral garden snorkeling, and luxury at sea.',
    highlights: [
      'Whale shark encounters with certified marine naturalist',
      'Northern Ningaloo Reef — pristine and rarely visited',
      'All snorkel gear including wetsuits and fins',
      'Gourmet meals prepared by our onboard chef',
      'Premium beverages including wine and cocktails',
      'Maximum 12 guests for an intimate experience',
    ],
  },
  millenium: {
    id: 'millenium',
    name: 'Millenium – 7-Day Ultimate Reef Expedition',
    shortName: 'Millenium',
    duration: '7 Days / 6 Nights',
    guests: 14,
    price: 3995,
    priceCurrency: 'AUD',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2400&auto=format&fit=crop',
    description:
      'Our flagship week-long expedition aboard the M.Y. Millenium. Seven days of comprehensive Ningaloo exploration — from whale sharks and manta rays to coral gardens and stargazing on the open ocean.',
    highlights: [
      'Whale shark encounters with certified marine naturalist',
      'Northern & southern Ningaloo exploration',
      'Snorkel with manta rays at Coral Bay',
      'All premium snorkel gear included',
      'Private chef — gourmet dining every meal',
      'Premium wines, craft cocktails, and spirits',
      'Sunset yoga and stargazing on deck',
      'Maximum 14 guests for exclusivity',
    ],
  },
}

const selectedTripId = computed(() => {
  const param = route.params.trip as string
  const query = route.query.trip as string
  return param || query || ''
})

const selectedTrip = computed(() => {
  return trips[selectedTripId.value as keyof typeof trips] || null
})

const showTripSelector = computed(() => !selectedTrip.value)

const tripSelect = ref(selectedTripId.value)

const activeTrip = computed(() => {
  if (selectedTrip.value) return selectedTrip.value
  if (tripSelect.value && trips[tripSelect.value as keyof typeof trips]) {
    return trips[tripSelect.value as keyof typeof trips]
  }
  return null
})

// Booking form state (same as ContactView pattern)
const bookingForm = ref({
  name: '',
  email: '',
  phone: '',
  guests: '',
  dateFrom: '',
  dateTo: '',
  message: '',
})

const bookingSubmitted = ref(false)
const bookingSubmitting = ref(false)
const bookingError = ref('')

const bookingKey = ref(0)

function resetBooking() {
  bookingSubmitted.value = false
  bookingError.value = ''
  bookingForm.value = {
    name: '',
    email: '',
    phone: '',
    guests: '',
    dateFrom: '',
    dateTo: '',
    message: '',
  }
  bookingKey.value++
}

async function handleBookingSubmit() {
  bookingError.value = ''
  
  if (!bookingForm.value.name.trim() || !bookingForm.value.email.trim() || !activeTrip.value) {
    bookingError.value = 'Please fill in all required fields'
    return
  }

  bookingSubmitting.value = true

  try {
    initFirebase()
    const db = getFirebaseDb()

    await addDoc(collection(db, 'bookings'), {
      name: bookingForm.value.name.trim(),
      email: bookingForm.value.email.trim().toLowerCase(),
      phone: bookingForm.value.phone.trim(),
      tripId: activeTrip.value.id,
      tripName: activeTrip.value.name,
      guests: bookingForm.value.guests ? parseInt(bookingForm.value.guests) : 1,
      dateFrom: bookingForm.value.dateFrom,
      dateTo: bookingForm.value.dateTo,
      message: bookingForm.value.message.trim(),
      status: 'new',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    // Send email notification (non-blocking)
    sendBookingEmails({
      fullName: bookingForm.value.name.trim(),
      email: bookingForm.value.email.trim().toLowerCase(),
      phone: bookingForm.value.phone.trim() || 'Not provided',
      tripName: activeTrip.value.name,
      selectedDate: `${bookingForm.value.dateFrom} to ${bookingForm.value.dateTo}`,
      participants: bookingForm.value.guests ? parseInt(bookingForm.value.guests) : 1,
      specialRequirements: bookingForm.value.message.trim() || 'None',
    }).catch(console.error)

    bookingSubmitted.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (e: any) {
    bookingError.value = e.message || 'Failed to submit booking. Please try again.'
  }

  bookingSubmitting.value = false
}

useSEO({
  title: 'Book Your Expedition',
  description: 'Book your luxury live-aboard expedition in Ningaloo Reef. Choose between Sylvia (4-day) or Millenium (7-day) for an unforgettable marine adventure.',
  path: '/book',
  type: 'website',
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative min-h-[50vh] md:min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0 z-0">
        <template v-if="activeTrip?.heroImage">
          <img
            :src="activeTrip.heroImage"
            :alt="activeTrip.name"
            class="w-full h-full object-cover"
          />
        </template>
        <NoImagePlaceholder v-else label="Booking Hero" class="w-full h-full" />
        <div class="absolute inset-0 bg-[#0A2E4A]/75" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      </div>

      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <p class="overline-text mb-3 md:mb-4 text-xs md:text-sm tracking-[0.3em] text-white/90">
          {{ activeTrip ? 'Reserve Your Spot' : 'Book Your Expedition' }}
        </p>
        <h1
          class="font-display text-3xl md:text-5xl lg:text-6xl font-light text-white mb-4 md:mb-6"
          style="font-family: var(--font-display);"
        >
          <template v-if="activeTrip">
            Book <span class="italic" style="color: var(--color-gold-400);">{{ activeTrip.shortName }}</span>
          </template>
          <template v-else>
            Secure Your <span class="italic" style="color: var(--color-gold-400);">Adventure</span>
          </template>
        </h1>
        <p class="text-sm md:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
          {{ activeTrip ? activeTrip.description : 'Choose your vessel and submit your booking request. Our team will confirm availability within 24–48 hours.' }}
        </p>
      </div>
    </section>

    <!-- Booking Content -->
    <section class="py-16 md:py-24 lg:py-32" style="background: var(--color-ocean-950);">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 md:gap-12 lg:gap-16">
          <!-- Left: Trip Info -->
          <div class="lg:col-span-2 section-reveal-left">
            <!-- Trip Selector (if no trip pre-selected) -->
            <div
              v-if="showTripSelector"
              class="mb-8 p-6 border border-[#C9A84C]/20"
              style="background: rgba(10, 46, 74, 0.4);"
            >
              <label class="overline-text block mb-3">Select Your Expedition</label>
              <select v-model="tripSelect" class="form-input w-full">
                <option value="">Choose a vessel...</option>
                <option value="sylvia">Sylvia – 4 Days – AUD $2,495 pp</option>
                <option value="millenium">Millenium – 7 Days – AUD $3,995 pp</option>
              </select>
            </div>

            <!-- Active Trip Card -->
            <div
              v-if="activeTrip"
              class="p-6 md:p-8 border border-[#C9A84C]/20 mb-8"
              style="background: rgba(10, 46, 74, 0.4);"
            >
              <p class="overline-text mb-3">Trip Summary</p>
              <h2 class="font-display text-xl md:text-2xl font-light mb-4" style="font-family: var(--font-display); color: var(--color-sand-100);">
                {{ activeTrip.name }}
              </h2>

              <div class="grid grid-cols-2 gap-4 mb-6 py-4 border-t border-b border-[#C9A84C]/15">
                <div>
                  <p class="overline-text mb-1" style="font-size: 0.55rem;">Duration</p>
                  <p class="text-sm" style="color: var(--color-sand-200);">{{ activeTrip.duration }}</p>
                </div>
                <div>
                  <p class="overline-text mb-1" style="font-size: 0.55rem;">Max Guests</p>
                  <p class="text-sm" style="color: var(--color-sand-200);">{{ activeTrip.guests }}</p>
                </div>
                <div>
                  <p class="overline-text mb-1" style="font-size: 0.55rem;">Price Per Person</p>
                  <p class="text-sm font-semibold" style="color: var(--color-gold-400);">
                    {{ activeTrip.priceCurrency }} ${{ activeTrip.price.toLocaleString() }}
                  </p>
                </div>
                <div>
                  <p class="overline-text mb-1" style="font-size: 0.55rem;">Departure</p>
                  <p class="text-sm" style="color: var(--color-sand-200);">Exmouth, WA</p>
                </div>
              </div>

              <p class="overline-text mb-3">What's Included</p>
              <ul class="space-y-2">
                <li
                  v-for="highlight in activeTrip.highlights"
                  :key="highlight"
                  class="flex items-start gap-2 text-sm"
                  style="color: var(--color-sand-200);"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="flex-shrink-0 mt-0.5">
                    <polyline points="20 6 9 17 4 12" stroke="#C9A84C" stroke-width="2" stroke-linecap="round" />
                  </svg>
                  {{ highlight }}
                </li>
              </ul>
            </div>

            <!-- Help Box -->
            <div
              class="p-6 border border-[#C9A84C]/10"
              style="background: rgba(10, 46, 74, 0.3);"
            >
              <p class="overline-text mb-3">Need Help?</p>
              <p class="text-sm leading-relaxed mb-4 opacity-75" style="color: var(--color-sand-200);">
                Not sure which expedition is right for you? Have questions about accessibility, dietary requirements, or private charters?
              </p>
              <router-link to="/contact" class="btn-outline inline-block text-center w-full text-sm py-3">
                Contact Our Team
              </router-link>
            </div>
          </div>

          <!-- Right: Booking Form -->
          <div class="lg:col-span-3 section-reveal-right">
            <div v-if="bookingSubmitted" class="success-panel text-center py-16">
              <div class="success-icon mx-auto mb-6">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4caf50" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h3 class="font-display text-2xl md:text-3xl font-light mb-4" style="font-family: var(--font-display); color: var(--color-sand-100);">
                Booking Request <span class="italic" style="color: var(--color-gold-400);">Submitted</span>
              </h3>
              <p class="text-sm md:text-base opacity-75 max-w-lg mx-auto leading-relaxed mb-8" style="color: var(--color-sand-200);">
                Thank you! We have received your booking request and will contact you within 24–48 hours to confirm availability and discuss next steps. No payment is required at this stage.
              </p>
              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <router-link to="/" class="btn-primary px-6 py-3 text-sm">Return Home</router-link>
                <button @click="resetBooking" class="btn-outline px-6 py-3 text-sm">Make Another Booking</button>
              </div>
            </div>

            <div v-else-if="!activeTrip" class="text-center py-16">
              <p class="font-display text-xl mb-4" style="font-family: var(--font-display); color: var(--color-sand-100);">
                Select an Expedition
              </p>
              <p class="text-sm opacity-75 mb-6" style="color: var(--color-sand-200);">
                Please choose a vessel from the dropdown on the left to begin your booking.
              </p>
            </div>

            <!-- Inline Booking Form (same pattern as ContactView) -->
            <div v-else class="contact-form-wrap" :key="bookingKey">
              <form @submit.prevent="handleBookingSubmit" class="space-y-6">
                <div v-if="bookingError" class="error-message">{{ bookingError }}</div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="form-group">
                    <label class="form-label">Full Name *</label>
                    <input v-model="bookingForm.name" type="text" required class="form-input" placeholder="Your full name" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email Address *</label>
                    <input v-model="bookingForm.email" type="email" required class="form-input" placeholder="your@email.com" />
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div class="form-group">
                    <label class="form-label">Phone Number</label>
                    <input v-model="bookingForm.phone" type="tel" class="form-input" placeholder="+61 4XX XXX XXX" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Number of Guests</label>
                    <input v-model="bookingForm.guests" type="number" min="1" :max="activeTrip.guests" class="form-input" placeholder="e.g. 2" />
                  </div>
                </div>

                <!-- Date Range -->
                <div class="form-group">
                  <label class="form-label">Preferred Dates *</label>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <input 
                        v-model="bookingForm.dateFrom" 
                        type="date" 
                        required 
                        class="form-input" 
                        :min="new Date().toISOString().split('T')[0]"
                      />
                      <span class="text-xs opacity-50 mt-1 block" style="color: var(--color-sand-200);">From</span>
                    </div>
                    <div>
                      <input 
                        v-model="bookingForm.dateTo" 
                        type="date" 
                        required 
                        class="form-input" 
                        :min="bookingForm.dateFrom || new Date().toISOString().split('T')[0]"
                      />
                      <span class="text-xs opacity-50 mt-1 block" style="color: var(--color-sand-200);">To</span>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Message</label>
                  <textarea v-model="bookingForm.message" rows="4" class="form-input" placeholder="Tell us about any special requirements, questions, or what you're hoping to experience..."></textarea>
                </div>

                <button type="submit" class="btn-primary w-full" :disabled="bookingSubmitting" style="padding: 16px; font-size: 0.7rem; width: 100%; text-align: center;">
                  <span v-if="bookingSubmitting">Sending Booking Request...</span>
                  <span v-else>Submit Booking Request</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
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

.form-input:focus {
  border-color: var(--color-gold-400);
}

/* Date input styling for dark theme */
input[type="date"].form-input {
  color-scheme: dark;
}

input[type="date"].form-input::-webkit-calendar-picker-indicator {
  filter: invert(1) brightness(0.8) sepia(1) hue-rotate(180deg) saturate(3);
  cursor: pointer;
}

.success-panel {
  background: rgba(10, 46, 74, 0.4);
  border: 1px solid rgba(76, 175, 80, 0.2);
}

.success-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 1px solid rgba(76, 175, 80, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
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

.form-input::placeholder {
  color: rgba(248, 245, 239, 0.3);
}

.error-message {
  background: rgba(224, 123, 90, 0.1);
  border: 1px solid rgba(224, 123, 90, 0.3);
  color: #e07b5a;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
}
</style>