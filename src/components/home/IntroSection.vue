<template>
  <section class="py-24 lg:py-32" style="background: var(--color-ocean-950);">
    <div class="container mx-auto px-6 lg:px-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
        <div class="section-reveal-left">
          <p class="overline-text mb-4">Our Story</p>
          <div class="gold-divider-left mb-6"></div>
          <h2 class="font-display text-5xl lg:text-6xl font-light mb-6 leading-tight" style="font-family: var(--font-display); color: var(--color-sand-100);">
            Adventure, Ocean &amp;<br/>
            <span class="italic" style="color: var(--color-gold-400);">Pure Luxury</span>
          </h2>
          <p class="text-base leading-relaxed mb-5 opacity-80" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.9;">
            Expedition OZ was born from a deep love of the sea and a belief that adventure and luxury need not be opposites. We operate from the pristine shores of Ningaloo Reef — one of the world's largest fringing coral reefs and a UNESCO World Heritage Site.
          </p>
          <p class="text-base leading-relaxed mb-8 opacity-80" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.9;">
            Our guests swim alongside whale sharks, drift over vast coral gardens, and return each evening to the comforts of our beautifully appointed vessels. This is not a holiday — it is an expedition.
          </p>
          <router-link to="/about" class="btn-outline">
            Discover Our Story
          </router-link>
        </div>

        <div class="section-reveal-right relative">
          <div class="image-stack">
            <div class="main-image">
              <img
                src="https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=900"
                alt="Snorkeling in crystal clear Ningaloo waters"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="accent-image">
              <img
                src="https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Luxury vessel at sunset"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="stat-card">
              <p class="font-display text-4xl font-light" style="font-family: var(--font-display); color: var(--color-gold-400);">10+</p>
              <p class="font-heading text-xs tracking-wider mt-1 opacity-70" style="font-family: var(--font-heading); letter-spacing: 0.18em; font-size: 0.6rem;">YEARS OF EXPEDITIONS</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16" style="border-top: 1px solid rgba(201, 168, 76, 0.15);">
        <div v-for="stat in stats" :key="stat.label" class="text-center section-reveal">
          <p class="font-display text-4xl lg:text-5xl font-light mb-2" style="font-family: var(--font-display); color: var(--color-gold-400);">{{ stat.value }}</p>
          <p class="overline-text" style="font-size: 0.6rem; letter-spacing: 0.2em;">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = [
  { value: '2', label: 'Luxury Vessels' },
  { value: '4–7', label: 'Day Expeditions' },
  { value: '500+', label: 'Happy Guests' },
  { value: '100%', label: 'All-Inclusive' },
]
</script>

<style scoped>
.image-stack {
  position: relative;
  height: 520px;
}

.main-image {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.accent-image {
  position: absolute;
  bottom: -24px;
  right: -24px;
  width: 220px;
  height: 160px;
  overflow: hidden;
  border: 3px solid rgba(201, 168, 76, 0.3);
}

.stat-card {
  position: absolute;
  top: 40px;
  left: -24px;
  background: rgba(7, 26, 43, 0.95);
  border: 1px solid rgba(201, 168, 76, 0.3);
  padding: 20px 28px;
  text-align: center;
  backdrop-filter: blur(8px);
}
</style>
