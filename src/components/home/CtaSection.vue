<template>
  <section class="cta-section relative flex items-center justify-center py-32 lg:py-40 overflow-hidden">
    <div class="cta-overlay absolute inset-0 z-10"></div>
    <img
      src="https://r4.wallpaperflare.com/wallpaper/733/1/254/nature-landscape-reef-sea-colorful-blue-water-fish-wallpaper-19a0b89d41fafd8bc64788af408146bd.jpg  "
      alt="Sunset over Ningaloo Reef"
      class="absolute inset-0 w-full h-full object-cover"
      loading="lazy"
    />
    <div class="relative z-20 text-center px-6 max-w-3xl mx-auto section-reveal">
      <p class="overline-text mb-5">Begin Your Journey</p>
      <div class="gold-divider mb-8"></div>
      <h2 class="font-display text-5xl lg:text-7xl font-light mb-6 leading-tight" style="font-family: var(--font-display); color: var(--color-sand-100);">
        Your Expedition <br/>
        <span class="italic" style="color: var(--color-gold-400);">Awaits</span>
      </h2>
      <p class="font-display text-xl italic mb-10 opacity-85" style="font-family: var(--font-display); color: var(--color-sand-200); line-height: 1.7;">
        Limited departures. Unmatched experiences. Reserve your place aboard Sylvia or Millenium today.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link to="/contact" class="btn-primary">
          Check Availability
        </router-link>
        <router-link to="/expeditions" class="btn-outline">
          View All Expeditions
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-overlay {
  background: linear-gradient(
    180deg,
    rgba(7, 26, 43, 0.65) 0%,
    rgba(7, 26, 43, 0.5) 50%,
    rgba(7, 26, 43, 0.75) 100%
  );
}
</style>
