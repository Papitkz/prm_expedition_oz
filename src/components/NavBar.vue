<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const scrolled = ref(false)
const mobileOpen = ref(false)

function handleScroll() {
  scrolled.value = window.scrollY > 60
}

onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))

const navLinks = [
  { label: 'Expeditions', to: '/expeditions' },
  { label: 'Sylvia – 4 Day', to: '/expeditions/sylvia' },
  { label: 'Millenium – 7 Day', to: '/expeditions/millenium' },
  { label: 'About', to: '/about' },
  { label: 'FAQ', to: '/faq' },
]

function navigate(to: string) {
  mobileOpen.value = false
  router.push(to)
}
</script>

<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
    :class="scrolled ? 'nav-scrolled' : 'nav-transparent'"
  >
    <div class="container mx-auto px-6 lg:px-12">
      <div class="flex items-center justify-between h-20 lg:h-24">
        <router-link to="/" class="logo-link flex flex-col leading-none">
          <span class="font-display text-2xl lg:text-3xl font-light tracking-widest text-gold-400" style="color: var(--color-gold-400); font-family: var(--font-display);">
            EXPEDITION
          </span>
          <span class="font-heading text-xs font-300 tracking-widest text-sand-100 opacity-80" style="letter-spacing: 0.35em; font-family: var(--font-heading); color: var(--color-sand-100); font-size: 0.55rem;">
            OZ &nbsp;·&nbsp; LUXURY MEETS NATURE
          </span>
        </router-link>

        <nav class="hidden lg:flex items-center gap-8">
          <router-link
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="nav-link font-heading text-xs font-500 tracking-wider uppercase"
            style="font-family: var(--font-heading); font-size: 0.65rem; letter-spacing: 0.18em; font-weight: 500;"
          >
            {{ link.label }}
          </router-link>
          <router-link to="/contact" class="btn-primary ml-4" style="padding: 10px 24px; font-size: 0.62rem;">
            Check Availability
          </router-link>
        </nav>

        <button
          class="lg:hidden flex flex-col gap-1.5 p-2 z-50"
          @click="mobileOpen = !mobileOpen"
          aria-label="Toggle menu"
        >
          <span class="hamburger-line" :class="{ 'rotate-45 translate-y-2': mobileOpen }" />
          <span class="hamburger-line" :class="{ 'opacity-0': mobileOpen }" />
          <span class="hamburger-line" :class="{ '-rotate-45 -translate-y-2': mobileOpen }" />
        </button>
      </div>
    </div>
  </header>

  <div class="mobile-menu" :class="{ 'mobile-menu-open': mobileOpen }">
    <div class="flex flex-col items-center justify-center h-full gap-8">
      <router-link
        to="/"
        class="font-display text-4xl font-light mobile-nav-link"
        style="font-family: var(--font-display); color: var(--color-sand-100);"
        @click="navigate('/')"
      >
        Home
      </router-link>
      <router-link
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="font-display text-3xl font-light mobile-nav-link"
        style="font-family: var(--font-display); color: var(--color-sand-100);"
        @click="navigate(link.to)"
      >
        {{ link.label }}
      </router-link>
      <button class="btn-primary mt-4" @click="navigate('/contact')">
        Check Availability
      </button>
    </div>
  </div>

  <!-- Copyright Notice -->
  <div class="copyright-notice">
    ©2026 Expedition Drenche, AUS
  </div>
</template>

<style scoped>
.nav-transparent {
  background: linear-gradient(to bottom, rgba(7, 26, 43, 0.85) 0%, transparent 100%);
}

.nav-scrolled {
  background: rgba(7, 26, 43, 0.97);
  border-bottom: 1px solid rgba(201, 168, 76, 0.2);
  backdrop-filter: blur(12px);
}

.logo-link {
  text-decoration: none;
}

.nav-link {
  color: rgba(248, 245, 239, 0.85);
  text-decoration: none;
  position: relative;
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-gold-400);
  transition: width 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-gold-400);
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.hamburger-line {
  display: block;
  width: 24px;
  height: 1.5px;
  background: var(--color-sand-100);
  transition: all 0.3s ease;
}

.mobile-menu {
  position: fixed;
  inset: 0;
  background: rgba(7, 26, 43, 0.98);
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateX(100%);
  transition: transform 0.4s cubic-bezier(0.77, 0, 0.175, 1);
}

.mobile-menu-open {
  transform: translateX(0);
}

.mobile-nav-link {
  text-decoration: none;
  opacity: 0.85;
  transition: color 0.3s ease, opacity 0.3s ease;
}

.mobile-nav-link:hover {
  color: var(--color-gold-400) !important;
  opacity: 1;
}

.copyright-notice {
  position: fixed;
  bottom: 16px;
  right: 16px;
  font-family: var(--font-heading);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: rgba(248, 245, 239, 0.6);
  z-index: 50;
  pointer-events: none;
}
</style>