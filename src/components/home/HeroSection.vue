<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'

const revealed = ref(false)
const compassSpun = ref(false)
const currentVideoIndex = ref(0)
const isTransitioning = ref(false)
const videoLoaded = ref(false)
const isPlaying = ref(true)
const showControls = ref(false)
const isHovering = ref(false)
const isMobile = ref(false)
const touchStartX = ref(0)
const touchEndX = ref(0)
const videoError = ref(false)
const isBuffering = ref(false)

// Videos array - luxury expedition footage
const videos = [
  'https://cdn.pixabay.com/video/2024/02/24/201766-916357972_small.mp4',
  'https://cdn.pixabay.com/video/2018/11/16/19368-301525727_small.mp4',
  'https://cdn.pixabay.com/video/2024/03/18/204565-924698132_small.mp4',
  'https://cdn.pixabay.com/video/2023/01/30/148597-794221559_small.mp4',
  'https://cdn.pixabay.com/video/2021/04/12/70796-538877060_small.mp4',
]

const videoRef = ref<HTMLVideoElement | null>(null)

let resizeObserver: ResizeObserver | null = null
let playAttemptInterval: number | null = null
let transitionTimeout: number | null = null

// Check mobile breakpoint
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const currentVideoUrl = computed(() => videos[currentVideoIndex.value])
const nextVideoIndex = computed(() => (currentVideoIndex.value + 1) % videos.length)
const prevVideoIndex = computed(() => currentVideoIndex.value === 0 ? videos.length - 1 : currentVideoIndex.value - 1)

// Preload video by creating a hidden video element
const preloadVideo = (url: string) => {
  const video = document.createElement('video')
  video.src = url
  video.preload = 'auto'
  video.muted = true
  video.load()
}

// Force play with better error handling
const forcePlay = async () => {
  if (!videoRef.value) return
  
  try {
    videoRef.value.muted = true
    await videoRef.value.play()
    isPlaying.value = true
    videoError.value = false
    isBuffering.value = false
  } catch (err) {
    console.warn('Playback failed:', err)
    isPlaying.value = false
  }
}

// Smooth video transition - FIXED VERSION
const switchVideo = (newIndex: number) => {
  if (isTransitioning.value || newIndex === currentVideoIndex.value || !videoRef.value) return
  
  isTransitioning.value = true
  isBuffering.value = true
  
  // Fade out current
  videoRef.value.style.opacity = '0.3'
  
  // Small delay for fade effect
  transitionTimeout = window.setTimeout(() => {
    // Update index
    currentVideoIndex.value = newIndex
    
    // Set new source
    videoRef.value!.src = videos[newIndex]
    videoRef.value!.load()
    
    // Wait for canplaythrough for smooth playback
    const onCanPlay = () => {
      videoRef.value!.removeEventListener('canplaythrough', onCanPlay)
      
      // Fade in and play
      videoRef.value!.style.opacity = '1'
      forcePlay()
      
      isTransitioning.value = false
      isBuffering.value = false
      
      // Preload next video
      preloadVideo(videos[nextVideoIndex.value])
    }
    
    videoRef.value!.addEventListener('canplaythrough', onCanPlay)
    
    // Fallback timeout
    setTimeout(() => {
      if (isTransitioning.value) {
        onCanPlay()
      }
    }, 3000)
    
  }, 300)
}

// Go to next video (auto or manual)
const nextVideo = () => {
  switchVideo(nextVideoIndex.value)
}

// Go to previous video
const prevVideo = () => {
  switchVideo(prevVideoIndex.value)
}

// Go to specific video
const goToVideo = (index: number) => {
  switchVideo(index)
}

// Toggle autoplay
const toggleAutoplay = () => {
  isPlaying.value = !isPlaying.value
  
  if (isPlaying.value) {
    forcePlay()
  } else {
    videoRef.value?.pause()
  }
}

// Handle video ended - auto advance
const handleVideoEnded = () => {
  if (videos.length > 1) {
    nextVideo()
  } else if (videoRef.value) {
    videoRef.value.currentTime = 0
    forcePlay()
  }
}

// Touch handlers for mobile swipe
const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0].screenX
}

const onTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeThreshold = 50
  const diff = touchStartX.value - touchEndX.value
  
  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      nextVideo()
    } else {
      prevVideo()
    }
  }
}

// Hover handlers
const onMouseEnter = () => {
  isHovering.value = true
  showControls.value = true
}

const onMouseLeave = () => {
  isHovering.value = false
  setTimeout(() => {
    if (!isHovering.value) showControls.value = false
  }, 2000)
}

