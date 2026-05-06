<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLenis } from '@/composables/useLenis'
import NavBar from '@/components/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'
import CompassLoader from '@/components/CompassLoader.vue'

useLenis()

const router = useRouter()
const route = useRoute()
const loaderRef = ref<InstanceType<typeof CompassLoader> | null>(null)
const isLoading = ref(false)
const showContent = ref(true)
const initialLoadDone = ref(false)
const showScrollTop = ref(false)

const isAdminRoute = computed(() => route.path.startsWith('/admin'))

// --- DevTools Detection State ---
const devToolsOpen = ref(false)
const devToolsWarning = ref(false)
let devToolsCheckInterval: ReturnType<typeof setInterval> | null = null
let debuggerCheckInterval: ReturnType<typeof setInterval> | null = null

// --- Cursor Effects State ---
const cursorEffectsEnabled = ref(true)

// Listen for toggle from NavBar
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

// --- DevTools Detection Methods ---

// Method 1: Window size comparison (detects docked DevTools)
const detectDevToolsBySize = () => {
  const threshold = 160
  const widthThreshold = window.outerWidth - window.innerWidth > threshold
  const heightThreshold = window.outerHeight - window.innerHeight > threshold
  
  if (widthThreshold || heightThreshold) {
    return true
  }
  return false
}

// Method 2: Console detection via debugger timing
const detectDevToolsByDebugger = () => {
  const start = performance.now()
  debugger
  const end = performance.now()
  return (end - start) > 100
}

// Method 3: Firebug/Firefox DevTools detection
const detectDevToolsByFirebug = () => {
  return !!(window as any).Firebug && (window as any).Firebug.chrome && (window as any).Firebug.chrome.isInitialized
}

// Method 4: Console proxy detection
const detectDevToolsByConsole = () => {
  const element = new Image()
  let devtoolsOpen = false
  
  Object.defineProperty(element, 'id', {
    get: () => {
      devtoolsOpen = true
      return 'devtools'
    }
  })
  
  console.log('%c', element)
  return devtoolsOpen
}

// Method 5: Performance timing (detects breakpoint pauses)
const detectDevToolsByPerformance = () => {
  const start = Date.now()
  for (let i = 0; i < 1000; i++) {
    // Empty loop that takes negligible time unless paused in debugger
  }
  const end = Date.now()
  return (end - start) > 200
}

// Combined detection
const checkDevTools = () => {
  // Skip if already warning
  if (devToolsWarning.value) return

  const isOpen = detectDevToolsBySize() || 
                 detectDevToolsByFirebug() || 
                 detectDevToolsByConsole() ||
                 detectDevToolsByPerformance()

  if (isOpen && !devToolsOpen.value) {
    devToolsOpen.value = true
    triggerDevToolsWarning()
  } else if (!isOpen) {
    devToolsOpen.value = false
    devToolsWarning.value = false
  }
}

// Aggressive anti-debugging
const aggressiveAntiDebug = () => {
  if (devToolsWarning.value) return
  
  // Method: Continuous debugger statements
  const check = () => {
    const start = performance.now()
    debugger
    const end = performance.now()
    
    if (end - start > 100) {
      triggerDevToolsWarning()
    }
    
    if (!devToolsWarning.value) {
      requestAnimationFrame(check)
    }
  }
  
  // Multiple overlapping checks
  setInterval(() => {
    const start = performance.now()
    debugger
    if (performance.now() - start > 100) {
      triggerDevToolsWarning()
    }
  }, 100)
  
  check()
}

// Trigger warning overlay
const triggerDevToolsWarning = () => {
  devToolsWarning.value = true
  
  // Optional: Clear sensitive data from memory
  clearSensitiveData()
  
  // Optional: Redirect or reload after delay
  setTimeout(() => {
    // Uncomment to force reload:
    // window.location.reload()
    
    // Or redirect to home:
    // router.push('/')
  }, 3000)
}

// Clear any sensitive data from memory
const clearSensitiveData = () => {
  // Add your sensitive state cleanup here
  // Example: userStore.clearSensitiveData()
}

