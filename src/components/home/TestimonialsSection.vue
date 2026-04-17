<template>
  <section class="py-24 lg:py-32" style="background: var(--color-ocean-950);">
    <div class="container mx-auto px-6 lg:px-12">
      <div class="text-center mb-16 section-reveal">
        <p class="overline-text mb-4">Guest Experiences</p>
        <div class="gold-divider mb-6"></div>
        <h2 class="font-display text-5xl lg:text-6xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
          Words from the <span class="italic" style="color: var(--color-gold-400);">Sea</span>
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          v-for="(t, i) in testimonials"
          :key="t.name"
          class="testimonial-card section-reveal"
          :style="`transition-delay: ${i * 0.12}s`"
        >
          <div class="flex mb-4 gap-0.5">
            <svg v-for="s in 5" :key="s" width="14" height="14" viewBox="0 0 24 24" fill="var(--color-gold-400)">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <p class="font-display text-xl font-light italic mb-6 leading-relaxed" style="font-family: var(--font-display); color: var(--color-sand-100); line-height: 1.7;">
            "{{ t.quote }}"
          </p>
          <div class="flex items-center gap-4 pt-4" style="border-top: 1px solid rgba(201, 168, 76, 0.15);">
            <div class="w-10 h-10 flex items-center justify-center text-xs font-600" style="background: rgba(201, 168, 76, 0.15); color: var(--color-gold-400); font-family: var(--font-heading); font-weight: 600;">
              {{ t.name.charAt(0) }}
            </div>
            <div>
              <p class="font-heading text-sm font-500" style="font-family: var(--font-heading); color: var(--color-sand-100); font-size: 0.8rem;">{{ t.name }}</p>
              <p class="text-xs opacity-50 mt-0.5" style="font-family: var(--font-body); color: var(--color-sand-200);">{{ t.location }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-12 section-reveal">
        <p class="text-sm italic opacity-60" style="font-family: var(--font-display); color: var(--color-sand-200); font-size: 1rem;">
          Reviews space reserved — we're just getting started.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const testimonials = [
  {
    quote: 'The most extraordinary experience of my life. Swimming alongside whale sharks in water this clear, then returning to a beautifully appointed vessel — I simply cannot put it into words.',
    name: 'Sarah M.',
    location: 'Melbourne, VIC'
  },
  {
    quote: 'Expedition OZ completely redefines what a reef tour can be. The crew\'s knowledge and passion for Ningaloo is infectious. The manta ray dives alone were worth every cent.',
    name: 'James & Linda T.',
    location: 'Perth, WA'
  },
  {
    quote: 'From the moment we boarded Millenium, we knew this would be special. Seven days felt like both a lifetime and not nearly enough. We\'re already planning our return.',
    name: 'Dr. Rachel K.',
    location: 'Sydney, NSW'
  }
]
</script>

<style scoped>
.testimonial-card {
  background: rgba(10, 46, 74, 0.5);
  border: 1px solid rgba(201, 168, 76, 0.12);
  padding: 36px;
  transition: border-color 0.3s ease;
}

.testimonial-card:hover {
  border-color: rgba(201, 168, 76, 0.35);
}
</style>