// Handle video loaded
const onVideoLoaded = () => {
  videoLoaded.value = true
  if (videoRef.value) {
    videoRef.value.style.opacity = '1'
  }
}

// Handle video error
const onVideoError = () => {
  videoError.value = true
  // Try next video if current fails
  setTimeout(() => {
    if (videoError.value) nextVideo()
  }, 2000)
}

// Visibility change handler
const handleVisibilityChange = () => {
  if (!document.hidden && isPlaying.value) {
    forcePlay()
  }
}

onMounted(() => {
  checkMobile()
  
  resizeObserver = new ResizeObserver(() => {
    checkMobile()
  })
  resizeObserver.observe(document.body)
  
  // Staggered reveal animations
  setTimeout(() => { revealed.value = true }, 300)
  setTimeout(() => { compassSpun.value = true }, 800)
  
  // Initialize video
  if (videoRef.value) {
    videoRef.value.src = currentVideoUrl.value
    videoRef.value.load()
    forcePlay()
  }
  
  // Preload next video
  preloadVideo(videos[nextVideoIndex.value])
  
  // Show controls briefly
  showControls.value = true
  setTimeout(() => {
    if (!isHovering.value) showControls.value = false
  }, 4000)
  
  document.addEventListener('visibilitychange', handleVisibilityChange)
  
  // Periodic play check for mobile
  playAttemptInterval = window.setInterval(() => {
    if (isPlaying.value && videoRef.value?.paused && !videoRef.value?.ended && !isTransitioning.value) {
      forcePlay()
    }
  }, 3000)
})

