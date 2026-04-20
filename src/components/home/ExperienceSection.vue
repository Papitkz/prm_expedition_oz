<template>
  <section class="py-24 lg:py-32" style="background: var(--color-ocean-950);">
    <div class="container mx-auto px-6 lg:px-12">
      
      <!-- YOUR EXACT HEADER - UNTOUCHED -->
      <div class="text-center mb-20 section-reveal">
        <p class="overline-text mb-4">The Experience</p>
        <div class="gold-divider mb-6"></div>
        <h2 class="font-display text-5xl lg:text-6xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
          Feel Joy. <span class="italic" style="color: var(--color-gold-400);">Feel Wonder.</span>
        </h2>
      </div>

      <!-- YOUR EXACT ALTERNATING LAYOUT - UNTOUCHED -->
      <div class="space-y-24">
        <div 
          v-for="(item, i) in experiences" 
          :key="item.title" 
          class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center" 
          :class="i % 2 === 1 ? 'lg:grid-flow-col-reverse' : ''"
        >
          <div :class="i % 2 === 0 ? 'section-reveal-left' : 'section-reveal-right order-2 lg:order-1'">
            <p class="overline-text mb-4">{{ item.tag }}</p>
            <div class="gold-divider-left mb-5"></div>
            <h3 class="font-display text-4xl lg:text-5xl font-light mb-5" style="font-family: var(--font-display); color: var(--color-sand-100);">{{ item.title }}</h3>
            <p class="text-base leading-relaxed opacity-80" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.9;">{{ item.body }}</p>
          </div>

          <div :class="i % 2 === 0 ? 'section-reveal-right' : 'section-reveal-left order-1 lg:order-2'">
            <div class="exp-image-frame">
              <img :src="item.image" :alt="item.alt" class="exp-image" loading="lazy" />
              <div class="exp-image-border"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- ONLY ADDITION: Bridge to Tour Comparison -->
      <div class="bridge-section section-reveal mt-24">
        <div class="bridge-content">
          <div class="bridge-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <p class="bridge-text">
            Now that you've felt what awaits — 
            <span class="bridge-accent">which vessel will carry you there?</span>
          </p>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
const experiences = [
  {
    tag: 'Marine Encounters',
    title: 'Swim with Whale Sharks',
    body: 'Ningaloo Reef is one of the few places on earth where you can predictably encounter whale sharks — the ocean\'s largest fish. Our expert marine naturalists ensure a safe, respectful, and utterly unforgettable experience.',
    image: 'https://images.pexels.com/photos/3046629/pexels-photo-3046629.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Snorkeler with whale shark in blue ocean'
  },
  {
    tag: 'Onboard Life',
    title: 'Luxury Above the Waves',
    body: 'Your vessel is your sanctuary. Beautifully appointed cabins, sundrenched decks, and cocktails at dusk — every detail aboard has been curated for your comfort. The ocean is our backdrop; luxury is our standard.',
    image: 'https://images.pexels.com/photos/1578750/pexels-photo-1578750.jpeg?auto=compress&cs=tinysrgb&w=900',
    alt: 'Luxury yacht deck at sunset with cocktails'
  },
  {
    tag: 'The Reef',
    title: 'A World Heritage Wilderness',
    body: 'Ningaloo Reef spans over 300km along the coast of Western Australia — and unlike the Great Barrier Reef, it fringes directly on the shore. Crystal-clear visibility, extraordinary biodiversity, and near-untouched wilderness await.',
    image: 'https://r4.wallpaperflare.com/wallpaper/617/792/1005/fish-landscape-the-ocean-stay-wallpaper-679fe2349f35ff7a7f820431b191e785.jpg',
    alt: 'Stunning coral reef underwater Ningaloo'
  }
]
</script>

<style scoped>
/* YOUR EXACT STYLES - UNTOUCHED */
.exp-image-frame {
  position: relative;
  overflow: hidden;
  height: 420px;
}

.exp-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.exp-image-frame:hover .exp-image {
  transform: scale(1.03);
}

.exp-image-border {
  position: absolute;
  inset: 12px;
  border: 1px solid rgba(201, 168, 76, 0.25);
  pointer-events: none;
}

/* ONLY ADDITION: Bridge Styles */
.bridge-section {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.bridge-section.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.bridge-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  padding: 3rem 2rem;
  border-top: 1px solid rgba(201, 168, 76, 0.1);
  border-bottom: 1px solid rgba(201, 168, 76, 0.1);
}

.bridge-icon {
  color: var(--color-gold-400);
  opacity: 0.4;
  flex-shrink: 0;
}

.bridge-text {
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.8;
  color: var(--color-sand-200);
  opacity: 0.8;
}

.bridge-accent {
  color: var(--color-gold-400);
  font-style: italic;
  font-weight: 500;
}

@media (max-width: 768px) {
  .bridge-content {
    flex-direction: column;
    text-align: center;
    padding: 2rem 1rem;
  }

  .bridge-accent {
    display: block;
    margin-top: 0.5rem;
  }
}
</style>