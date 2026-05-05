<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminAuth } from '@/composables/useAdminAuth'

const router = useRouter()
const { user, isAdmin } = useAdminAuth()
const scrolled = ref(false)
const mobileOpen = ref(false)

// --- Cursor Effects Toggle ---
const cursorEffectsEnabled = ref(true)

function toggleCursorEffects() {
  cursorEffectsEnabled.value = !cursorEffectsEnabled.value
  localStorage.setItem('cursorEffects', cursorEffectsEnabled.value.toString())
  // Emit event to App.vue to actually toggle the canvas
  window.dispatchEvent(new CustomEvent('toggleCursorEffects', { 
    detail: { enabled: cursorEffectsEnabled.value } 
  }))
}

// Check localStorage on mount and emit initial state
onMounted(() => {
  const saved = localStorage.getItem('cursorEffects')
  if (saved !== null) {
    cursorEffectsEnabled.value = saved === 'true'
  }
  // Emit initial state to sync App.vue on page load
  window.dispatchEvent(new CustomEvent('toggleCursorEffects', { 
    detail: { enabled: cursorEffectsEnabled.value } 
  }))
})

// --- Real-time Clock with Timezone ---
const currentTime = ref('')
const selectedTimezone = ref('Australia/Sydney') // Default to AUS time
const showTimezoneDropdown = ref(false)

const timezones = [
  { label: 'Sydney (AEDT/AEST)', value: 'Australia/Sydney' },
  { label: 'Melbourne', value: 'Australia/Melbourne' },
  { label: 'Perth', value: 'Australia/Perth' },
  { label: 'London (GMT)', value: 'Europe/London' },
  { label: 'New York (EST)', value: 'America/New_York' },
  { label: 'Los Angeles (PST)', value: 'America/Los_Angeles' },
  { label: 'Tokyo (JST)', value: 'Asia/Tokyo' },
  { label: 'Singapore', value: 'Asia/Singapore' },
  { label: 'Dubai', value: 'Asia/Dubai' },
  { label: 'Paris (CET)', value: 'Europe/Paris' },
]

let timeInterval: number | null = null

function formatTime() {
  const now = new Date()
  const formatter = new Intl.DateTimeFormat('en-AU', {
    timeZone: selectedTimezone.value,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'short'
  })
  currentTime.value = formatter.format(now)
}

function selectTimezone(timezone: string) {
  selectedTimezone.value = timezone
  showTimezoneDropdown.value = false
  formatTime() // Immediate update
}

function handleScroll() {
  scrolled.value = window.scrollY > 60
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  formatTime()
  timeInterval = window.setInterval(formatTime, 1000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (timeInterval) clearInterval(timeInterval)
})

const navLinks = [
  { label: 'Expeditions', to: '/expeditions' },
  { label: 'Sylvia – 4 Day', to: '/expeditions/sylvia' },
  { label: 'Millenium – 7 Day', to: '/expeditions/millenium' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'FAQ', to: '/faq' },
]

function navigate(to: string) {
  mobileOpen.value = false
  router.push(to)
}

