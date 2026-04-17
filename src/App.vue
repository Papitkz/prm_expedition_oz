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
  window.addEventListener('scroll', checkScroll)
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
  // Wait for new page to mount
  await nextTick()
  
  // Small delay to ensure content is rendered
  setTimeout(() => {
    loaderRef.value?.hide()
    
    // Reset loading state after transition completes
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }, 300)
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
    <v-main>
      <router-view />
    </v-main>
    <FooterSection />
    
    <!-- Scroll to Top Button - Bottom Left -->
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
/* Scroll to Top Button - Bottom Left */
.scroll-top-btn {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
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
    left: 1.5rem;
    padding: 0.625rem 0.875rem;
  }
  
  .scroll-top-text {
    display: none;
  }
}
</style>