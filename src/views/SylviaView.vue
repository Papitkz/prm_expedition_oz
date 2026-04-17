<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal'
import PageHero from '@/components/PageHero.vue'
import CtaSection from '@/components/home/CtaSection.vue'

useScrollReveal()

const itinerary = [
  { day: 'Day 1', title: 'Departure & First Dive', desc: 'Board Sylvia at Exmouth Marina. Brief safety orientation, then set sail for our first anchorage on the northern reef. Afternoon snorkel and sunset dinner on deck.' },
  { day: 'Day 2', title: 'Whale Shark Encounter', desc: 'The highlight of the expedition. Our spotter plane locates whale sharks and we enter the water for multiple swims. You will be changed forever.' },
  { day: 'Day 3', title: 'Coral Gardens & Mural Wall', desc: 'A full day exploring the reef\'s most spectacular coral formations. Shallow dives and snorkeling. Look out for sea turtles, reef sharks, and rays.' },
  { day: 'Day 4', title: 'Final Morning & Return', desc: 'One last sunrise swim before heading back to Exmouth. Farewell brunch and a lifetime of memories.' },
]

const highlights = [
  'Whale shark encounters with certified marine naturalist',
  'Northern Ningaloo Reef — pristine and rarely visited',
  'All snorkel gear including wetsuits and fins',
  'Gourmet meals prepared by our onboard chef',
  'Premium beverages including wine and cocktails',
  'Sunset yoga on deck (optional)',
  'Maximum 12 guests for an intimate experience',
  'Exmouth departure — gateway to Ningaloo',
]
</script>

<template>
  <div>
    <PageHero
      tag="4 Day Live-Aboard"
      title="Sylvia"
      title-italic="Northern Reef Expedition"
      subtitle="Four extraordinary days exploring the untouched northern reaches of Ningaloo Reef aboard our elegant vessel."
      image="https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=1920"
      image-alt="Sailing vessel Sylvia on turquoise Ningaloo waters"
      height="70vh"
    />

    <section class="py-24 lg:py-32" style="background: var(--color-ocean-950);">
      <div class="container mx-auto px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div class="section-reveal-left">
            <p class="overline-text mb-4">About This Expedition</p>
            <div class="gold-divider-left mb-6"></div>
            <h2 class="font-display text-4xl lg:text-5xl font-light mb-6" style="font-family: var(--font-display); color: var(--color-sand-100);">
              A Perfect Introduction to <span class="italic" style="color: var(--color-gold-400);">Live-Aboard</span>
            </h2>
            <p class="text-base leading-relaxed mb-5 opacity-80" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.9;">
              The Sylvia expedition is designed for those who want the complete Ningaloo live-aboard experience without committing to a week at sea. Four carefully curated days, maximum 12 guests, and all the luxury you deserve.
            </p>
            <p class="text-base leading-relaxed mb-8 opacity-80" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.9;">
              The northern reef is among the most pristine sections of Ningaloo — vast, biodiverse, and relatively untouched. This is where you will encounter whale sharks, glide over coral gardens, and fall utterly in love with the ocean.
            </p>
            <div class="grid grid-cols-3 gap-6 mb-8 pt-6" style="border-top: 1px solid rgba(201, 168, 76, 0.15);">
              <div class="text-center">
                <p class="font-display text-3xl font-light" style="font-family: var(--font-display); color: var(--color-gold-400);">4</p>
                <p class="overline-text mt-1" style="font-size: 0.55rem;">Days</p>
              </div>
              <div class="text-center">
                <p class="font-display text-3xl font-light" style="font-family: var(--font-display); color: var(--color-gold-400);">12</p>
                <p class="overline-text mt-1" style="font-size: 0.55rem;">Max Guests</p>
              </div>
              <div class="text-center">
                <p class="font-display text-3xl font-light" style="font-family: var(--font-display); color: var(--color-gold-400);">All</p>
                <p class="overline-text mt-1" style="font-size: 0.55rem;">Inclusive</p>
              </div>
            </div>
            <router-link to="/contact" class="btn-primary">Check Availability</router-link>
          </div>

          <div class="section-reveal-right">
            <div class="overflow-hidden" style="height: 520px;">
              <img
                src="https://images.pexels.com/photos/3046629/pexels-photo-3046629.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Whale shark encounter Ningaloo Reef"
                class="w-full h-full object-cover"
                style="transition: transform 0.6s ease;"
                onmouseenter="this.style.transform='scale(1.03)'"
                onmouseleave="this.style.transform='scale(1)'"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24" style="background: var(--color-ocean-900);">
      <div class="container mx-auto px-6 lg:px-12">
        <div class="text-center mb-16 section-reveal">
          <p class="overline-text mb-4">Day by Day</p>
          <div class="gold-divider mb-6"></div>
          <h2 class="font-display text-4xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
            Your <span class="italic" style="color: var(--color-gold-400);">Itinerary</span>
          </h2>
        </div>
        <div class="max-w-3xl mx-auto">
          <div v-for="(item, i) in itinerary" :key="item.day" class="itinerary-item section-reveal" :style="`transition-delay: ${i * 0.1}s`">
            <div class="itinerary-day">
              <span class="overline-text" style="font-size: 0.6rem;">{{ item.day }}</span>
            </div>
            <div class="itinerary-content">
              <h3 class="font-display text-2xl font-light mb-2" style="font-family: var(--font-display); color: var(--color-sand-100);">{{ item.title }}</h3>
              <p class="text-sm leading-relaxed opacity-75" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.8;">{{ item.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-24" style="background: var(--color-ocean-950);">
      <div class="container mx-auto px-6 lg:px-12">
        <div class="text-center mb-12 section-reveal">
          <p class="overline-text mb-4">What's Included</p>
          <div class="gold-divider mb-6"></div>
          <h2 class="font-display text-4xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
            Everything You <span class="italic" style="color: var(--color-gold-400);">Need</span>
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
          <div v-for="(item, i) in highlights" :key="item" class="highlight-item section-reveal" :style="`transition-delay: ${i * 0.07}s`">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" class="flex-shrink-0 mt-0.5">
              <polyline points="20 6 9 17 4 12" stroke="var(--color-gold-400)" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p class="text-sm opacity-80" style="font-family: var(--font-body); color: var(--color-sand-200);">{{ item }}</p>
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
  grid-template-columns: 100px 1fr;
  gap: 24px;
  padding: 24px 0;
  border-top: 1px solid rgba(201, 168, 76, 0.1);
  align-items: start;
}

.itinerary-item:first-child {
  border-top: none;
}

.itinerary-day {
  padding-top: 4px;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  border: 1px solid rgba(201, 168, 76, 0.1);
  background: rgba(10, 46, 74, 0.3);
}
</style>