onUnmounted(() => {
  if (transitionTimeout) clearTimeout(transitionTimeout)
  if (resizeObserver) resizeObserver.disconnect()
  if (playAttemptInterval) clearInterval(playAttemptInterval)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<template>
  <section 
    class="hero-section"
    :class="{ 'is-mobile': isMobile }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <div class="hero-overlay"></div>

    <!-- Video Background - SINGLE VIDEO ELEMENT -->
    <div class="video-container">
      <video
        ref="videoRef"
        autoplay
        muted
        playsinline
        preload="auto"
        class="hero-video"
        :class="{ 
          'video-fade-in': videoLoaded,
          'is-buffering': isBuffering
        }"
        @loadeddata="onVideoLoaded"
        @ended="handleVideoEnded"
        @error="onVideoError"
        @waiting="isBuffering = true"
        @playing="isBuffering = false"
      />
      
      <!-- Buffering Indicator -->
      <div v-if="isBuffering" class="buffering-indicator">
        <div class="buffering-spinner"></div>
      </div>
    </div>

    <!-- Mobile Carousel UI -->
    <div v-if="isMobile" class="mobile-carousel-ui">
      <div class="swipe-hint" :class="{ 'fade-out': revealed }">
        <div class="swipe-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
        <span>Swipe to explore</span>
      </div>

      <button 
        @click="toggleAutoplay"
        class="mobile-play-btn"
        :class="{ 'is-playing': isPlaying }"
        aria-label="Toggle playback"
      >
        <svg v-if="isPlaying" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <rect x="6" y="4" width="4" height="16" rx="1"/>
          <rect x="14" y="4" width="4" height="16" rx="1"/>
        </svg>
        <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </button>

      <div class="mobile-progress">
        <div 
          v-for="(video, index) in videos" 
          :key="index"
          class="mobile-progress-bar"
          :class="{ 
            'active': index === currentVideoIndex,
            'completed': index < currentVideoIndex
          }"
          @click="goToVideo(index)"
        >
          <div v-if="index === currentVideoIndex && isPlaying && !isBuffering" class="progress-fill"></div>
        </div>
      </div>

      <div class="mobile-counter">
        <span class="current">{{ String(currentVideoIndex + 1).padStart(2, '0') }}</span>
        <span class="separator">/</span>
        <span class="total">{{ String(videos.length).padStart(2, '0') }}</span>
      </div>
    </div>

    <!-- Desktop Video Controls -->
    <div 
      v-else
      class="video-controls-panel"
      :class="{ 'opacity-0 translate-y-4': !showControls, 'opacity-100 translate-y-0': showControls }"
    >
      <div class="controls-row">
        <button 
          @click="prevVideo"
          class="control-btn"
          :disabled="videos.length <= 1 || isTransitioning"
          aria-label="Previous video"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>

        <button 
          @click="toggleAutoplay"
          class="control-btn control-btn-main"
          :class="{ 'is-playing': isPlaying }"
          aria-label="Toggle autoplay"
        >
          <svg v-if="isPlaying" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" rx="1"/>
            <rect x="14" y="4" width="4" height="16" rx="1"/>
          </svg>
          <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>

        <button 
          @click="nextVideo"
          class="control-btn"
          :disabled="videos.length <= 1 || isTransitioning"
          aria-label="Next video"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
      </div>

      <div 
        v-if="videos.length > 1"
        class="indicators-row"
      >
        <button
          v-for="(video, index) in videos"
          :key="index"
          @click="goToVideo(index)"
          class="indicator-dot"
          :class="{ 
            'active': index === currentVideoIndex,
            'playing': index === currentVideoIndex && isPlaying && !isBuffering
          }"
          :disabled="isTransitioning"
          :aria-label="`Go to video ${index + 1}`"
        />
        <span class="video-counter">
          {{ currentVideoIndex + 1 }}/{{ videos.length }}
        </span>
      </div>
    </div>

    <!-- Main Content -->
    <div class="hero-content">
      <div class="compass-wrapper" :class="{ 'compass-revealed': revealed }">
        <div class="compass-ring" :class="{ 'compass-spin-complete': compassSpun }">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="38" stroke="rgba(201,168,76,0.4)" stroke-width="1"/>
            <circle cx="40" cy="40" r="32" stroke="rgba(201,168,76,0.2)" stroke-width="0.5"/>
            <line x1="40" y1="8" x2="40" y2="14" stroke="#c9a84c" stroke-width="1.5"/>
            <line x1="40" y1="66" x2="40" y2="72" stroke="rgba(201,168,76,0.5)" stroke-width="1"/>
            <line x1="8" y1="40" x2="14" y2="40" stroke="rgba(201,168,76,0.5)" stroke-width="1"/>
            <line x1="66" y1="40" x2="72" y2="40" stroke="rgba(201,168,76,0.5)" stroke-width="1"/>
            <polygon points="40,16 37,36 40,40 43,36" fill="#c9a84c"/>
            <polygon points="40,64 37,44 40,40 43,44" fill="rgba(201,168,76,0.4)"/>
            <circle cx="40" cy="40" r="3" fill="#c9a84c"/>
            <text x="40" y="6" text-anchor="middle" font-family="'Montserrat',sans-serif" font-size="5" font-weight="600" letter-spacing="1" fill="#c9a84c">N</text>
            <text x="40" y="77" text-anchor="middle" font-family="'Montserrat',sans-serif" font-size="5" font-weight="600" letter-spacing="1" fill="rgba(201,168,76,0.6)">S</text>
            <text x="75" y="42" text-anchor="middle" font-family="'Montserrat',sans-serif" font-size="5" font-weight="600" letter-spacing="1" fill="rgba(201,168,76,0.6)">E</text>
            <text x="5" y="42" text-anchor="middle" font-family="'Montserrat',sans-serif" font-size="5" font-weight="600" letter-spacing="1" fill="rgba(201,168,76,0.6)">W</text>
          </svg>
        </div>
      </div>

      <p class="overline-text" :class="{ 'hero-text-in': revealed }" style="transition-delay: 0.2s;">
        Ningaloo Reef · Western Australia
      </p>

      <h1 class="hero-title" :class="{ 'hero-text-in': revealed }">
        <span style="transition-delay: 0.4s;" :class="{ 'hero-text-in': revealed }" class="hero-line">Expedition</span>
        <span style="transition-delay: 0.55s;" :class="{ 'hero-text-in': revealed }" class="hero-line hero-line-accent">OZ</span>
      </h1>

      <div class="gold-divider" :class="{ 'hero-text-in': revealed }" style="transition-delay: 0.7s;"></div>

      <p class="hero-subtitle" style="transition-delay: 0.8s;" :class="{ 'hero-text-in': revealed }">
        Where the world's greatest reef meets unbridled luxury
      </p>

      <div class="hero-buttons" :class="{ 'hero-text-in': revealed }" style="transition-delay: 1s;">
        <router-link to="/expeditions" class="btn-primary">
          Explore Expeditions
        </router-link>
        <router-link to="/contact" class="btn-outline">
          Check Availability
        </router-link>
      </div>
    </div>
    
    <div class="scroll-indicator-wrapper" :class="{ 'hero-text-in': revealed }" style="transition-delay: 1.2s;">
      <p class="scroll-text">Scroll to Discover</p>
      <div class="scroll-indicator"></div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  --color-navy-900: #071a2b;
  --color-gold-400: #c9a84c;
  --color-sand-100: #f8f5ef;
  --font-display: 'Cormorant Garamond', 'Playfair Display', serif;
  
  min-height: 100vh;
  min-height: 100svh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.video-container {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--color-navy-900);
}

