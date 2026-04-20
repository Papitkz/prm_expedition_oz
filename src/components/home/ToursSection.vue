<template>
  <section class="py-24 lg:py-32" style="background: var(--color-ocean-900);">
    <div class="container mx-auto px-6 lg:px-12">
      
      <!-- ADD: Section anchor for navigation -->
      <a id="compare-tours" class="sr-only" aria-hidden="true"></a>

      <div class="text-center mb-16 section-reveal">
        <p class="overline-text mb-4">Choose Your Expedition</p>
        <div class="gold-divider mb-6"></div>
        <h2 class="font-display text-5xl lg:text-6xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
          Two Vessels, <span class="italic" style="color: var(--color-gold-400);">One Ocean</span>
        </h2>
        <!-- TWEAK: Add comparison helper text -->
        <p class="mt-6 max-w-2xl mx-auto text-base opacity-75" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.8;">
          Whether you have four days or seven, Expedition OZ has the perfect live-aboard experience for you.
          <span class="block mt-2 text-sm" style="color: var(--color-gold-400); opacity: 0.6;">
            Both include whale shark season access · All meals · Dive equipment
          </span>
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div 
          v-for="(tour, i) in tours" 
          :key="tour.name" 
          class="tour-card group" 
          :class="[i === 0 ? 'section-reveal-left' : 'section-reveal-right', tour.featured ? 'tour-featured' : '']"
        >
          <div class="tour-image-wrap">
            <img :src="tour.image" :alt="tour.alt" class="tour-image" loading="lazy" />
            <div class="tour-overlay">
              <span class="duration-badge" :class="tour.featured ? 'badge-featured' : ''">
                {{ tour.duration }}
              </span>
              <!-- ADD: Featured tag -->
              <span v-if="tour.featured" class="featured-tag">Most Popular</span>
            </div>
          </div>
          <div class="tour-content">
            <p class="overline-text mb-3" style="font-size: 0.6rem;">{{ tour.vessel }}</p>
            <h3 class="font-display text-4xl font-light mb-3" style="font-family: var(--font-display); color: var(--color-sand-100);">
              {{ tour.name }}
            </h3>
            <div class="gold-divider-left mb-4"></div>
            <p class="text-sm leading-relaxed mb-6 opacity-75" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.8;">
              {{ tour.description }}
            </p>
            <ul class="space-y-2 mb-8">
              <li v-for="feature in tour.features" :key="feature" class="flex items-center gap-3 text-sm opacity-80" style="font-family: var(--font-body); color: var(--color-sand-200);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" stroke="var(--color-gold-400)" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ feature }}
              </li>
            </ul>
            <router-link 
              :to="tour.link" 
              class="btn-primary"
              :class="tour.featured ? 'btn-featured' : ''"
            >
              View Expedition
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="inline-block ml-2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const tours = [
  {
    name: 'Sylvia',
    vessel: 'Live-Aboard Vessel',
    duration: '4 Day Expedition',
    link: '/expeditions/sylvia',
    image: 'https://r4.wallpaperflare.com/wallpaper/750/616/903/coral-reef-fish-reef-fish-aquarium-wallpaper-09e0f8ad012a8d9b26d7a85fd091264d.jpg',
    alt: 'Luxury liveaboard vessel Sylvia on Ningaloo Reef - 4 day diving expedition',
    featured: false,
    description: 'An intimate four-day voyage aboard Sylvia, exploring the northern reaches of Ningaloo Reef. Perfect for first-time live-aboard guests seeking a curated taste of adventure.',
    features: [
      'Whale shark snorkeling',
      'Guided reef dives',
      'Gourmet meals all-inclusive',
      'Sunset cocktails on deck',
      'Exmouth departure',
    ]
  },
  {
    name: 'Millenium',
    vessel: 'Premium Live-Aboard',
    duration: '7 Day Expedition',
    link: '/expeditions/millenium',
    image: 'https://r4.wallpaperflare.com/wallpaper/639/878/552/microsoft-surface-hub-great-barrier-reef-4k-wallpaper-78262d48f010bc78d0acd10e38b214ba.jpg',
    alt: 'Premium 7-day liveaboard Millenium at anchor in turquoise Ningaloo waters',
    featured: true,  // ADD THIS
    description: 'The ultimate seven-day immersion aboard Millenium. A comprehensive journey along the full length of the reef — encountering manta rays, dugongs, turtles, and humpback whales.',
    features: [
      'Full reef exploration',
      'Manta ray encounters',
      'Night snorkeling',
      'Premium cabin suites',
      'Marine naturalist guide',
    ]
  }
]

let observer: IntersectionObserver | null = null

onMounted(() => {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer?.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })

  const revealElements = document.querySelectorAll('.section-reveal, .section-reveal-left, .section-reveal-right')
  revealElements.forEach((el) => observer?.observe(el))
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<style scoped>
/* Existing animations */
.section-reveal,
.section-reveal-left,
.section-reveal-right {
  opacity: 0;
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.section-reveal {
  transform: translateY(30px);
}

.section-reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.section-reveal-left {
  transform: translateX(-50px);
}

.section-reveal-left.is-visible {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.1s;
}

.section-reveal-right {
  transform: translateX(50px);
}

.section-reveal-right.is-visible {
  opacity: 1;
  transform: translateX(0);
  transition-delay: 0.2s;
}

/* Tour Card */
.tour-card {
  background: rgba(7, 26, 43, 0.6);
  border: 1px solid rgba(201, 168, 76, 0.12);
  overflow: hidden;
  transition: border-color 0.4s ease, transform 0.4s ease, box-shadow 0.4s ease;
}

.tour-card:hover {
  border-color: rgba(201, 168, 76, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* NEW: Featured card gets special treatment */
.tour-featured {
  border-color: rgba(201, 168, 76, 0.25);
  position: relative;
}

.tour-featured::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.3), transparent 50%);
  z-index: 0;
  pointer-events: none;
}

.tour-featured > * {
  position: relative;
  z-index: 1;
}

.tour-image-wrap {
  position: relative;
  overflow: hidden;
  height: 320px;
}

.tour-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.tour-card:hover .tour-image {
  transform: scale(1.04);
}

.tour-overlay {
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Badge styles */
.duration-badge {
  font-family: var(--font-heading);
  letter-spacing: 0.2em;
  font-size: 0.62rem;
  background: var(--color-gold-400);
  color: var(--color-ocean-950);
  padding: 0.375rem 1rem;
}

.badge-featured {
  background: var(--color-gold-400);
  color: var(--color-ocean-950);
}

/* NEW: Featured tag */
.featured-tag {
  font-family: var(--font-heading);
  letter-spacing: 0.15em;
  font-size: 0.55rem;
  text-transform: uppercase;
  background: rgba(129, 199, 132, 0.15);
  color: #81c784;
  border: 1px solid rgba(129, 199, 132, 0.3);
  padding: 0.3rem 0.75rem;
  width: fit-content;
}

.tour-content {
  padding: 36px;
}

/* NEW: Featured button */
.btn-featured {
  background: var(--color-gold-400) !important;
  color: var(--color-ocean-950) !important;
  border-color: var(--color-gold-400) !important;
}

.btn-featured:hover {
  background: transparent !important;
  color: var(--color-gold-400) !important;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>