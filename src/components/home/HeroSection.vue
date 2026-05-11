<script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { useComponentCMS } from '@/composables/useComponentCMS'
  import NoImagePlaceholder from '@/components/NoImagePlaceholder.vue'

  const cms = useComponentCMS('HeroSection')
  const router = useRouter()

  const videos = computed(() =>
    cms.getSection('heroVideos').map((item) => ({
      videoUrl: item.imageUrl || '',
      alt: item.alt || '',
      hasVideo: !!item.imageUrl,
    }))
  )

  // Advanced video carousel state
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
  const videoRef = ref<HTMLVideoElement | null>(null)

  let resizeObserver: ResizeObserver | null = null
  let playAttemptInterval: number | null = null
  let transitionTimeout: number | null = null

  onMounted(async () => {
    await cms.load()
    checkMobile()
    
    resizeObserver = new ResizeObserver(() => {
      checkMobile()
    })
    resizeObserver.observe(document.body)

    // Initialize video
    if (videoRef.value && videos.value[0]?.hasVideo) {
      videoRef.value.src = videos.value[0].videoUrl
      videoRef.value.load()
      forcePlay()
    }
    
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

  // Mobile detection
  const checkMobile = () => {
    isMobile.value = window.innerWidth < 768
  }

  // Computed video properties
  const currentVideoUrl = computed(() => videos.value[currentVideoIndex.value]?.videoUrl || '')
  const nextVideoIndex = computed(() => (currentVideoIndex.value + 1) % videos.value.length)
  const prevVideoIndex = computed(() => currentVideoIndex.value === 0 ? videos.value.length - 1 : currentVideoIndex.value - 1)
  const hasMultipleVideos = computed(() => videos.value.length > 1)

  // Preload video
  const preloadVideo = (url: string) => {
    const video = document.createElement('video')
    video.src = url
    video.preload = 'auto'
    video.muted = true
    video.load()
  }

  // Force play with error handling
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

  // Smooth video transition
  const switchVideo = (newIndex: number) => {
    if (isTransitioning.value || newIndex === currentVideoIndex.value || !videoRef.value || !videos.value[newIndex]?.hasVideo) return
    
    isTransitioning.value = true
    isBuffering.value = true
    
    // Fade out current
    videoRef.value.style.opacity = '0.3'
    
    transitionTimeout = window.setTimeout(() => {
      // Update index
      currentVideoIndex.value = newIndex
      
      // Set new source
      videoRef.value!.src = videos.value[newIndex].videoUrl
      videoRef.value!.load()
      
      const onCanPlay = () => {
        videoRef.value!.removeEventListener('canplaythrough', onCanPlay)
        videoRef.value!.style.opacity = '1'
        forcePlay()
        isTransitioning.value = false
        isBuffering.value = false
        
        // Preload next video
        if (videos.value[nextVideoIndex.value]?.hasVideo) {
          preloadVideo(videos.value[nextVideoIndex.value].videoUrl)
        }
      }
      
      videoRef.value!.addEventListener('canplaythrough', onCanPlay)
      setTimeout(() => {
        if (isTransitioning.value) {
          onCanPlay()
        }
      }, 3000)
      
    }, 300)
  }

  const nextVideo = () => switchVideo(nextVideoIndex.value)
  const prevVideo = () => switchVideo(prevVideoIndex.value)
  const goToVideo = (index: number) => switchVideo(index)

  const togglePlayPause = () => {
    isPlaying.value = !isPlaying.value
    if (isPlaying.value) {
      forcePlay()
    } else {
      videoRef.value?.pause()
    }
  }

  const handleVideoEnded = () => {
    if (hasMultipleVideos.value) {
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

  const onVideoLoaded = () => {
    videoLoaded.value = true
    if (videoRef.value) {
      videoRef.value.style.opacity = '1'
    }
  }

  const onVideoError = () => {
    videoError.value = true
    setTimeout(() => {
      if (videoError.value && hasMultipleVideos.value) nextVideo()
    }, 2000)
  }

  const handleVisibilityChange = () => {
    if (!document.hidden && isPlaying.value) {
      forcePlay()
    }
  }
</script>

<template>
  <section 
    class="relative h-screen w-full overflow-hidden hero-section"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- Video Background with Carousel -->
    <div class="absolute inset-0 z-0">
      <div class="video-container">
        <video
          v-if="videos[0]?.hasVideo"
          ref="videoRef"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
          class="w-full h-full object-cover video-hero"
          :class="{ 
            'video-fade-in': videoLoaded,
            'is-buffering': isBuffering
          }"
          @loadeddata="onVideoLoaded"
          @ended="handleVideoEnded"
          @error="onVideoError"
          @waiting="isBuffering = true"
          @playing="isBuffering = false"
        >
          <source :src="currentVideoUrl" type="video/mp4">
        </video>
        
        <!-- Fallback -->
        <div v-else class="w-full h-full">
          <NoImagePlaceholder label="No Hero Video" class="w-full h-full" />
        </div>

        <!-- Buffering Indicator -->
        <div v-if="isBuffering" class="buffering-indicator">
          <div class="buffering-spinner"></div>
        </div>
      </div>

      <!-- Overlays -->
      <div class="absolute inset-0 bg-[#0A2E4A]/60" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/70" />
    </div>

    <!-- Mobile Carousel UI -->
    <div v-if="isMobile && hasMultipleVideos" class="mobile-carousel-ui">
      <div class="swipe-hint">
        <div class="swipe-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </div>
        <span>Swipe to explore</span>
      </div>

      <button 
        @click="togglePlayPause"
        class="mobile-play-btn"
        :class="{ 'is-playing': isPlaying }"
        :aria-label="isPlaying ? 'Pause video' : 'Play video'"
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
            'completed': index < currentVideoIndex,
            'has-video': video.hasVideo
          }"
          @click="goToVideo(index)"
        >
          <div v-if="index === currentVideoIndex && isPlaying && !isBuffering && video.hasVideo" class="progress-fill"></div>
        </div>
      </div>

      <div class="mobile-counter">
        <span class="current">{{ String(currentVideoIndex + 1).padStart(2, '0') }}</span>
        <span class="separator">/</span>
        <span class="total">{{ String(videos.length).padStart(2, '0') }}</span>
      </div>
    </div>

    <!-- Desktop Controls -->
    <div 
      v-else-if="hasMultipleVideos"
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
          @click="togglePlayPause"
          class="control-btn control-btn-main"
          :class="{ 'is-playing': isPlaying }"
          :aria-label="isPlaying ? 'Pause video' : 'Play video'"
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

      <div class="indicators-row">
        <button
          v-for="(video, index) in videos"
          :key="index"
          @click="goToVideo(index)"
          class="indicator-dot"
          :class="{ 
            'active': index === currentVideoIndex,
            'playing': index === currentVideoIndex && isPlaying && !isBuffering && video.hasVideo
          }"
          :disabled="isTransitioning || !video.hasVideo"
          :aria-label="`Go to video ${index + 1}`"
        />
        <span class="video-counter">
          {{ currentVideoIndex + 1 }}/{{ videos.length }}
        </span>
      </div>
    </div>

    <!-- Play/Pause Toggle (Single video fallback) -->
    <button
      v-else-if="videos[0]?.hasVideo"
      @click="togglePlayPause"
      class="absolute bottom-4 md:bottom-8 right-4 md:right-8 z-10 flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 group"
      :aria-label="isPlaying ? 'Pause video' : 'Play video'"
    >
      <svg v-if="isPlaying" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="md:w-5 md:h-5">
        <rect x="6" y="4" width="4" height="16" rx="1" />
        <rect x="14" y="4" width="4" height="16" rx="1" />
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="md:w-5 md:h-5 ml-0.5">
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>

    <!-- Main Content -->
    <div class="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6">
      <div class="max-w-5xl mx-auto">
        <p class="overline-text mb-3 md:mb-6 text-xs md:text-sm tracking-[0.3em] text-white/90">Western Australia</p>
        <h1 class="font-display text-5xl md:text-7xl lg:text-9xl font-light text-white mb-4 md:mb-6 hero-title" style="font-family: var(--font-display);">
          Expedition <span class="italic text-[#C9A84C]" style="color: var(--color-gold-400);">OZ</span>
        </h1>
        <p class="font-display text-lg md:text-2xl lg:text-3xl italic text-[#C9A84C] mb-4 md:mb-8" style="font-family: var(--font-display);">
          Luxury Live-Aboard at Ningaloo Reef
        </p>
        <p class="max-w-2xl mx-auto text-sm md:text-lg text-white/80 mb-6 md:mb-10 font-light leading-relaxed px-2">
          Immerse yourself in the pristine waters of Western Australia's crown jewel. Whale sharks, untouched coral gardens, and world-class luxury await.
        </p>
        <div class="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <router-link to="/expeditions" class="btn-primary px-6 py-3 md:px-10 md:py-4 text-sm md:text-base">
            Explore Expeditions
          </router-link>
          <button @click="router.push('/contact')" class="btn-outline px-6 py-3 md:px-10 md:py-4 text-sm md:text-base">
            Book Your Adventure
          </button>
        </div>
      </div>
    </div>

    <!-- Scroll Indicators -->
    <div class="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
        <path d="M12 5v14M19 12l-7 7-7-7"/>
      </svg>
    </div>

    <div class="absolute bottom-4 md:bottom-8 left-4 md:left-8 z-10 hidden md:block">
      <p class="text-[0.55rem] md:text-xs uppercase tracking-[0.2em] text-white/50">Scroll to explore</p>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  min-height: 100dvh;
}