.hero-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
  will-change: transform, opacity;
}

.video-fade-in {
  opacity: 1;
  animation: slowZoom 20s ease-out forwards;
}

.hero-video.is-buffering {
  opacity: 0.5;
}

@keyframes slowZoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.08); }
}

/* Buffering Indicator */
.buffering-indicator {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 5;
  pointer-events: none;
}

.buffering-spinner {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(201, 168, 76, 0.3);
  border-top-color: var(--color-gold-400);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.hero-overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  background: linear-gradient(
    180deg,
    rgba(7, 26, 43, 0.6) 0%,
    rgba(7, 26, 43, 0.2) 40%,
    rgba(7, 26, 43, 0.75) 100%
  );
}

.video-controls-panel {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.75rem;
  transition: all 0.5s ease;
}

.controls-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(7, 26, 43, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(201, 168, 76, 0.3);
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.control-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid rgba(201, 168, 76, 0.4);
  border-radius: 50%;
  color: var(--color-gold-400);
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background: var(--color-gold-400);
  color: var(--color-navy-900);
  border-color: var(--color-gold-400);
  transform: scale(1.1);
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.control-btn-main {
  width: 44px;
  height: 44px;
  background: rgba(201, 168, 76, 0.2);
  border-color: var(--color-gold-400);
}

.control-btn-main.is-playing {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(201, 168, 76, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(201, 168, 76, 0); }
}

.indicators-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(7, 26, 43, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(201, 168, 76, 0.2);
  border-radius: 9999px;
  padding: 0.375rem 0.75rem;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.indicator-dot:hover:not(:disabled) {
  background: rgba(201, 168, 76, 0.8);
  transform: scale(1.4);
}

.indicator-dot:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.indicator-dot.active {
  background: var(--color-gold-400);
  width: 20px;
  border-radius: 3px;
}

.indicator-dot.playing::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1px solid var(--color-gold-400);
  animation: indicatorPulse 2s ease-in-out infinite;
}

.indicator-dot.active.playing::after {
  border-radius: 6px;
}

@keyframes indicatorPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.6); opacity: 0; }
}

.video-counter {
  font-size: 0.65rem;
  color: rgba(201, 168, 76, 0.7);
  font-family: monospace;
  margin-left: 0.25rem;
}

.mobile-carousel-ui {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: linear-gradient(to top, rgba(7, 26, 43, 0.9) 0%, transparent 100%);
  pointer-events: none;
}

.mobile-carousel-ui > * {
  pointer-events: auto;
}

.swipe-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: var(--color-gold-400);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 1;
  transition: opacity 0.5s ease;
}

.swipe-hint.fade-out {
  opacity: 0;
}

.swipe-icon {
  animation: swipePulse 1.5s ease-in-out infinite;
}

@keyframes swipePulse {
  0%, 100% { transform: translateX(0); opacity: 0.6; }
  50% { transform: translateX(8px); opacity: 1; }
}

.mobile-play-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(7, 26, 43, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(201, 168, 76, 0.4);
  border-radius: 50%;
  color: var(--color-gold-400);
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
  pointer-events: auto;
}

.mobile-play-btn:active {
  transform: scale(0.95);
  background: rgba(201, 168, 76, 0.2);
}

.mobile-play-btn.is-playing {
  animation: pulse 2s ease-in-out infinite;
}

.mobile-progress {
  display: flex;
  gap: 0.375rem;
  width: 100%;
}

.mobile-progress-bar {
  flex: 1;
  height: 2px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 1px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: background 0.3s ease;
}

.mobile-progress-bar:active {
  background: rgba(201, 168, 76, 0.5);
}

.mobile-progress-bar.active {
  background: rgba(201, 168, 76, 0.3);
}

.mobile-progress-bar.completed {
  background: var(--color-gold-400);
}

.progress-fill {
  position: absolute;
  inset: 0;
  background: var(--color-gold-400);
  animation: progressFill 5s linear forwards;
}

@keyframes progressFill {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}

.mobile-counter {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
  font-family: 'Montserrat', sans-serif;
  color: var(--color-gold-400);
}

.mobile-counter .current {
  font-size: 1.25rem;
  font-weight: 600;
}