// Close dropdown when clicking outside
function handleClickOutside(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.timezone-wrapper')) {
    showTimezoneDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
          <router-link
            v-if="user && isAdmin"
            to="/admin/dashboard"
            class="nav-link font-heading text-xs font-500 tracking-wider uppercase flex items-center gap-1.5"
            style="font-family: var(--font-heading); font-size: 0.65rem; letter-spacing: 0.18em; font-weight: 500; color: var(--color-gold-400);"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Admin
          </router-link>
          <router-link
            v-else
            to="/admin"
            class="nav-link font-heading text-xs font-500 tracking-wider uppercase flex items-center gap-1.5"
            style="font-family: var(--font-heading); font-size: 0.65rem; letter-spacing: 0.18em; font-weight: 500;"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Login
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
      <router-link
        v-if="user && isAdmin"
        to="/admin/dashboard"
        class="font-display text-2xl font-light mobile-nav-link flex items-center gap-2"
        style="font-family: var(--font-display); color: var(--color-gold-400);"
        @click="navigate('/admin/dashboard')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        Admin
      </router-link>
      <router-link
        v-else
        to="/admin"
        class="font-display text-2xl font-light mobile-nav-link flex items-center gap-2"
        style="font-family: var(--font-display); color: var(--color-sand-100);"
        @click="navigate('/admin')"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
          <polyline points="10 17 15 12 10 7"/>
          <line x1="15" y1="12" x2="3" y2="12"/>
        </svg>
        Login
      </router-link>
    </div>
  </div>

  <!-- Bottom Controls Bar -->
  <div class="bottom-controls">
    <!-- Cursor Effects Toggle -->
    <button 
      class="control-btn cursor-toggle" 
      @click="toggleCursorEffects"
      :class="{ 'active': cursorEffectsEnabled }"
      :title="cursorEffectsEnabled ? 'Disable cursor effects' : 'Enable cursor effects'"
    >
      <svg v-if="cursorEffectsEnabled" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 1v6m0 6v6m4.22-10.22l4.24-4.24M6.34 17.66l-4.24 4.24M23 12h-6m-6 0H1m20.24 4.24l-4.24-4.24M6.34 6.34L2.1 2.1"></path>
      </svg>
      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M12 1v6m0 6v6m4.22-10.22l4.24-4.24M6.34 17.66l-4.24 4.24M23 12h-6m-6 0H1m20.24 4.24l-4.24-4.24M6.34 6.34L2.1 2.1"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
      <span class="control-label">Cursor FX</span>
    </button>

    <div class="divider"></div>

    <!-- Real-time Clock with Timezone Selector -->
    <div class="timezone-wrapper">
      <div class="clock-display" @click="showTimezoneDropdown = !showTimezoneDropdown">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12,6 12,12 16,14"></polyline>
        </svg>
        <span class="time-text">{{ currentTime }}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dropdown-arrow" :class="{ 'open': showTimezoneDropdown }">
          <polyline points="6,9 12,15 18,9"></polyline>
        </svg>
      </div>
      
      <transition name="dropdown">
        <div v-if="showTimezoneDropdown" class="timezone-dropdown">
          <div 
            v-for="tz in timezones" 
            :key="tz.value"
            class="timezone-option"
            :class="{ 'selected': selectedTimezone === tz.value }"
            @click="selectTimezone(tz.value)"
          >
            {{ tz.label }}
          </div>
        </div>
      </transition>
    </div>

    <div class="divider"></div>

    <!-- Copyright -->
    <div class="copyright-notice">
      ©2026 Expedition Drenche, AUS
    </div>
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

/* --- Bottom Controls Bar --- */
.bottom-controls {
  position: fixed;
  bottom: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 50;
  font-family: var(--font-heading);
  font-size: 0.65rem;
  letter-spacing: 0.1em;
}

.divider {
  width: 1px;
  height: 16px;
  background: rgba(248, 245, 239, 0.2);
}

/* Cursor Toggle Button */
.control-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(7, 26, 43, 0.8);
  border: 1px solid rgba(201, 168, 76, 0.3);
  border-radius: 20px;
  color: rgba(248, 245, 239, 0.6);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
}

.control-btn:hover {
  border-color: rgba(201, 168, 76, 0.6);
  color: rgba(248, 245, 239, 0.9);
}

.control-btn.active {
  background: rgba(201, 168, 76, 0.15);
  border-color: var(--color-gold-400);
  color: var(--color-gold-400);
}

.control-btn.active:hover {
  background: rgba(201, 168, 76, 0.25);
}

.control-label {
  font-size: 0.6rem;
  text-transform: uppercase;
  font-weight: 500;
}

/* Clock & Timezone */
.timezone-wrapper {
  position: relative;
}

.clock-display {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: rgba(7, 26, 43, 0.8);
  border: 1px solid rgba(201, 168, 76, 0.3);
  border-radius: 20px;
  color: var(--color-gold-400);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  user-select: none;
}

.clock-display:hover {
  border-color: rgba(201, 168, 76, 0.6);
  background: rgba(7, 26, 43, 0.9);
}

.time-text {
  font-family: 'SF Mono', Monaco, monospace;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  min-width: 85px;
  text-align: center;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
  opacity: 0.6;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

/* Timezone Dropdown */
.timezone-dropdown {
  position: absolute;
  bottom: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  max-height: 240px;
  overflow-y: auto;
  background: rgba(7, 26, 43, 0.98);
  border: 1px solid rgba(201, 168, 76, 0.3);
  border-radius: 8px;
  padding: 4px;
  backdrop-filter: blur(12px);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
}

.timezone-option {
  padding: 8px 12px;
  color: rgba(248, 245, 239, 0.8);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-size: 0.65rem;
  white-space: nowrap;
}

.timezone-option:hover {
  background: rgba(201, 168, 76, 0.15);
  color: var(--color-gold-400);
}

.timezone-option.selected {
  background: rgba(201, 168, 76, 0.25);
  color: var(--color-gold-400);
}

/* Copyright */
.copyright-notice {
  color: rgba(248, 245, 239, 0.5);
  font-size: 0.6rem;
  padding: 6px 0;
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .bottom-controls {
    bottom: 12px;
    right: 12px;
    left: 12px;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }

  .control-label {
    display: none;
  }

  .time-text {
    font-size: 0.65rem;
    min-width: 75px;
  }

  .copyright-notice {
    order: -1;
    width: 100%;
    text-align: center;
    padding: 4px 0;
  }

  .divider {
    display: none;
  }
}

@media (max-width: 480px) {
  .bottom-controls {
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
  }

  .copyright-notice {
    order: 0;
    width: auto;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .control-btn,
  .clock-display,
  .timezone-option {
    transition: none;
  }
}
</style>