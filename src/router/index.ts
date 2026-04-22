// src/router/index.ts
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/expeditions', name: 'expeditions', component: () => import('@/views/ExpeditionsView.vue') },
  { path: '/expeditions/sylvia', name: 'sylvia', component: () => import('@/views/SylviaView.vue') },
  { path: '/expeditions/millenium', name: 'millenium', component: () => import('@/views/MilleniumView.vue') },
  { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
  { path: '/contact', name: 'contact', component: () => import('@/views/ContactView.vue') },
  { path: '/faq', name: 'faq', component: () => import('@/views/FaqView.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/NotFoundView.vue') },
]

// Use memory history for SSR, web history for client
const history = typeof window !== 'undefined' 
  ? createWebHistory(import.meta.env.BASE_URL) 
  : createMemoryHistory(import.meta.env.BASE_URL)

const router = createRouter({
  history,
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'auto' }
  }
})

export default router
