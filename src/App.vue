<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLenis } from '@/composables/useLenis'
import { useTheme } from '@/composables/useTheme'
import NavBar from '@/components/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'
import CompassLoader from '@/components/CompassLoader.vue'

useLenis()

const router = useRouter()
const route = useRoute()
const { currentTheme } = useTheme()
const loaderRef = ref<InstanceType<typeof CompassLoader> | null>(null)
const isLoading = ref(false)
const showContent = ref(true)
const initialLoadDone = ref(false)
const showScrollTop = ref(false)

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const isPreviewMode = computed(() => route.query.preview === 'true')

function exitPreviewMode() {
  const url = new URL(window.location.href)
  url.searchParams.delete('preview')
  window.location.href = url.toString()
}

// --- Cursor Effects State ---
const cursorEffectsEnabled = ref(true)

const handleToggleCursorEffects = (e: CustomEvent) => {
  cursorEffectsEnabled.value = e.detail.enabled
}

// --- Ripple Effect Logic ---
const canvasRef = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let animationFrameId: number | null = null
const ripples: any[] = []

const rippleSettings = {
  maxSize: 100,
  animationSpeed: 4,
  strokeColor: [201, 168, 76],
}

const canvasSettings = {
  blur: 10,
  ratio: 1,
}

class Coords {
  x: number | null
  y: number | null
  constructor(x: number | null = null, y: number | null = null) {
    this.x = x
    this.y = y
  }
}

class Ripple {
  position: Coords
  circleSize: number
  maxSize: number
  opacity: number
  ctx: CanvasRenderingContext2D
  strokeColor: string
  animationSpeed: number
  opacityStep: number

  constructor(x: number, y: number, circleSize: number, context: CanvasRenderingContext2D) {
    this.position = new Coords(x, y)
    this.circleSize = circleSize
    this.maxSize = rippleSettings.maxSize
    this.opacity = 1
    this.ctx = context
    this.strokeColor = `rgba(${Math.floor(rippleSettings.strokeColor[0])}, ${Math.floor(rippleSettings.strokeColor[1])}, ${Math.floor(rippleSettings.strokeColor[2])}, ${this.opacity})`
    this.animationSpeed = rippleSettings.animationSpeed
    this.opacityStep = (this.animationSpeed / (this.maxSize - circleSize)) / 2
  }

  update() {
    this.circleSize += this.animationSpeed
    this.opacity -= this.opacityStep
    this.strokeColor = `rgba(${Math.floor(rippleSettings.strokeColor[0])}, ${Math.floor(rippleSettings.strokeColor[1])}, ${Math.floor(rippleSettings.strokeColor[2])}, ${this.opacity})`
  }

  draw() {
    this.ctx.beginPath()
    this.ctx.strokeStyle = this.strokeColor
    this.ctx.lineWidth = 2
    this.ctx.arc(this.position.x!, this.position.y!, this.circleSize, 0, 2 * Math.PI)
    this.ctx.stroke()
  }
}

const checkScroll = () => {
  showScrollTop.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const handleInitialLoad = async () => {
  if (route.path !== '/' || initialLoadDone.value) return

  isLoading.value = true
  showContent.value = false

  await nextTick()

  setTimeout(() => {
    loaderRef.value?.hide()

    setTimeout(() => {
      showContent.value = true
      isLoading.value = false
      initialLoadDone.value = true
    }, 500)
  }, 2000)
}

onMounted(() => {
  // Check localStorage first
  const saved = localStorage.getItem('cursorEffects')
  if (saved !== null) {
    cursorEffectsEnabled.value = saved === 'true'
  }

  window.addEventListener('scroll', checkScroll, { passive: true })
  window.addEventListener('toggleCursorEffects', handleToggleCursorEffects as EventListener)
  handleInitialLoad()

  // Initialize Canvas Ripple Effect
  initCanvas()
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
  window.removeEventListener('toggleCursorEffects', handleToggleCursorEffects as EventListener)

  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', resizeCanvas)
  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId)
  }
})

watch(() => route.path, (newPath) => {
  if (newPath === '/' && !initialLoadDone.value && !isLoading.value) {
    handleInitialLoad()
  }
})

router.beforeEach((to, from, next) => {
  if (to.path === from.path) return next()

  if (initialLoadDone.value) {
    isLoading.value = true
    showContent.value = false
  }

  next()
})

router.afterEach(async () => {
  await nextTick()

  if (isLoading.value) {
    setTimeout(() => {
      loaderRef.value?.hide()
      setTimeout(() => {
        showContent.value = true
        isLoading.value = false
      }, 500)
    }, 1000)
  }
})

// Ripple Functions
const initCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  ctx = canvas.getContext('2d')
  if (!ctx) return

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  animateRipples()
}

