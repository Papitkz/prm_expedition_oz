<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLenis } from '@/composables/useLenis'
import NavBar from '@/components/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'
import CompassLoader from '@/components/CompassLoader.vue'

useLenis()

const router = useRouter()
const loaderRef = ref<InstanceType<typeof CompassLoader> | null>(null)
const isLoading = ref(false)

// Scroll to top button logic
const showScrollTop = ref(false)

const checkScroll = () => {
  showScrollTop.value = window.scrollY > 400
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  window.addEventListener('scroll', checkScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})

router.beforeEach((to, from, next) => {
  if (to.path === from.path) {
    return next()
  }

  isLoading.value = true

  next()
})

router.afterEach(async () => {
  // Wait for DOM update
  await nextTick()
  
  // Small delay to ensure Lenis/other scroll libraries are done
  requestAnimationFrame(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })

  // Wait for new page to mount
  await nextTick()

  // Small delay to ensure content is rendered
  setTimeout(() => {
    loaderRef.value?.hide()

    // Reset loading state after transition completes
    setTimeout(() => {
      isLoading.value = false
    }, 750)
  }, 700)
})
</script>

<template>
  <v-app theme="expeditionDark">
    <!-- Global Compass Loader -->
    <CompassLoader 
      v-if="isLoading" 
      ref="loaderRef" 
      key="compass-loader"
    />

    <NavBar />

    <!-- Main Content - Scrolls OVER the fixed footer -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- FIXED FOOTER - Always at bottom, content scrolls over it -->
    <FooterSection class="fixed-footer" />

    <!-- Scroll to Top Button - Bottom Right (above footer) -->
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
        <span class="scroll-top-text">Top</span>
      </button>
    </transition>
  </v-app>
</template>

<style scoped>
/* Main content - sits on top of footer */
.main-content {
  position: relative;
  z-index: 2; /* ABOVE footer */
  background: var(--color-ocean-950, #071a2b);
  /* Add margin bottom so you can scroll past content to see footer */
  margin-bottom: 400px; /* Match footer height */
}

@media (max-width: 768px) {
  .main-content {
    margin-bottom: 600px; /* Larger footer on mobile */
  }
}

@media (max-width: 480px) {
  .main-content {
    margin-bottom: 700px; /* Even larger on small mobile */
  }
}

/* FIXED FOOTER - Always at bottom, behind content */
.fixed-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1; /* BEHIND content */
}

/* Scroll to Top Button - Bottom Right */
.scroll-top-btn {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 100; /* Above everything */
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

.scroll-top-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Transition animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .scroll-top-btn {
    bottom: 1.5rem;
    right: 1.5rem;
    padding: 0.625rem 0.875rem;
  }

  .scroll-top-text {
    display: none;
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .scroll-top-btn {
    transition: none;
  }
}
</style>