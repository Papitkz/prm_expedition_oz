<template>
  <section class="py-24 lg:py-32" style="background: var(--color-ocean-900);">
    <div class="container mx-auto px-6 lg:px-12">
      <div class="text-center mb-16 section-reveal">
        <p class="overline-text mb-4">All-Inclusive</p>
        <div class="gold-divider mb-6"></div>
        <h2 class="font-display text-5xl lg:text-6xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
          Everything <span class="italic" style="color: var(--color-gold-400);">Included</span>
        </h2>
        <p class="mt-6 max-w-xl mx-auto text-sm opacity-75" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.8;">
          No hidden extras. Every expedition includes premium gear, all meals and beverages, and expert-guided experiences.
        </p>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <div
          v-for="(item, i) in inclusions"
          :key="item.label"
          class="inclusion-card section-reveal text-center"
          :style="`transition-delay: ${i * 0.08}s`"
        >
          <div class="inclusion-icon mb-4 mx-auto">
            <span v-html="item.icon"></span>
          </div>
          <p class="font-heading text-xs font-500 tracking-wide" style="font-family: var(--font-heading); color: var(--color-sand-200); font-size: 0.65rem; letter-spacing: 0.1em;">{{ item.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const inclusions = [
  {
    label: 'Gourmet Meals',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`
  },
  {
    label: 'Premium Beverages',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5"><path d="M8 22h8"/><path d="M7 10h10l-1 7H8z"/><path d="M17 10 19 3H5l2 7"/></svg>`
  },
  {
    label: 'Snorkel Gear',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
  },
  {
    label: 'Marine Naturalist',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M12 12v10"/><path d="M8 16l4-4 4 4"/></svg>`
  },
  {
    label: 'Kayaks & Paddleboards',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5"><path d="m2 20 20-8L2 4v6l14 2-14 2v6z"/></svg>`
  },
  {
    label: 'Cabin Accommodation',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold-400)" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
  },
]
</script>

<style scoped>
.inclusion-card {
  background: rgba(7, 26, 43, 0.5);
  border: 1px solid rgba(201, 168, 76, 0.1);
  padding: 28px 16px;
  transition: border-color 0.3s ease, background 0.3s ease;
}

.inclusion-card:hover {
  border-color: rgba(201, 168, 76, 0.4);
  background: rgba(201, 168, 76, 0.05);
}

.inclusion-icon {
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(201, 168, 76, 0.2);
}
</style>
