<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal'
import PageHero from '@/components/PageHero.vue'
import CtaSection from '@/components/home/CtaSection.vue'

useScrollReveal()

const itinerary = [
  { day: 'Day 1', title: 'Embarkation & Welcome Dinner', desc: 'Board Millenium at Exmouth Marina. Settle into your premium suite, meet the crew and fellow expeditioners. Sunset departure as we head to our first anchorage.' },
  { day: 'Day 2', title: 'Whale Shark Encounter', desc: 'Our spotter plane locates whale sharks from above. Multiple swims with the ocean\'s most gentle giants, guided by our marine naturalist.' },
  { day: 'Day 3', title: 'Manta Ray Dive', desc: 'Head to the legendary cleaning stations where manta rays congregate. Drift over dramatic coral formations — an otherworldly experience.' },
  { day: 'Day 4', title: 'Deep Reef & Night Snorkel', desc: 'Explore deeper sections of the reef accessible only to live-aboard guests. After dinner, descend for our magical night snorkel experience.' },
  { day: 'Day 5', title: 'Humpback Whale Watching', desc: 'During season, encounter humpback whales in their natural environment. Watch from the deck or in the water — a truly humbling encounter.' },
  { day: 'Day 6', title: 'Hidden Coves & Reef Walk', desc: 'Anchor at a remote beach accessible only by sea. Guided reef walk at low tide, kayaking in glassy bays, and our finest dinner yet.' },
  { day: 'Day 7', title: 'Final Morning & Farewell', desc: 'One last sunrise snorkel in paradise. A champagne farewell brunch before returning to Exmouth, forever changed.' },
]

const highlights = [
  'Full reef length covered — northern to southern Ningaloo',
  'Whale shark swims with expert marine naturalist',
  'Manta ray encounters at cleaning stations',
  'Night snorkeling experience',
  'Humpback whale watching (seasonal)',
  'Premium cabin suites with en-suite bathrooms',
  'All meals, wine, cocktails and beverages',
  'Kayaks, paddleboards, and water toys',
  'Guided reef walks at low tide',
  'Maximum 14 guests — intimate and exclusive',
  'Spotter aircraft for whale shark location',
  'Reef conservation briefings and marine talks',
]
</script>

