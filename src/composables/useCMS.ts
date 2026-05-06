import { ref, computed } from 'vue'
import { useCMSStore, initializeCMS, refreshCMS } from '@/stores/cmsStore'

/**
 * @deprecated Use useCMSStore directly for better performance.
 * This composable is kept for backwards compatibility.
 */
export function useCMS() {
  const cmsStore = useCMSStore()
  const loading = computed(() => cmsStore.store.isLoading)

  // For backwards compatibility - these now just call the store
  async function loadSectionCache() {
    await initializeCMS()
  }

  function getSectionImage(sectionKey: string, fallbackUrl: string): string {
    return cmsStore.getSectionImage(sectionKey, fallbackUrl)
  }

  function getSectionVideo(sectionKey: string, fallbackUrl: string): string {
    return cmsStore.getSectionVideo(sectionKey, fallbackUrl)
  }

  function getSectionData(sectionKey: string) {
    return cmsStore.getSectionData(sectionKey) || null
  }

  function getAllSections() {
    return cmsStore.getAllSections()
  }

  function getSectionsByPage(page: string) {
    return cmsStore.getSectionsByPage(page)
  }

  function clearCache() {
    refreshCMS()
  }

  async function getTrips() {
    await initializeCMS()
    return cmsStore.getTrips()
  }

  async function getTripBySlug(slug: string) {
    await initializeCMS()
    return cmsStore.getTripBySlug(slug) || null
  }

  async function getTripFeatures(tripId: string) {
    await initializeCMS()
    return cmsStore.getTripFeatures(tripId)
  }

  async function getTripItinerary(tripId: string) {
    await initializeCMS()
    return cmsStore.getTripItinerary(tripId)
  }

  async function getBlogs() {
    await initializeCMS()
    return cmsStore.getBlogs()
  }

  async function getBlogBySlug(slug: string) {
    await initializeCMS()
    return cmsStore.getBlogBySlug(slug) || null
  }

  async function getSetting(key: string): Promise<string> {
    await initializeCMS()
    return cmsStore.getSetting(key, '')
  }

  return {
    loading,
    loadSectionCache,
    getSectionImage,
    getSectionVideo,
    getSectionData,
    getAllSections,
    getSectionsByPage,
    clearCache,
    getTrips,
    getTripBySlug,
    getTripFeatures,
    getTripItinerary,
    getBlogs,
    getBlogBySlug,
    getSetting,
  }
}
