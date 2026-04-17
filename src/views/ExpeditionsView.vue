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

    <section class="py-12 md:py-24 lg:py-32" style="background: var(--color-ocean-950);">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="text-center mb-8 md:mb-16 section-reveal">
          <p class="overline-text mb-2 md:mb-4 text-xs md:text-sm">Ningaloo Reef, Western Australia</p>
          <div class="gold-divider mb-3 md:mb-6 mx-auto"></div>
          <h2 class="font-display text-2xl md:text-4xl lg:text-5xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
            Which expedition is <span class="italic" style="color: var(--color-gold-400);">right for you?</span>
          </h2>
          <p class="mt-3 md:mt-6 max-w-2xl mx-auto text-sm md:text-base opacity-75 px-2" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.8;">
            Both expeditions offer world-class marine encounters, all-inclusive luxury, and expert-guided experiences. The choice comes down to how deep you want to go.
          </p>
        </div>

        <!-- Desktop Table - OPTIMIZED SPACING -->
        <div class="hidden md:block comparison-grid section-reveal">
          <div class="comparison-header">
            <div></div>
            <div class="text-center py-4 md:py-6 px-2 md:px-4" style="background: rgba(201, 168, 76, 0.08); border-bottom: 2px solid var(--color-gold-400);">
              <p class="overline-text mb-1 text-[0.5rem] md:text-[0.55rem]">Live-Aboard</p>
              <p class="font-display text-2xl md:text-3xl font-light" style="font-family: var(--font-display); color: var(--color-gold-400);">Sylvia</p>
              <p class="font-heading text-xs mt-1 opacity-60" style="font-family: var(--font-heading); font-size: 0.6rem; letter-spacing: 0.15em;">4 DAY EXPEDITION</p>
            </div>
            <div class="text-center py-4 md:py-6 px-2 md:px-4" style="background: rgba(13, 110, 122, 0.08); border-bottom: 2px solid var(--color-ocean-500);">
              <p class="overline-text mb-1 text-[0.5rem] md:text-[0.55rem]" style="color: var(--color-ocean-500) !important;">Premium Live-Aboard</p>
              <p class="font-display text-2xl md:text-3xl font-light" style="font-family: var(--font-display); color: #4ea8c9;">Millenium</p>
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
            <div class="text-center py-4 md:py-6">
              <router-link to="/expeditions/sylvia" class="btn-primary text-xs md:text-sm" style="padding: 10px 20px;">View Sylvia</router-link>
            </div>
            <div class="text-center py-4 md:py-6">
              <router-link to="/expeditions/millenium" class="btn-outline text-xs md:text-sm" style="padding: 10px 20px;">View Millenium</router-link>
            </div>
          </div>
        </div>

        <!-- Mobile Cards - OPTIMIZED WITH TIGHTER SPACING -->
        <div class="md:hidden space-y-3 section-reveal">
          <!-- Sylvia Card -->
          <div class="mobile-vessel-card" style="background: rgba(201, 168, 76, 0.08); border: 1px solid rgba(201, 168, 76, 0.2);">
            <div class="text-center py-3 px-3 border-b border-[rgba(201,168,76,0.2)]">
              <p class="overline-text mb-1 text-[0.6rem]">Live-Aboard</p>
              <p class="font-display text-xl font-light" style="font-family: var(--font-display); color: var(--color-gold-400);">Sylvia</p>
              <p class="font-heading text-xs mt-1 opacity-60" style="font-family: var(--font-heading); font-size: 0.65rem; letter-spacing: 0.15em;">4 DAY EXPEDITION</p>
            </div>
            <div class="p-3 space-y-2">
              <div v-for="row in compareRows" :key="'sylvia-'+row.label" class="mobile-feature-row">
                <p class="text-xs opacity-70 flex-1" style="font-family: var(--font-heading); color: var(--color-sand-200);">{{ row.label }}</p>
                <div class="flex items-center justify-end gap-2 min-w-[80px]">
                  <span v-if="row.sylvia === true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="var(--color-gold-400)" stroke-width="2.5" stroke-linecap="round"/></svg></span>
                  <span v-else-if="row.sylvia === false" class="opacity-30"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="white" stroke-width="2"/><line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2"/></svg></span>
                  <span v-else class="text-xs font-medium" style="font-family: var(--font-body); color: var(--color-sand-100);">{{ row.sylvia }}</span>
                </div>
              </div>
            </div>
            <div class="p-3 pt-0">
              <router-link to="/expeditions/sylvia" class="btn-primary w-full text-center block text-xs" style="padding: 10px;">View Sylvia</router-link>
            </div>
          </div>

          <!-- Millenium Card -->
          <div class="mobile-vessel-card" style="background: rgba(13, 110, 122, 0.08); border: 1px solid rgba(78, 168, 201, 0.3);">
            <div class="text-center py-3 px-3 border-b border-[rgba(78,168,201,0.3)]">
              <p class="overline-text mb-1 text-[0.6rem]" style="color: #4ea8c9 !important;">Premium Live-Aboard</p>
              <p class="font-display text-xl font-light" style="font-family: var(--font-display); color: #4ea8c9;">Millenium</p>
              <p class="font-heading text-xs mt-1 opacity-60" style="font-family: var(--font-heading); font-size: 0.65rem; letter-spacing: 0.15em;">7 DAY EXPEDITION</p>
            </div>
            <div class="p-3 space-y-2">
              <div v-for="row in compareRows" :key="'millenium-'+row.label" class="mobile-feature-row">
                <p class="text-xs opacity-70 flex-1" style="font-family: var(--font-heading); color: var(--color-sand-200);">{{ row.label }}</p>
                <div class="flex items-center justify-end gap-2 min-w-[80px]">
                  <span v-if="row.millenium === true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#4ea8c9" stroke-width="2.5" stroke-linecap="round"/></svg></span>
                  <span v-else-if="row.millenium === false" class="opacity-30"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="white" stroke-width="2"/><line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2"/></svg></span>
                  <span v-else class="text-xs font-medium" style="font-family: var(--font-body); color: var(--color-sand-100);">{{ row.millenium }}</span>
                </div>
              </div>
            </div>
            <div class="p-3 pt-0">
              <router-link to="/expeditions/millenium" class="btn-outline w-full text-center block text-xs" style="padding: 10px; border-color: #4ea8c9; color: #4ea8c9;">View Millenium</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CtaSection />
  </div>
</template>

<style scoped>
/* Desktop Table Styles - OPTIMIZED */
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
  padding: 10px 14px;
  display: flex;
  align-items: center;
  border-right: 1px solid rgba(201, 168, 76, 0.08);
}

@media (min-width: 768px) {
  .compare-label {
    padding: 14px 20px;
  }
}

.compare-cell {
  padding: 10px 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(201, 168, 76, 0.08);
}

@media (min-width: 768px) {
  .compare-cell {
    padding: 14px 20px;
  }
}

.comparison-footer {
  border-top: 1px solid rgba(201, 168, 76, 0.15);
}

/* Mobile Card Styles - TIGHTER SPACING */
.mobile-vessel-card {
  border-radius: 6px;
  overflow: hidden;
}

.mobile-feature-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  gap: 8px;
}

.mobile-feature-row:last-child {
  border-bottom: none;
}
</style>