<template>
  <div>
    <PageHero
      tag="7 Day Premium Live-Aboard"
      title="Millenium"
      title-italic="The Ultimate Reef Expedition"
      subtitle="Seven transformative days encompassing the full length of Ningaloo Reef. The definitive ocean adventure."
      image="https://r4.wallpaperflare.com/wallpaper/639/878/552/microsoft-surface-hub-great-barrier-reef-4k-wallpaper-78262d48f010bc78d0acd10e38b214ba.jpg"
      image-alt="Premium vessel Millenium at anchor in turquoise Ningaloo waters"
      height="70vh"
    />

    <!-- About Section -->
    <section class="py-16 md:py-24 lg:py-32" style="background: var(--color-ocean-950);">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          <div class="section-reveal-left order-2 lg:order-1">
            <p class="overline-text mb-3 md:mb-4 text-xs md:text-sm">About This Expedition</p>
            <div class="gold-divider-left mb-4 md:mb-6"></div>
            <h2 class="font-display text-3xl md:text-4xl lg:text-5xl font-light mb-4 md:mb-6" style="font-family: var(--font-display); color: var(--color-sand-100);">
              The <span class="italic" style="color: var(--color-gold-400);">Complete</span> Ningaloo Experience
            </h2>
            <p class="text-sm md:text-base leading-relaxed mb-4 md:mb-5 opacity-80" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.9;">
              The Millenium expedition is the flagship Expedition OZ experience. Seven extraordinary days aboard our most premium vessel, covering the entire length of Ningaloo Reef — from the northern whale shark grounds to the southern manta ray cleaning stations.
            </p>
            <p class="text-sm md:text-base leading-relaxed mb-6 md:mb-8 opacity-80" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.9;">
              With premium cabin suites, a dedicated chef, and a maximum of 14 guests, Millenium delivers a truly exclusive experience that no shore-based tour can replicate. This is the expedition that changes people.
            </p>
            
            <!-- Stats Grid -->
            <div class="grid grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8 pt-4 md:pt-6" style="border-top: 1px solid rgba(201, 168, 76, 0.15);">
              <div class="text-center">
                <p class="font-display text-2xl md:text-3xl font-light" style="font-family: var(--font-display); color: var(--color-gold-400);">7</p>
                <p class="overline-text mt-1 text-[0.5rem] md:text-[0.55rem]">Days</p>
              </div>
              <div class="text-center">
                <p class="font-display text-2xl md:text-3xl font-light" style="font-family: var(--font-display); color: var(--color-gold-400);">14</p>
                <p class="overline-text mt-1 text-[0.5rem] md:text-[0.55rem]">Max Guests</p>
              </div>
              <div class="text-center">
                <p class="font-display text-2xl md:text-3xl font-light" style="font-family: var(--font-display); color: var(--color-gold-400);">Full</p>
                <p class="overline-text mt-1 text-[0.5rem] md:text-[0.55rem]">Reef</p>
              </div>
            </div>
            
            <router-link to="/contact" class="btn-primary inline-block text-sm md:text-base px-6 py-3 md:px-8 md:py-4">
              Check Availability
            </router-link>
          </div>

          <div class="section-reveal-right order-1 lg:order-2">
            <div class="grid grid-cols-2 gap-3 md:gap-4 h-[400px] sm:h-[480px] md:h-[520px]">
              <div class="overflow-hidden col-span-2 h-[200px] sm:h-[280px] md:h-[300px]">
                <img
                  src="https://images.pexels.com/photos/932638/pexels-photo-932638.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="Manta ray underwater at Ningaloo"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="overflow-hidden h-[96px] sm:h-[100px] md:h-[208px]">
                <img
                  src="https://r4.wallpaperflare.com/wallpaper/526/318/368/australia-great-barrier-reef-natural-ocean-wallpaper-3fc278a23f01eae0d43633c0d7594d47.jpg"
                  alt="Luxury vessel deck at sunset"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="overflow-hidden h-[96px] sm:h-[100px] md:h-[208px]">
                <img
                  src="https://r4.wallpaperflare.com/wallpaper/33/537/118/sea-water-clouds-the-ocean-turtle-hd-wallpaper-3d38ad3d605b6d493987a33802a61fe9.jpg"
                  alt="Crystal clear ocean water"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Video Section -->
    <section class="py-16 md:py-24" style="background: var(--color-ocean-900);">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="text-center mb-8 md:mb-12 section-reveal">
          <p class="overline-text mb-3 md:mb-4 text-xs md:text-sm">Experience Millenium</p>
          <div class="gold-divider mb-4 md:mb-6"></div>
          <h2 class="font-display text-3xl md:text-4xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
            See The <span class="italic" style="color: var(--color-gold-400);">Adventure</span>
          </h2>
        </div>
        
        <div class="max-w-5xl mx-auto section-reveal">
          <div class="video-container relative overflow-hidden rounded-lg" style="aspect-ratio: 16/9;">
            <video
              class="w-full h-full object-cover"
              autoplay
              muted
              loop
              playsinline
              poster="https://r4.wallpaperflare.com/wallpaper/639/878/552/microsoft-surface-hub-great-barrier-reef-4k-wallpaper-78262d48f010bc78d0acd10e38b214ba.jpg"
            >
              <source src="https://cdn.pixabay.com/video/2018/11/16/19368-301525727_large.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div class="absolute inset-0 pointer-events-none" style="background: linear-gradient(to bottom, rgba(10, 46, 74, 0.1), rgba(10, 46, 74, 0.3));"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Itinerary Section -->
    <section class="py-16 md:py-24" style="background: var(--color-ocean-900);">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="text-center mb-10 md:mb-16 section-reveal">
          <p class="overline-text mb-3 md:mb-4 text-xs md:text-sm">Day by Day</p>
          <div class="gold-divider mb-4 md:mb-6"></div>
          <h2 class="font-display text-3xl md:text-4xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
            Seven Days of <span class="italic" style="color: var(--color-gold-400);">Wonder</span>
          </h2>
        </div>
        <div class="max-w-3xl mx-auto">
          <div v-for="(item, i) in itinerary" :key="item.day" class="itinerary-item section-reveal" :style="`transition-delay: ${i * 0.08}s`">
            <div class="itinerary-day">
              <span class="overline-text text-[0.55rem] md:text-[0.6rem]">{{ item.day }}</span>
            </div>
            <div class="itinerary-content">
              <h3 class="font-display text-xl md:text-2xl font-light mb-2" style="font-family: var(--font-display); color: var(--color-sand-100);">{{ item.title }}</h3>
              <p class="text-sm md:text-base leading-relaxed opacity-75" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.8;">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Highlights Section -->
    <section class="py-16 md:py-24" style="background: var(--color-ocean-950);">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="text-center mb-8 md:mb-12 section-reveal">
          <p class="overline-text mb-3 md:mb-4 text-xs md:text-sm">What's Included</p>
          <div class="gold-divider mb-4 md:mb-6"></div>
          <h2 class="font-display text-3xl md:text-4xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
            All-Inclusive <span class="italic" style="color: var(--color-gold-400);">Luxury</span>
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 max-w-4xl mx-auto">
          <div v-for="(item, i) in highlights" :key="item" class="highlight-item section-reveal" :style="`transition-delay: ${i * 0.06}s`">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="flex-shrink-0 mt-0.5">
              <polyline points="20 6 9 17 4 12" stroke="var(--color-gold-400)" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p class="text-sm md:text-base opacity-80" style="font-family: var(--font-body); color: var(--color-sand-200);">{{ item }}</p>
          </div>
        </div>
      </div>
    </section>

    <CtaSection />
  </div>
</template>

<style scoped>
.itinerary-item {
  display: grid;
  grid-template-columns: 70px 1fr;
  gap: 16px;
  padding: 20px 0;
  border-top: 1px solid rgba(201, 168, 76, 0.1);
  align-items: start;
}

@media (min-width: 768px) {
  .itinerary-item {
    grid-template-columns: 100px 1fr;
    gap: 24px;
    padding: 24px 0;
  }
}

.itinerary-item:first-child {
  border-top: none;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgba(201, 168, 76, 0.1);
  background: rgba(10, 46, 74, 0.3);
}

@media (min-width: 768px) {
  .highlight-item {
    padding: 16px;
  }
}

.video-container {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
</style>