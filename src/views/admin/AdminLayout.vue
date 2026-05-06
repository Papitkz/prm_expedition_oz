<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminAuth } from '@/composables/useAdminAuth'

const router = useRouter()
const route = useRoute()
const { user, signOut, isOwner, userRole } = useAdminAuth()
const sidebarOpen = ref(false)

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', to: '/admin/dashboard' },
  { label: 'Section Images', icon: 'images', to: '/admin/sections' },
  { label: 'Trips & Pricing', icon: 'trips', to: '/admin/trips' },
  { label: 'Blog Posts', icon: 'blog', to: '/admin/blogs' },
  { label: 'Settings', icon: 'settings', to: '/admin/settings' },
]

if (isOwner.value) {
  navItems.push({ label: 'User Access', icon: 'users', to: '/admin/users' })
}

const currentPage = computed(() => {
  const item = navItems.find(n => n.to === route.path)
  return item?.label || 'Dashboard'
})

const roleLabel = computed(() => {
  if (userRole.value === 'owner') return 'Owner'
  if (userRole.value === 'admin') return 'Admin'
  return 'User'
})

async function handleSignOut() {
  await signOut()
  router.push('/admin')
}

function navigate(to: string) {
  router.push(to)
  sidebarOpen.value = false
}

const iconPaths: Record<string, string> = {
  dashboard: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z',
  images: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
  trips: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  blog: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
  settings: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
  users: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z',
}
</script>

<template>
  <div class="admin-layout">
    <!-- Mobile Header -->
    <header class="mobile-header">
      <button @click="sidebarOpen = !sidebarOpen" class="menu-btn" aria-label="Toggle menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <span class="mobile-title">Expedition OZ Admin</span>
      <button @click="handleSignOut" class="signout-btn-mobile" aria-label="Sign out">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </header>

    <!-- Sidebar Overlay -->
    <div v-if="sidebarOpen" class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ 'sidebar-open': sidebarOpen }">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <svg width="32" height="32" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="rgba(201,168,76,0.4)" stroke-width="1"/>
            <polygon points="40,16 37,36 40,40 43,36" fill="#c9a84c"/>
            <polygon points="40,64 37,44 40,40 43,44" fill="rgba(201,168,76,0.4)"/>
            <circle cx="40" cy="40" r="3" fill="#c9a84c"/>
          </svg>
        </div>
        <div>
          <p class="sidebar-brand">Expedition OZ</p>
          <p class="sidebar-role">{{ roleLabel }} Panel</p>
        </div>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.to"
          @click="navigate(item.to)"
          class="nav-item"
          :class="{ 'nav-active': route.path === item.to }"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path :d="iconPaths[item.icon]"/>
          </svg>
          <span>{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <div class="user-avatar" :class="{ 'owner-avatar': isOwner }">{{ user?.email?.charAt(0).toUpperCase() || 'A' }}</div>
          <div class="user-details">
            <p class="user-email">{{ user?.email || 'admin' }}</p>
            <p class="user-role">{{ roleLabel }}</p>
          </div>
        </div>
        <button @click="handleSignOut" class="signout-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="admin-main">
      <div class="page-header">
        <h1 class="page-title">{{ currentPage }}</h1>
        <div class="breadcrumb">
          <span>Admin</span>
          <span class="breadcrumb-sep">/</span>
          <span>{{ currentPage }}</span>
        </div>
      </div>
      <div class="page-content">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #071a2b;
}

/* Mobile Header */
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: rgba(7, 26, 43, 0.98);
  border-bottom: 1px solid rgba(201, 168, 76, 0.15);
  z-index: 60;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}

.menu-btn, .signout-btn-mobile {
  background: none;
  border: none;
  color: rgba(248, 245, 239, 0.7);
  cursor: pointer;
  padding: 0.5rem;
}

.mobile-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  color: #c9a84c;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: #050f1a;
  border-right: 1px solid rgba(201, 168, 76, 0.1);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 50;
  overflow-y: auto;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 45;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(201, 168, 76, 0.1);
}

.sidebar-brand {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-weight: 300;
  color: #c9a84c;
}

.sidebar-role {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.55rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(248, 245, 239, 0.4);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  color: rgba(248, 245, 239, 0.55);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}

.nav-item:hover {
  background: rgba(201, 168, 76, 0.08);
  color: rgba(248, 245, 239, 0.9);
}

.nav-active {
  background: rgba(201, 168, 76, 0.12) !important;
  color: #c9a84c !important;
  border-left: 2px solid #c9a84c;
}

.sidebar-footer {
  padding: 1rem 1.25rem;
  border-top: 1px solid rgba(201, 168, 76, 0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.user-avatar {
  width: 36px;
  height: 36px;
  background: rgba(201, 168, 76, 0.2);
  border: 1px solid rgba(201, 168, 76, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #c9a84c;
  flex-shrink: 0;
}

.owner-avatar {
  background: rgba(201, 168, 76, 0.35);
  border-color: #c9a84c;
  box-shadow: 0 0 8px rgba(201, 168, 76, 0.3);
}

.user-email {
  font-size: 0.7rem;
  color: rgba(248, 245, 239, 0.7);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
}

.user-role {
  font-size: 0.55rem;
  color: rgba(248, 245, 239, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.signout-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: 1px solid rgba(224, 123, 90, 0.2);
  color: rgba(224, 123, 90, 0.7);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  justify-content: center;
}

.signout-btn:hover {
  background: rgba(224, 123, 90, 0.1);
  border-color: rgba(224, 123, 90, 0.4);
  color: #e07b5a;
}

/* Main Content */
.admin-main {
  flex: 1;
  margin-left: 260px;
  padding: 2rem;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 300;
  color: #f8f5ef;
  margin-bottom: 0.25rem;
}

.breadcrumb {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.1em;
  color: rgba(248, 245, 239, 0.35);
}

.breadcrumb-sep {
  margin: 0 0.5rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .mobile-header { display: flex; }
  .sidebar { transform: translateX(-100%); transition: transform 0.3s ease; }
  .sidebar-open { transform: translateX(0); }
  .sidebar-overlay { display: block; }
  .admin-main { margin-left: 0; padding: 1rem; padding-top: calc(56px + 1rem); }
}
</style>
