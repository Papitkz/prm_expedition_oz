<script setup lang="ts">
import { useScrollReveal } from '@/composables/useScrollReveal'
import PageHero from '@/components/PageHero.vue'
import CtaSection from '@/components/home/CtaSection.vue'

useScrollReveal()

const compareRows = [
  { label: 'Duration', sylvia: '4 Days / 3 Nights', millenium: '7 Days / 6 Nights' },
  { label: 'Whale Shark Snorkeling', sylvia: true, millenium: true },
  { label: 'Reef Snorkeling', sylvia: true, millenium: true },
  { label: 'All Meals & Beverages', sylvia: true, millenium: true },
  { label: 'Marine Naturalist Guide', sylvia: true, millenium: true },
  { label: 'Kayaks & Paddleboards', sylvia: true, millenium: true },
  { label: 'Manta Ray Encounters', sylvia: false, millenium: true },
  { label: 'Night Snorkeling', sylvia: false, millenium: true },
  { label: 'Humpback Whale Watching', sylvia: false, millenium: true },
  { label: 'Premium Cabin Suites', sylvia: false, millenium: true },
  { label: 'Reef Length Covered', sylvia: 'Northern', millenium: 'Full Reef' },
]
</script>

<template>
  <div>
    <PageHero
      tag="Our Vessels"
      title="Choose Your"
      title-italic="Expedition"
      subtitle="Two remarkable live-aboard vessels. One extraordinary reef. Your adventure of a lifetime."
      image="https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1920"
      image-alt="Luxury vessels on Ningaloo Reef"
    />

    <section class="py-16 md:py-24 lg:py-32" style="background: var(--color-ocean-950);">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="text-center mb-10 md:mb-16 section-reveal">
          <p class="overline-text mb-3 md:mb-4 text-xs md:text-sm">Ningaloo Reef, Western Australia</p>
          <div class="gold-divider mb-4 md:mb-6"></div>
          <h2 class="font-display text-3xl md:text-4xl lg:text-5xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
            Which expedition is <span class="italic" style="color: var(--color-gold-400);">right for you?</span>
          </h2>
          <p class="mt-4 md:mt-6 max-w-2xl mx-auto text-sm md:text-base opacity-75" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.8;">
            Both expeditions offer world-class marine encounters, all-inclusive luxury, and expert-guided experiences. The choice comes down to how deep you want to go.
          </p>
        </div>

        <!-- Desktop Table -->
        <div class="hidden md:block comparison-grid section-reveal">
          <div class="comparison-header">
            <div></div>
            <div class="text-center py-6 px-4" style="background: rgba(201, 168, 76, 0.08); border-bottom: 2px solid var(--color-gold-400);">
              <p class="overline-text mb-1" style="font-size: 0.55rem;">Live-Aboard</p>
              <p class="font-display text-3xl font-light" style="font-family: var(--font-display); color: var(--color-gold-400);">Sylvia</p>
              <p class="font-heading text-xs mt-1 opacity-60" style="font-family: var(--font-heading); font-size: 0.6rem; letter-spacing: 0.15em;">4 DAY EXPEDITION</p>
            </div>
            <div class="text-center py-6 px-4" style="background: rgba(13, 110, 122, 0.08); border-bottom: 2px solid var(--color-ocean-500);">
              <p class="overline-text mb-1" style="font-size: 0.55rem; color: var(--color-ocean-500) !important;">Premium Live-Aboard</p>
              <p class="font-display text-3xl font-light" style="font-family: var(--font-display); color: #4ea8c9;">Millenium</p>
              <p class="font-heading text-xs mt-1 opacity-60" style="font-family: var(--font-heading); font-size: 0.6rem; letter-spacing: 0.15em;">7 DAY EXPEDITION</p>
            </div>
          </div>

          <div v-for="row in compareRows" :key="row.label" class="comparison-row">
            <div class="compare-label">
              <p class="font-heading text-xs font-500" style="font-family: var(--font-heading); color: rgba(248,245,239,0.7); font-size: 0.72rem; letter-spacing: 0.05em;">{{ row.label }}</p>
            </div>
            <div class="compare-cell">
              <span v-if="row.sylvia === true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="var(--color-gold-400)" stroke-width="2.5" stroke-linecap="round"/></svg></span>
              <span v-else-if="row.sylvia === false" class="opacity-30"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="white" stroke-width="2"/><line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2"/></svg></span>
              <span v-else class="text-sm" style="font-family: var(--font-body); color: var(--color-sand-200);">{{ row.sylvia }}</span>
            </div>
            <div class="compare-cell">
              <span v-if="row.millenium === true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#4ea8c9" stroke-width="2.5" stroke-linecap="round"/></svg></span>
              <span v-else-if="row.millenium === false" class="opacity-30"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="white" stroke-width="2"/><line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2"/></svg></span>
              <span v-else class="text-sm" style="font-family: var(--font-body); color: var(--color-sand-200);">{{ row.millenium }}</span>
            </div>
          </div>

          <div class="comparison-footer">
            <div></div>
            <div class="text-center py-6">
              <router-link to="/expeditions/sylvia" class="btn-primary" style="padding: 12px 28px; font-size: 0.62rem;">View Sylvia</router-link>
            </div>
            <div class="text-center py-6">
              <router-link to="/expeditions/millenium" class="btn-outline" style="padding: 12px 28px; font-size: 0.62rem;">View Millenium</router-link>
            </div>
          </div>
        </div>

        <!-- Mobile Cards -->
        <div class="md:hidden space-y-4 section-reveal">
          <!-- Sylvia Card -->
          <div class="mobile-vessel-card" style="background: rgba(201, 168, 76, 0.08); border: 1px solid rgba(201, 168, 76, 0.2);">
            <div class="text-center py-4 px-4 border-b border-[rgba(201,168,76,0.2)]">
              <p class="overline-text mb-1 text-[0.6rem]">Live-Aboard</p>
              <p class="font-display text-2xl font-light" style="font-family: var(--font-display); color: var(--color-gold-400);">Sylvia</p>
              <p class="font-heading text-xs mt-1 opacity-60" style="font-family: var(--font-heading); font-size: 0.65rem; letter-spacing: 0.15em;">4 DAY EXPEDITION</p>
            </div>
            <div class="p-4 space-y-3">
              <div v-for="row in compareRows" :key="'sylvia-'+row.label" class="mobile-feature-row">
                <p class="text-xs opacity-70" style="font-family: var(--font-heading); color: var(--color-sand-200);">{{ row.label }}</p>
                <div class="flex items-center gap-2">
                  <span v-if="row.sylvia === true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="var(--color-gold-400)" stroke-width="2.5" stroke-linecap="round"/></svg></span>
                  <span v-else-if="row.sylvia === false" class="opacity-30"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="white" stroke-width="2"/><line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2"/></svg></span>
                  <span v-else class="text-sm font-medium" style="font-family: var(--font-body); color: var(--color-sand-100);">{{ row.sylvia }}</span>
                </div>
              </div>
            </div>
            <div class="p-4 pt-0">
              <router-link to="/expeditions/sylvia" class="btn-primary w-full text-center block" style="padding: 12px; font-size: 0.75rem;">View Sylvia</router-link>
            </div>
          </div>

          <!-- Millenium Card -->
          <div class="mobile-vessel-card" style="background: rgba(13, 110, 122, 0.08); border: 1px solid rgba(78, 168, 201, 0.3);">
            <div class="text-center py-4 px-4 border-b border-[rgba(78,168,201,0.3)]">
              <p class="overline-text mb-1 text-[0.6rem]" style="color: #4ea8c9 !important;">Premium Live-Aboard</p>
              <p class="font-display text-2xl font-light" style="font-family: var(--font-display); color: #4ea8c9;">Millenium</p>
              <p class="font-heading text-xs mt-1 opacity-60" style="font-family: var(--font-heading); font-size: 0.65rem; letter-spacing: 0.15em;">7 DAY EXPEDITION</p>
            </div>
            <div class="p-4 space-y-3">
              <div v-for="row in compareRows" :key="'millenium-'+row.label" class="mobile-feature-row">
                <p class="text-xs opacity-70" style="font-family: var(--font-heading); color: var(--color-sand-200);">{{ row.label }}</p>
                <div class="flex items-center gap-2">
                  <span v-if="row.millenium === true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#4ea8c9" stroke-width="2.5" stroke-linecap="round"/></svg></span>
                  <span v-else-if="row.millenium === false" class="opacity-30"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="white" stroke-width="2"/><line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2"/></svg></span>
                  <span v-else class="text-sm font-medium" style="font-family: var(--font-body); color: var(--color-sand-100);">{{ row.millenium }}</span>
                </div>
              </div>
            </div>
            <div class="p-4 pt-0">
              <router-link to="/expeditions/millenium" class="btn-outline w-full text-center block" style="padding: 12px; font-size: 0.75rem; border-color: #4ea8c9; color: #4ea8c9;">View Millenium</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CtaSection />
  </div>
</template>

<style scoped>
/* Desktop Table Styles */
.comparison-grid {
  border: 1px solid rgba(201, 168, 76, 0.15);
  overflow: hidden;
}

.comparison-header,
.comparison-row,
.comparison-footer {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.comparison-row {
  border-top: 1px solid rgba(201, 168, 76, 0.08);
}

.comparison-row:nth-child(even) {
  background: rgba(255, 255, 255, 0.02);
}

.compare-label {
  padding: 14px 20px;
  display: flex;
  align-items: center;
  border-right: 1px solid rgba(201, 168, 76, 0.08);
}

.compare-cell {
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(201, 168, 76, 0.08);
}

.comparison-footer {
  border-top: 1px solid rgba(201, 168, 76, 0.15);
}

/* Mobile Card Styles */
.mobile-vessel-card {
  border-radius: 8px;
  overflow: hidden;
}

.mobile-feature-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.mobile-feature-row:last-child {
  border-bottom: none;
}
</style>