<script setup lang="ts">
import { ref, onMounted } from 'vue'

const revealed = ref(false)
const compassSpun = ref(false)

onMounted(() => {
  setTimeout(() => { revealed.value = true }, 300)
  setTimeout(() => { compassSpun.value = true }, 800)
})
</script>

<template>
  <section class="hero-section relative flex items-center justify-center overflow-hidden">
    <div class="hero-overlay absolute inset-0 z-10"></div>

    <img
      src="https://images.pexels.com/photos/1295138/pexels-photo-1295138.jpeg?auto=compress&cs=tinysrgb&w=1920"
      alt="Luxury catamaran on turquoise Ningaloo Reef waters"
      class="hero-bg absolute inset-0 w-full h-full object-cover"
      loading="eager"
    />

    <div class="relative z-20 text-center px-6 max-w-5xl mx-auto">
      <div class="compass-wrapper mb-8" :class="{ 'compass-revealed': revealed }">
        <div class="compass-ring" :class="{ 'compass-spin-complete': compassSpun }">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="38" stroke="rgba(201,168,76,0.4)" stroke-width="1"/>
            <circle cx="40" cy="40" r="32" stroke="rgba(201,168,76,0.2)" stroke-width="0.5"/>
            <line x1="40" y1="8" x2="40" y2="14" stroke="var(--color-gold-400)" stroke-width="1.5"/>
            <line x1="40" y1="66" x2="40" y2="72" stroke="rgba(201,168,76,0.5)" stroke-width="1"/>
            <line x1="8" y1="40" x2="14" y2="40" stroke="rgba(201,168,76,0.5)" stroke-width="1"/>
            <line x1="66" y1="40" x2="72" y2="40" stroke="rgba(201,168,76,0.5)" stroke-width="1"/>
            <polygon points="40,16 37,36 40,40 43,36" fill="var(--color-gold-400)"/>
            <polygon points="40,64 37,44 40,40 43,44" fill="rgba(201,168,76,0.4)"/>
            <circle cx="40" cy="40" r="3" fill="var(--color-gold-400)"/>
            <text x="40" y="6" text-anchor="middle" font-family="'Montserrat',sans-serif" font-size="5" font-weight="600" letter-spacing="1" fill="var(--color-gold-400)">N</text>
            <text x="40" y="77" text-anchor="middle" font-family="'Montserrat',sans-serif" font-size="5" font-weight="600" letter-spacing="1" fill="rgba(201,168,76,0.6)">S</text>
            <text x="75" y="42" text-anchor="middle" font-family="'Montserrat',sans-serif" font-size="5" font-weight="600" letter-spacing="1" fill="rgba(201,168,76,0.6)">E</text>
            <text x="5" y="42" text-anchor="middle" font-family="'Montserrat',sans-serif" font-size="5" font-weight="600" letter-spacing="1" fill="rgba(201,168,76,0.6)">W</text>
          </svg>
        </div>
      </div>

      <p class="overline-text mb-4" :class="{ 'hero-text-in': revealed }" style="transition-delay: 0.2s;">
        Ningaloo Reef &nbsp;·&nbsp; Western Australia
      </p>

      <h1
        class="font-display text-6xl md:text-8xl lg:text-9xl font-light leading-none mb-4"
        style="font-family: var(--font-display); color: var(--color-sand-100);"
        :class="{ 'hero-text-in': revealed }"
        style-transition-delay="0.4s"
      >
        <span style="transition-delay: 0.4s;" :class="{ 'hero-text-in': revealed }" class="hero-line block">Expedition</span>
        <span style="transition-delay: 0.55s; color: var(--color-gold-400);" :class="{ 'hero-text-in': revealed }" class="hero-line block italic">OZ</span>
      </h1>

      <div class="gold-divider my-6" :class="{ 'hero-text-in': revealed }" style="transition-delay: 0.7s;"></div>

      <p
        class="font-display text-xl md:text-2xl font-light italic max-w-2xl mx-auto mb-10"
        style="font-family: var(--font-display); color: rgba(248, 245, 239, 0.85); line-height: 1.6; transition-delay: 0.8s;"
        :class="{ 'hero-text-in': revealed }"
      >
        Where the world's greatest reef meets unbridled luxury
      </p>

      <div class="flex flex-col sm:flex-row gap-4 justify-center" :class="{ 'hero-text-in': revealed }" style="transition-delay: 1s;">
        <router-link to="/expeditions" class="btn-primary">
          Explore Expeditions
        </router-link>
        <router-link to="/contact" class="btn-outline">
          Check Availability
        </router-link>
      </div>
    </div>

    <div class="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-2" :class="{ 'hero-text-in': revealed }" style="transition-delay: 1.2s;">
      <p class="overline-text" style="font-size: 0.55rem; letter-spacing: 0.25em;">Scroll to Discover</p>
      <div class="scroll-indicator"></div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: 100vh;
  min-height: 100svh;
}

.hero-bg {
  transition: transform 8s ease;
}

.hero-section:hover .hero-bg {
  transform: scale(1.03);
}

.hero-overlay {
  background: linear-gradient(
    180deg,
    rgba(7, 26, 43, 0.5) 0%,
    rgba(7, 26, 43, 0.3) 40%,
    rgba(7, 26, 43, 0.7) 100%
  );
}

.compass-wrapper {
  opacity: 0;
  transform: scale(0.6) rotate(-180deg);
  transition: all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  justify-content: center;
}

.compass-wrapper.compass-revealed {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.compass-ring {
  transition: transform 0.6s ease;
}

.compass-spin-complete {
  animation: compassPulse 3s ease-in-out infinite;
}

@keyframes compassPulse {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(2deg); }
  75% { transform: rotate(-2deg); }
}

.hero-line {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.hero-text-in {
  opacity: 1 !important;
  transform: none !important;
}

.hero-line.hero-text-in {
  opacity: 1;
  transform: translateY(0);
}

.scroll-indicator {
  width: 1px;
  height: 50px;
  background: linear-gradient(to bottom, var(--color-gold-400), transparent);
  animation: scrollPulse 2s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.4; transform: scaleY(1); }
  50% { opacity: 1; transform: scaleY(1.2); }
}
</style>
