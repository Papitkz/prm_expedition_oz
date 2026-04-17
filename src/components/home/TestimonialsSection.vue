<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

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

const isMobile = ref(false)
const activeIndex = ref(0)
const touchStartX = ref(0)
const touchEndX = ref(0)
const isDragging = ref(false)
const dragStartX = ref(0)
const dragOffset = ref(0)
let autoplayInterval: number | null = null
const autoplayDelay = 6000

// Check mobile breakpoint
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

// Navigation
const goToSlide = (index: number) => {
  if (index < 0) index = testimonials.length - 1
  if (index >= testimonials.length) index = 0
  activeIndex.value = index
  resetAutoplay()
}

const nextSlide = () => {
  goToSlide(activeIndex.value + 1)
}

const prevSlide = () => {
  goToSlide(activeIndex.value - 1)
}

// Touch handlers for swipe
const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0].screenX
  isDragging.value = true
  dragStartX.value = touchStartX.value
  stopAutoplay()
}

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return
  const currentX = e.changedTouches[0].screenX
  dragOffset.value = currentX - dragStartX.value
}

const onTouchEnd = (e: TouchEvent) => {
  if (!isDragging.value) return
  touchEndX.value = e.changedTouches[0].screenX
  handleSwipe()
  isDragging.value = false
  dragOffset.value = 0
  startAutoplay()
}

const handleSwipe = () => {
  const swipeThreshold = 50
  const diff = touchStartX.value - touchEndX.value
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextSlide()
    } else {
      prevSlide()
    }
  }
}

// Mouse drag for desktop carousel feel
const onMouseDown = (e: MouseEvent) => {
  if (!isMobile.value) return
  isDragging.value = true
  dragStartX.value = e.clientX
  stopAutoplay()
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !isMobile.value) return
  dragOffset.value = e.clientX - dragStartX.value
}

const onMouseUp = (e: MouseEvent) => {
  if (!isDragging.value || !isMobile.value) return
  const diff = dragStartX.value - e.clientX
  const swipeThreshold = 50
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) nextSlide()
    else prevSlide()
  }
  
  isDragging.value = false
  dragOffset.value = 0
  startAutoplay()
}

const onMouseLeave = () => {
  if (isDragging.value) {
    isDragging.value = false
    dragOffset.value = 0
    startAutoplay()
  }
}

// Autoplay
const startAutoplay = () => {
  if (!isMobile.value || autoplayInterval) return
  autoplayInterval = window.setInterval(() => {
    nextSlide()
  }, autoplayDelay)
}

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

const resetAutoplay = () => {
  stopAutoplay()
  startAutoplay()
}

// Computed styles for drag
const carouselStyle = computed(() => {
  if (!isDragging.value || !isMobile.value) return {}
  return {
    transform: `translateX(calc(-${activeIndex.value * 100}% - ${activeIndex.value * 24}px + ${dragOffset.value}px))`,
    transition: 'none'
  }
})

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  startAutoplay()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  stopAutoplay()
})
</script>

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

      <!-- Desktop Grid View -->
      <div v-if="!isMobile" class="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      <!-- Mobile Carousel View -->
      <div v-else class="mobile-carousel-wrapper">
        <div 
          class="mobile-carousel"
          :style="carouselStyle"
          :class="{ 'is-dragging': isDragging }"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
          @mousedown="onMouseDown"
          @mousemove="onMouseMove"
          @mouseup="onMouseUp"
          @mouseleave="onMouseLeave"
        >
          <div
            v-for="(t, i) in testimonials"
            :key="t.name"
            class="testimonial-card mobile-card"
            :class="{ 'active': i === activeIndex }"
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

        <!-- Mobile Controls -->
        <div class="mobile-controls">
          <!-- Navigation Arrows -->
          <button 
            class="mobile-nav-btn mobile-nav-prev" 
            @click="prevSlide"
            aria-label="Previous testimonial"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>

          <!-- Dots Indicator -->
          <div class="mobile-dots">
            <button
              v-for="(t, i) in testimonials"
              :key="i"
              class="mobile-dot"
              :class="{ 'active': i === activeIndex }"
              @click="goToSlide(i)"
              :aria-label="`Go to testimonial ${i + 1}`"
            />
          </div>

          <button 
            class="mobile-nav-btn mobile-nav-next" 
            @click="nextSlide"
            aria-label="Next testimonial"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </button>
        </div>

        <!-- Swipe Hint -->
        <div class="swipe-hint" :class="{ 'hidden': activeIndex > 0 }">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
          <span>Swipe to explore</span>
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

/* Mobile Carousel Styles */
.mobile-carousel-wrapper {
  position: relative;
  overflow: hidden;
  padding: 0 12px;
  touch-action: pan-y pinch-zoom;
}

.mobile-carousel {
  display: flex;
  gap: 24px;
  transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: grab;
}

.mobile-carousel.is-dragging {
  cursor: grabbing;
  transition: none;
}

.mobile-card {
  flex: 0 0 calc(100% - 48px);
  min-width: calc(100% - 48px);
  opacity: 0.4;
  transform: scale(0.95);
  transition: all 0.4s ease;
  user-select: none;
}

.mobile-card.active {
  opacity: 1;
  transform: scale(1);
}

.mobile-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
}

.mobile-nav-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(201, 168, 76, 0.1);
  border: 1px solid rgba(201, 168, 76, 0.3);
  border-radius: 50%;
  color: var(--color-gold-400);
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-nav-btn:hover {
  background: var(--color-gold-400);
  color: var(--color-navy-900);
  border-color: var(--color-gold-400);
  transform: scale(1.1);
}

.mobile-nav-btn:active {
  transform: scale(0.95);
}

.mobile-dots {
  display: flex;
  gap: 8px;
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

.swipe-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
  color: var(--color-gold-400);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 1;
  transition: opacity 0.5s ease;
  animation: pulseHint 2s ease-in-out infinite;
}

.swipe-hint.hidden {
  opacity: 0;
  pointer-events: none;
}

@keyframes pulseHint {
  0%, 100% { opacity: 0.6; transform: translateX(0); }
  50% { opacity: 1; transform: translateX(4px); }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .mobile-carousel {
    transition: none;
  }
  
  .mobile-card {
    transition: opacity 0.3s ease;
  }
  
  .swipe-hint {
    animation: none;
  }
}

/* Tablet adjustments */
@media (min-width: 640px) and (max-width: 767px) {
  .mobile-card {
    flex: 0 0 calc(85% - 48px);
    min-width: calc(85% - 48px);
  }
}
</style>