.mobile-counter .separator {
  font-size: 0.875rem;
  opacity: 0.5;
}

.mobile-counter .total {
  font-size: 0.875rem;
  opacity: 0.7;
}

.hero-content {
  position: relative;
  z-index: 20;
  text-align: center;
  padding: 0 1.5rem;
  max-width: 80rem;
  margin: 0 auto;
}

.compass-wrapper {
  opacity: 0;
  transform: scale(0.6) rotate(-180deg);
  transition: all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
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

.overline-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-gold-400);
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.hero-title {
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1;
  margin-bottom: 1rem;
  color: var(--color-sand-100);
}

.hero-line {
  display: block;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.hero-line-accent {
  color: var(--color-gold-400);
  font-style: italic;
}

.hero-subtitle {
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 300;
  font-style: italic;
  line-height: 1.6;
  max-width: 42rem;
  margin: 0 auto 2.5rem;
  color: rgba(248, 245, 239, 0.85);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.gold-divider {
  width: 60px;
  height: 1px;
  background: var(--color-gold-400);
  margin: 1.5rem auto;
  opacity: 0;
  transform: scaleX(0);
  transition: all 0.8s ease;
}

.gold-divider.hero-text-in {
  transform: scaleX(1);
}

.hero-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
}

.btn-primary,
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
  transition: all 0.3s ease;
  min-width: 200px;
}

.btn-primary {
  background: var(--color-gold-400);
  color: var(--color-navy-900);
  border: 1px solid var(--color-gold-400);
}

.btn-primary:hover {
  background: transparent;
  color: var(--color-gold-400);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(201, 168, 76, 0.3);
}

.btn-outline {
  background: transparent;
  color: var(--color-sand-100);
  border: 1px solid rgba(248, 245, 239, 0.4);
}

.btn-outline:hover {
  background: rgba(248, 245, 239, 0.1);
  border-color: var(--color-sand-100);
  transform: translateY(-2px);
}

.scroll-indicator-wrapper {
  position: absolute;
  bottom: 2rem;
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s ease;
  pointer-events: none; /* ← This fixes it */
}

.scroll-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.55rem;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--color-gold-400);
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

.hero-text-in {
  opacity: 1 !important;
  transform: none !important;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 5rem;
  }
  
  .hero-subtitle {
    font-size: 1.5rem;
  }
  
  .hero-buttons {
    flex-direction: row;
    gap: 1.5rem;
  }
  
  .btn-primary,
  .btn-outline {
    min-width: auto;
    padding: 1rem 2.5rem;
  }
  
  .overline-text {
    font-size: 0.875rem;
  }
  
  .compass-wrapper {
    margin-bottom: 2.5rem;
  }
  
  .compass-wrapper svg {
    width: 100px;
    height: 100px;
  }
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 7rem;
  }
  
  .hero-content {
    padding: 0 2rem;
  }
}

@media (min-width: 1280px) {
  .hero-title {
    font-size: 8rem;
  }
  
  .hero-subtitle {
    font-size: 1.75rem;
  }
  
  .compass-wrapper svg {
    width: 120px;
    height: 120px;
  }
}

@media (max-width: 767px) {
  .hero-section {
    min-height: 100svh;
  }
  
  .hero-content {
    padding-bottom: 10rem;
  }
  
  .scroll-indicator-wrapper {
    display: none;
  }
  
  .video-controls-panel {
    display: none;
  }
  
  .compass-wrapper svg {
    width: 60px;
    height: 60px;
  }
  
  .gold-divider {
    width: 40px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-video,
  .compass-wrapper,
  .hero-line,
  .overline-text,
  .hero-subtitle,
  .hero-buttons,
  .gold-divider,
  .scroll-indicator-wrapper {
    animation: none !important;
    transition: opacity 0.3s ease !important;
  }
  
  .compass-wrapper {
    transform: none;
    opacity: 1;
  }
  
  .hero-line,
  .overline-text,
  .hero-subtitle,
  .hero-buttons {
    transform: none;
    opacity: 1;
  }
  
  .video-fade-in {
    animation: none;
    opacity: 1;
  }
}

@media (max-width: 767px) and (orientation: landscape) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .compass-wrapper {
    margin-bottom: 1rem;
  }
  
  .hero-buttons {
    flex-direction: row;
    gap: 0.75rem;
  }
  
  .btn-primary,
  .btn-outline {
    padding: 0.625rem 1.25rem;
    min-width: auto;
    font-size: 0.65rem;
  }
  
  .hero-content {
    padding-bottom: 6rem;
  }
}
</style>