<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
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
  
  // 2 SECONDS for initial / route load
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
  window.addEventListener('scroll', checkScroll, { passive: true })
  handleInitialLoad()
})

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll)
})

watch(() => route.path, (newPath) => {
  if (newPath === '/' && !initialLoadDone.value && !isLoading.value) {
    handleInitialLoad()
  }
})

router.beforeEach((to, from, next) => {
  if (to.path === from.path) return next()

  // Show loader for route transitions (not initial)
  if (initialLoadDone.value) {
    isLoading.value = true
    showContent.value = false
  }
  
  next()
})

router.afterEach(async () => {
  await nextTick()

  if (isLoading.value) {
    // 1 SECOND for other route transitions
    setTimeout(() => {
      loaderRef.value?.hide()
      setTimeout(() => {
        showContent.value = true
        isLoading.value = false
      }, 500)
    }, 1000)
  }
})
</script>

<template>
  <v-app theme="expeditionDark">
    <Transition name="loader-fade">
      <div v-if="isLoading" class="loader-overlay">
        <CompassLoader 
          ref="loaderRef" 
          key="compass-loader"
        />
      </div>
    </Transition>

    <div v-show="showContent" class="content-wrapper">
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
          <span class="scroll-top-text">Top</span>
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
  bottom: 2rem;
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

.scroll-top-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
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

@media (prefers-reduced-motion: reduce) {
  .scroll-top-btn,
  .loader-fade-leave-active {
    transition: none;
  }
}
</style>