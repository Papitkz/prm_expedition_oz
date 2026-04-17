<template>
  <section class="py-24 lg:py-32" style="background: var(--color-ocean-900);">
    <div class="container mx-auto px-6 lg:px-12">
      <div class="text-center mb-16 section-reveal">
        <p class="overline-text mb-4">Choose Your Expedition</p>
        <div class="gold-divider mb-6"></div>
        <h2 class="font-display text-5xl lg:text-6xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
          Two Vessels, <span class="italic" style="color: var(--color-gold-400);">One Ocean</span>
        </h2>
        <p class="mt-6 max-w-2xl mx-auto text-base opacity-75" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.8;">
          Whether you have four days or seven, Expedition OZ has the perfect live-aboard experience for you.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div v-for="(tour, i) in tours" :key="tour.name" class="tour-card group" :class="i === 0 ? 'section-reveal-left' : 'section-reveal-right'">
          <div class="tour-image-wrap">
            <img :src="tour.image" :alt="tour.alt" class="tour-image" loading="lazy" />
            <div class="tour-overlay">
              <span class="font-heading text-xs font-600 tracking-wider px-4 py-2" style="font-family: var(--font-heading); letter-spacing: 0.2em; font-size: 0.62rem; background: var(--color-gold-400); color: var(--color-ocean-950);">
                {{ tour.duration }}
              </span>
            </div>
          </div>
          <div class="tour-content">
            <p class="overline-text mb-3" style="font-size: 0.6rem;">{{ tour.vessel }}</p>
            <h3 class="font-display text-4xl font-light mb-3" style="font-family: var(--font-display); color: var(--color-sand-100);">{{ tour.name }}</h3>
            <div class="gold-divider-left mb-4"></div>
            <p class="text-sm leading-relaxed mb-6 opacity-75" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.8;">{{ tour.description }}</p>
            <ul class="space-y-2 mb-8">
              <li v-for="feature in tour.features" :key="feature" class="flex items-center gap-3 text-sm opacity-80" style="font-family: var(--font-body); color: var(--color-sand-200);">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" stroke="var(--color-gold-400)" stroke-width="2" stroke-linecap="round"/>
                </svg>
                {{ feature }}
              </li>
            </ul>
            <router-link :to="tour.link" class="btn-primary">
              View Expedition
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const tours = [
  {
    name: 'Sylvia',
    vessel: 'Live-Aboard Vessel',
    duration: '4 Day Expedition',
    link: '/expeditions/sylvia',
    image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Luxury sailing vessel Sylvia on Ningaloo Reef',
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
    image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Premium vessel Millenium at anchor in turquoise waters',
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
</script>

<style scoped>
.tour-card {
  background: rgba(7, 26, 43, 0.6);
  border: 1px solid rgba(201, 168, 76, 0.12);
  overflow: hidden;
  transition: border-color 0.4s ease, transform 0.4s ease;
}

.tour-card:hover {
  border-color: rgba(201, 168, 76, 0.4);
  transform: translateY(-4px);
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
}

.tour-content {
  padding: 36px;
}
</style>