// Block keyboard shortcuts
const blockDevToolsShortcuts = (e: KeyboardEvent) => {
  // F12
  if (e.key === 'F12') {
    e.preventDefault()
    e.stopPropagation()
    triggerDevToolsWarning()
    return false
  }
  
  // Ctrl+Shift+I / Cmd+Option+I
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
    e.preventDefault()
    e.stopPropagation()
    triggerDevToolsWarning()
    return false
  }
  
  // Ctrl+Shift+J / Cmd+Option+J
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
    e.preventDefault()
    e.stopPropagation()
    triggerDevToolsWarning()
    return false
  }
  
  // Ctrl+Shift+C / Cmd+Option+C
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
    e.preventDefault()
    e.stopPropagation()
    triggerDevToolsWarning()
    return false
  }
  
  // Ctrl+U (View Source)
  if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 'U')) {
    e.preventDefault()
    e.stopPropagation()
    return false
  }
  
  // Ctrl+S (Save Page) - optional
  if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
    e.preventDefault()
    e.stopPropagation()
    return false
  }
}

// Block right-click context menu (Inspect Element)
const blockContextMenu = (e: MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
  return false
}

// --- Existing App Logic ---

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
  
  // --- Initialize DevTools Protection ---
  // Option 1: Passive checking (recommended for UX)
  devToolsCheckInterval = setInterval(checkDevTools, 1000)
  
  // Option 2: Aggressive anti-debugging (uncomment for maximum security, may impact performance)
  // aggressiveAntiDebug()
  
  // Block shortcuts - CAPTURE PHASE to catch before anything else
  document.addEventListener('keydown', blockDevToolsShortcuts, true)
  
  // Block right-click context menu (Inspect Element) - CAPTURE PHASE
  document.addEventListener('contextmenu', blockContextMenu, true)
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
  window.removeEventListener('toggleCursorEffects', handleToggleCursorEffects as EventListener)
  
  window.removeEventListener('mousemove', handleMouseMove)
  window.removeEventListener('resize', resizeCanvas)
  if (animationFrameId) {
    window.cancelAnimationFrame(animationFrameId)
  }
  
  // Cleanup DevTools detection
  if (devToolsCheckInterval) clearInterval(devToolsCheckInterval)
  if (debuggerCheckInterval) clearInterval(debuggerCheckInterval)
  document.removeEventListener('keydown', blockDevToolsShortcuts, true)
  document.removeEventListener('contextmenu', blockContextMenu, true)
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
  <v-app theme="expeditionDark">
    <!-- DevTools Warning Overlay -->
    <Transition name="warning-fade">
      <div v-if="devToolsWarning" class="devtools-warning">
        <div class="warning-content">
          <div class="warning-icon">⚠️</div>
          <h2>Developer Tools Detected</h2>
          <p>For privacy and security reasons, developer tools are not permitted on this platform.</p>
          <p class="warning-sub">Please close DevTools to continue browsing.</p>
          <div class="warning-loader"></div>
        </div>
      </div>
    </Transition>

    <!-- Ripple Canvas -->
    <canvas
      v-show="cursorEffectsEnabled && !devToolsWarning && !isAdminRoute"
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

    <div v-show="showContent && !devToolsWarning && !isAdminRoute" class="content-wrapper">
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
/* --- DevTools Warning Styles --- */
.devtools-warning {
  position: fixed;
  inset: 0;
  background: var(--color-ocean-950, #071a2b);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.warning-content {
  text-align: center;
  max-width: 500px;
  color: var(--color-gold-400, #c9a84c);
}

.warning-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  animation: pulse 2s infinite;
}

.warning-content h2 {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.warning-content p {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.warning-sub {
  font-size: 0.875rem;
  opacity: 0.7;
  font-style: italic;
}

.warning-loader {
  width: 60px;
  height: 4px;
  background: rgba(201, 168, 76, 0.2);
  border-radius: 2px;
  margin: 2rem auto 0;
  overflow: hidden;
  position: relative;
}

.warning-loader::after {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: var(--color-gold-400, #c9a84c);
  animation: loading-slide 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

@keyframes loading-slide {
  0% { left: -100%; }
  100% { left: 100%; }
}

.warning-fade-enter-active,
.warning-fade-leave-active {
  transition: opacity 0.5s ease;
}

.warning-fade-enter-from,
.warning-fade-leave-to {
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

/* --- Existing Styles --- */
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
  .loader-fade-leave-active,
  .warning-icon,
  .warning-loader::after {
    transition: none;
    animation: none;
  }
}
</style>