.video-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-hero {
  transition: opacity 1.5s ease;
  will-change: transform, opacity;
}

.video-fade-in {
  opacity: 1;
  animation: slowZoom 20s ease-out forwards;
}

.video-hero.is-buffering {
  opacity: 0.5;
}

@keyframes slowZoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.08); }
}

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
  border-top-color: #C9A84C;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Desktop Controls */
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
  background: rgba(10, 46, 74, 0.8);
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
  color: #C9A84C;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background: #C9A84C;
  color: #0A2E4A;
  border-color: #C9A84C;
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
  border-color: #C9A84C;
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
  background: rgba(10, 46, 74, 0.6);
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
  background: #C9A84C;
  width: 20px;
  border-radius: 3px;
}

.indicator-dot.playing::after {
  content: '';
  position: absolute;
  inset: -3px;
  border-radius: 50%;
  border: 1px solid #C9A84C;
  animation: indicatorPulse 2s ease-in-out infinite;
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

/* Mobile Controls */
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
  background: linear-gradient(to top, rgba(10, 46, 74, 0.9) 0%, transparent 100%);
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
  color: #C9A84C;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
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
  background: rgba(10, 46, 74, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(201, 168, 76, 0.4);
  border-radius: 50%;
  color: #C9A84C;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 0 auto;
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
  background: #C9A84C;
}

.mobile-progress-bar:not(.has-video) {
  opacity: 0.3;
  cursor: not-allowed;
}

.progress-fill {
  position: absolute;
  inset: 0;
  background: #C9A84C;
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
  color: #C9A84C;
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

.hero-title {
  line-height: 0.9;
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-12px); }
}

.animate-bounce {
  animation: bounce 2.5s ease-in-out infinite;
}

@media (max-width: 767px) {
  .video-controls-panel {
    display: none;
  }
}
</style>