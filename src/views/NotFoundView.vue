<template>
  <v-main>
    <!-- Hero Section -->
    <section class="hero-section">
      <!-- Background Image & Overlay -->
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>

      <v-container class="hero-content fill-height">
        <v-row justify="center">
          <v-col cols="12" md="8" class="text-center">
            <span class="overline-text">Error 404</span>

            <!-- Large 404 Text -->
            <h1 class="error-code">404</h1>

            <h2 class="hero-title mb-4">
              Lost at <span style="color: var(--color-gold-400); font-style: italic;">Sea?</span>
            </h2>

            <p class="hero-subtitle mb-8">
              The page you are looking for seems to have drifted off the coordinates. The ocean is vast, but we can help you find your way back.
            </p>

            <!-- Vuetify Buttons with Custom Classes -->
            <div class="d-flex flex-column flex-sm-row justify-center ga-4">
              <v-btn
                to="/"
                class="btn-luxury-primary"
                size="large"
                rounded="0"
              >
                Return Home
              </v-btn>
              <v-btn
                to="/expeditions"
                class="btn-luxury-outline"
                size="large"
                variant="outlined"
                rounded="0"
              >
                View Expeditions
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <!-- Helpful Links Section -->
    <section class="helpful-links">
      <v-container>
        <div class="text-center mb-8">
          <span class="overline-text">Where to now?</span>
          <div class="gold-divider"></div>
        </div>

        <v-row>
          <v-col
            v-for="(link, i) in links"
            :key="i"
            cols="12"
            sm="4"
          >
            <!-- Vuetify Card with 'flat' prop and custom styling -->
            <v-card
              class="link-card fill-height"
              elevation="0"
              :ripple="false"
              :href="link.to"
            >
              <v-card-text class="text-center pa-6">
                <div class="link-icon">{{ link.icon }}</div>
                <h3 class="text-h5 font-display mb-2">{{ link.title }}</h3>
                <p class="text-body-2 text-grey-lighten-1 mb-4">{{ link.desc }}</p>
                <span class="text-link">{{ link.cta }}</span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </v-main>
</template>

<script setup>
import { ref } from 'vue'

// Links data for the cards
const links = ref([
  {
    title: 'Sylvia Expedition',
    desc: 'Our premium 4-day live-aboard experience exploring the Northern Reef.',
    icon: 'Sylvia',
    to: '/expeditions/sylvia',
    cta: 'View Sylvia'
  },
  {
    title: 'Millenium Expedition',
    desc: 'The ultimate 7-day adventure covering the full length of the reef.',
    icon: 'Millenium',
    to: '/expeditions/millenium',
    cta: 'View Millenium'
  },
  {
    title: 'Plan Your Trip',
    desc: 'Speak with our reservation team to customize your journey.',
    icon: 'Contact',
    to: '/contact',
    cta: 'Contact Us'
  }
])
</script>

<style scoped>
/* --- CSS VARIABLES --- */
:root {
  --color-ocean-950: #071a2b;
  --color-gold-400: #c9a84c;
  --color-gold-500: #b0923d;
  --color-sand-100: #f8f5ef;
  --color-sand-200: #e6e1d7;

  --font-display: 'Playfair Display', serif;
  --font-heading: 'Montserrat', sans-serif;
}

/* --- HERO STYLING --- */
.hero-section {
  position: relative;
  min-height: 90vh; /* Takes up most of the screen */
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: var(--color-ocean-950);
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://picsum.photos/seed/ocean404/1920/1080');
  background-size: cover;
  background-position: center;
  opacity: 0.4;
  z-index: 1;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(7, 26, 43, 0.7), var(--color-ocean-950));
  z-index: 2;
}

.hero-content {
  position: relative;
  z-index: 3;
}

.error-code {
  font-family: var(--font-display);
  font-size: 8rem; /* Large responsive font */
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(201, 168, 76, 0.3);
  margin-bottom: -2rem;
}

/* --- TYPOGRAPHY --- */
.font-display {
  font-family: var(--font-display) !important;
}

.hero-title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  color: var(--color-sand-100);
  font-weight: 400;
}

.hero-subtitle {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  color: var(--color-sand-200);
  font-weight: 300;
  max-width: 500px;
  margin: 0 auto;
}

.overline-text {
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-size: 0.75rem;
  color: var(--color-gold-400);
}

.gold-divider {
  width: 60px;
  height: 2px;
  background-color: var(--color-gold-400);
  margin: 1rem auto;
}

/* --- VUETIFY OVERRIDES (Buttons) --- */
/* Force Vuetify buttons to look like your custom design */
.btn-luxury-primary {
  background-color: var(--color-gold-400) !important;
  color: var(--color-ocean-950) !important;
  border: 1px solid var(--color-gold-400) !important;
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 500;
}

.btn-luxury-primary:hover {
  background-color: var(--color-gold-500) !important;
}

.btn-luxury-outline {
  color: var(--color-gold-400) !important;
  border: 1px solid var(--color-gold-400) !important;
  font-family: var(--font-heading);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.btn-luxury-outline:hover {
  background-color: rgba(201, 168, 76, 0.1) !important;
}

/* --- HELPFUL LINKS --- */
.helpful-links {
  background-color: var(--color-ocean-950);
  padding: 4rem 0;
  position: relative;
  z-index: 3;
}

.link-card {
  background-color: rgba(255, 255, 255, 0.01) !important;
  border: 1px solid rgba(201, 168, 76, 0.15) !important;
  transition: all 0.3s ease;
}

.link-card:hover {
  border-color: var(--color-gold-400) !important;
  background-color: rgba(201, 168, 76, 0.05) !important;
}

.link-icon {
  font-size: 2rem;
  color: var(--color-gold-400);
  margin-bottom: 1rem;
  font-family: var(--font-display);
  font-style: italic;
}

.text-link {
  color: var(--color-gold-400);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  border-bottom: 1px solid transparent;
}

.text-link:hover {
  border-bottom-color: var(--color-gold-400);
}

/* Mobile Tweaks */
@media (max-width: 600px) {
  .error-code { font-size: 5rem; }
  .hero-title { font-size: 2rem; }
}
</style>