const resizeCanvas = () => {
  const canvas = canvasRef.value
  if (!canvas) return

  const width = window.innerWidth
  const height = window.innerHeight

  canvas.width = width * canvasSettings.ratio
  canvas.height = height * canvasSettings.ratio
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`
}

const handleMouseMove = (e: MouseEvent) => {
  if (!ctx || !cursorEffectsEnabled.value) return

  const x = e.clientX * canvasSettings.ratio
  const y = e.clientY * canvasSettings.ratio
  ripples.unshift(new Ripple(x, y, 2, ctx))

  if (ripples.length > 50) {
    ripples.pop()
  }
}

const animateRipples = () => {
  if (!ctx || !canvasRef.value) return

  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

  if (!cursorEffectsEnabled.value) {
    animationFrameId = window.requestAnimationFrame(animateRipples)
    return
  }

  const length = ripples.length
  for (let i = length - 1; i >= 0; i--) {
    const r = ripples[i]
    r.update()
    r.draw()

    if (r.opacity <= 0) {
      ripples[i] = null
      ripples.splice(i, 1)
    }
  }

  animationFrameId = window.requestAnimationFrame(animateRipples)
}
</script>

<template>
  <v-app :theme="currentTheme">
    <!-- Ripple Canvas -->
    <canvas
      v-show="cursorEffectsEnabled && !isAdminRoute"
      ref="canvasRef"
      class="ripple-canvas"
      :style="{ filter: `blur(${canvasSettings.blur}px)` }"
    ></canvas>

    <Transition name="loader-fade">
      <div v-if="isLoading" class="loader-overlay">
        <CompassLoader
          ref="loaderRef"
          key="compass-loader"
        />
      </div>
    </Transition>

    <!-- Admin routes get a clean layout without nav/footer -->
    <div v-if="isAdminRoute" class="admin-wrapper">
      <router-view />
    </div>

    <!-- Preview Mode Banner -->
    <Transition name="preview-slide">
      <div v-if="isPreviewMode && !isAdminRoute" class="preview-banner">
        <div class="preview-banner-content">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          <span>Preview Mode - Viewing draft content</span>
          <button @click="exitPreviewMode" class="preview-exit-btn">Exit Preview</button>
        </div>
      </div>
    </Transition>

    <div v-show="showContent && !isAdminRoute" class="content-wrapper">
      <NavBar />
      <main class="main-content">
        <router-view />
      </main>
      <FooterSection class="fixed-footer" />

      <transition name="fade-slide">
        <button
          v-show="showScrollTop"
          @click="scrollToTop"
          class="scroll-top-btn"
          aria-label="Scroll to top"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="18,15 12,9 6,15"></polyline>
          </svg>
        </button>
      </transition>
    </div>
  </v-app>
</template>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  background: var(--color-ocean-950, #071a2b);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-wrapper {
  position: relative;
  width: 100%;
  min-height: 100vh;
}

.main-content {
  position: relative;
  z-index: 2;
  background: var(--color-ocean-950, #071a2b);
  margin-bottom: 400px;
}

@media (max-width: 768px) {
  .main-content {
    margin-bottom: 600px;
  }
}

@media (max-width: 480px) {
  .main-content {
    margin-bottom: 700px;
  }
}

.fixed-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

.scroll-top-btn {
  position: fixed;
  bottom: 3rem;
  right: 2rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(7, 26, 43, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(201, 168, 76, 0.4);
  border-radius: 50px;
  color: var(--color-gold-400, #c9a84c);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.scroll-top-btn:hover {
  background: var(--color-gold-400, #c9a84c);
  color: var(--color-navy-900, #071a2b);
  border-color: var(--color-gold-400, #c9a84c);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(201, 168, 76, 0.3);
}

.loader-fade-leave-active {
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.loader-fade-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* ============================================
   MOBILE FIX: Move scroll-to-top to bottom-left
   to avoid overlapping cursor FX toggle
   ============================================ */
@media (max-width: 768px) {
  .scroll-top-btn {
    bottom: 1.5rem;
    left: 1.5rem;
    right: auto;
    padding: 0.625rem 0.875rem;
  }

  .scroll-top-text {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-top-btn,
  .loader-fade-leave-active {
    transition: none;
    animation: none;
  }
}

/* --- Preview Mode Banner --- */
.preview-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9998;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.95) 0%, rgba(56, 142, 60, 0.95) 100%);
  padding: 0.75rem 1.5rem;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}

.preview-banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #fff;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.preview-exit-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  padding: 0.375rem 0.75rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: 1rem;
}

.preview-exit-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: #fff;
}

.preview-slide-enter-active,
.preview-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.preview-slide-enter-from,
.preview-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* --- Admin Wrapper --- */
.admin-wrapper {
  width: 100%;
  min-height: 100vh;
  background: var(--color-ocean-950, #071a2b);
}

/* --- Ripple Canvas Styles --- */
.ripple-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  pointer-events: none;
  mix-blend-mode: screen;
}

/* Light theme adjustments */
:global([data-theme="light"]) .main-content {
  background: var(--color-sand-100);
}
</style>
