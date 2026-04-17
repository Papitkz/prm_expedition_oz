<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const stats = [
  { value: '2', label: 'Luxury Vessels' },
  { value: '4–7', label: 'Day Expeditions' },
  { value: '500+', label: 'Happy Guests' },
  { value: '100%', label: 'All-Inclusive' },
]

const isMobile = ref(false)
const activeImage = ref(0)
const touchStartX = ref(0)
const touchEndX = ref(0)

const images = [
  {
    src: 'https://r4.wallpaperflare.com/wallpaper/839/744/992/earth-great-barrier-reef-reef-wallpaper-9950d8cd811aedabd6c7a8ffa0f1760d.jpg',
    alt: 'Snorkeling in crystal clear Ningaloo waters'
  },
  {
    src: 'https://r4.wallpaperflare.com/wallpaper/643/352/44/great-barrier-reef-coral-reef-in-queensland-australia-ocean-tropical-animals-pisces-plants-1920%C3%971200-wallpaper-525142607db61ebbaac8027500b899e2.jpg',
    alt: 'Luxury vessel at sunset'
  }
]

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
}

const nextImage = () => {
  activeImage.value = (activeImage.value + 1) % images.length
}

const prevImage = () => {
  activeImage.value = activeImage.value === 0 ? images.length - 1 : activeImage.value - 1
}

const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0].screenX
}

const onTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].screenX
  const diff = touchStartX.value - touchEndX.value
  if (Math.abs(diff) > 50) {
    diff > 0 ? nextImage() : prevImage()
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <section class="story-section">
    <div class="container mx-auto px-6 lg:px-12">
      <div class="story-grid">
        <!-- Text Content -->
        <div class="story-content section-reveal-left">
          <p class="overline-text mb-4">Our Story</p>
          <div class="gold-divider-left mb-6"></div>
          <h2 class="story-title">
            Adventure, Ocean &<br/>
            <span class="story-title-accent">Pure Luxury</span>
          </h2>
          <p class="story-text mb-5">
            Expedition OZ was born from a deep love of the sea and a belief that adventure and luxury need not be opposites. We operate from the pristine shores of Ningaloo Reef — one of the world's largest fringing coral reefs and a UNESCO World Heritage Site.
          </p>
          <p class="story-text mb-8">
            Our guests swim alongside whale sharks, drift over vast coral gardens, and return each evening to the comforts of our beautifully appointed vessels. This is not a holiday — it is an expedition.
          </p>
          <router-link to="/about" class="btn-outline">
            Discover Our Story
          </router-link>
        </div>

        <!-- Desktop Image Stack -->
        <div v-if="!isMobile" class="section-reveal-right relative">
          <div class="image-stack">
            <div class="main-image">
              <img
                :src="images[0].src"
                :alt="images[0].alt"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="accent-image">
              <img
                :src="images[1].src"
                :alt="images[1].alt"
                class="w-full h-full object-cover"
              />
            </div>
            <div class="stat-card">
              <p class="stat-number">10+</p>
              <p class="stat-label">YEARS OF EXPEDITIONS</p>
            </div>
          </div>
        </div>

        <!-- Mobile Image Carousel -->
        <div v-else class="mobile-image-section">
          <div 
            class="mobile-carousel"
            @touchstart="onTouchStart"
            @touchend="onTouchEnd"
          >
            <div 
              class="mobile-carousel-track"
              :style="{ transform: `translateX(-${activeImage * 100}%)` }"
            >
              <div 
                v-for="(img, i) in images" 
                :key="i"
                class="mobile-carousel-slide"
              >
                <img :src="img.src" :alt="img.alt" class="mobile-carousel-img" />
              </div>
            </div>
            
            <!-- Mobile Indicators -->
            <div class="mobile-dots">
              <button
                v-for="(img, i) in images"
                :key="i"
                class="mobile-dot"
                :class="{ 'active': i === activeImage }"
                @click="activeImage = i"
              />
            </div>
          </div>

          <!-- Mobile Stat Card -->
          <div class="mobile-stat-card">
            <p class="stat-number">10+</p>
            <p class="stat-label">YEARS OF EXPEDITIONS</p>
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-item section-reveal">
          <p class="stat-value">{{ stat.value }}</p>
          <p class="stat-name">{{ stat.label }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.story-section {
  padding: 6rem 0;
  background: var(--color-ocean-950);
}

@media (min-width: 1024px) {
  .story-section {
    padding: 8rem 0;
  }
}

.story-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: center;
}

@media (min-width: 1024px) {
  .story-grid {
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
  }
}

/* Text Content */
.story-content {
  order: 2;
}

@media (min-width: 1024px) {
  .story-content {
    order: 1;
  }
}

.story-title {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 300;
  line-height: 1.2;
  margin-bottom: 1.5rem;
  color: var(--color-sand-100);
}

@media (min-width: 768px) {
  .story-title {
    font-size: 3.5rem;
  }
}

@media (min-width: 1024px) {
  .story-title {
    font-size: 3.75rem;
  }
}

.story-title-accent {
  color: var(--color-gold-400);
  font-style: italic;
}

.story-text {
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.9;
  color: var(--color-sand-200);
  opacity: 0.8;
}

/* Desktop Image Stack */
.image-stack {
  position: relative;
  height: 520px;
  order: 1;
}

@media (min-width: 1024px) {
  .image-stack {
    order: 2;
  }
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

.stat-number {
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 300;
  color: var(--color-gold-400);
  margin: 0;
}

.stat-label {
  font-family: var(--font-heading);
  font-size: 0.6rem;
  letter-spacing: 0.18em;
  opacity: 0.7;
  margin: 0.25rem 0 0;
  color: var(--color-sand-100);
}

/* Mobile Image Carousel */
.mobile-image-section {
  order: 1;
  position: relative;
}

.mobile-carousel {
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  touch-action: pan-y;
}

.mobile-carousel-track {
  display: flex;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.mobile-carousel-slide {
  flex: 0 0 100%;
  min-width: 100%;
}

.mobile-carousel-img {
  width: 100%;
  height: 280px;
  object-fit: cover;
  display: block;
}

@media (min-width: 640px) {
  .mobile-carousel-img {
    height: 360px;
  }
}

.mobile-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.mobile-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(201, 168, 76, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
}

.mobile-dot.active {
  background: var(--color-gold-400);
  width: 24px;
  border-radius: 4px;
}

.mobile-stat-card {
  background: rgba(7, 26, 43, 0.95);
  border: 1px solid rgba(201, 168, 76, 0.3);
  padding: 16px 24px;
  text-align: center;
  backdrop-filter: blur(8px);
  margin-top: 20px;
  display: inline-block;
  width: 100%;
}

.mobile-stat-card .stat-number {
  font-size: 2rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-top: 5rem;
  padding-top: 4rem;
  border-top: 1px solid rgba(201, 168, 76, 0.15);
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
  }
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 300;
  color: var(--color-gold-400);
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .stat-value {
    font-size: 3rem;
  }
}

.stat-name {
  font-family: var(--font-heading);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-sand-100);
  opacity: 0.8;
}

/* Button Styles */
.btn-outline {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 2rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 9999px;
  background: transparent;
  color: var(--color-sand-100);
  border: 1px solid rgba(248, 245, 239, 0.4);
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: rgba(248, 245, 239, 0.1);
  border-color: var(--color-sand-100);
  transform: translateY(-2px);
}

/* Overline & Dividers */
.overline-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold-400);
}

.gold-divider-left {
  width: 60px;
  height: 1px;
  background: var(--color-gold-400);
}

/* Animations */
@media (prefers-reduced-motion: reduce) {
  .mobile-carousel-track {
    transition: none;
  }
}
</style>