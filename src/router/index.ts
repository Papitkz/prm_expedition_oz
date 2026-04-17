import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/expeditions', name: 'expeditions', component: () => import('@/views/ExpeditionsView.vue') },
    { path: '/expeditions/sylvia', name: 'sylvia', component: () => import('@/views/SylviaView.vue') },
    { path: '/expeditions/millenium', name: 'millenium', component: () => import('@/views/MilleniumView.vue') },
    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
    { path: '/contact', name: 'contact', component: () => import('@/views/ContactView.vue') },
    { path: '/faq', name: 'faq', component: () => import('@/views/FaqView.vue') },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

export default router
