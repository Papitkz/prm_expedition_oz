import { ref, onMounted } from 'vue'
import {
  getFirebaseDb,
  isFirebaseInitialized,
  initFirebase,
  type FirebaseConfig,
} from '@/lib/firebase'
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore'

const sectionCache = new Map<string, string>()
let cacheLoaded = false

export function useCMS() {
  const loading = ref(false)

  async function ensureFirebase() {
    if (isFirebaseInitialized()) return
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('firebase_config')
      if (saved) {
        try {
          initFirebase(JSON.parse(saved) as FirebaseConfig)
        } catch { /* ignore */ }
      }
    }
  }

  async function loadSectionCache() {
    if (cacheLoaded || !isFirebaseInitialized()) return
    loading.value = true

    try {
      const db = getFirebaseDb()

      // Load sections
      const sectionsSnap = await getDocs(collection(db, 'cms_sections'))
      const sections: Record<string, { id: string; defaultImageUrl: string }> = {}
      for (const docSnap of sectionsSnap.docs) {
        const d = docSnap.data()
        sections[docSnap.id] = {
          id: docSnap.id,
          defaultImageUrl: d.defaultImageUrl || '',
        }
      }

      // Load active images
      const imagesSnap = await getDocs(
        query(collection(db, 'cms_section_images'), where('isActive', '==', true))
      )

      const activeImages: Record<string, string> = {}
      for (const docSnap of imagesSnap.docs) {
        const d = docSnap.data()
        activeImages[d.sectionId] = d.imageUrl
      }

      // Build cache
      for (const [key, section] of Object.entries(sections)) {
        sectionCache.set(key, activeImages[section.id] || section.defaultImageUrl)
      }

      cacheLoaded = true
    } catch (e) {
      console.warn('Failed to load section cache:', e)
    }

    loading.value = false
  }

  function getSectionImage(sectionKey: string, fallbackUrl: string): string {
    return sectionCache.get(sectionKey) || fallbackUrl
  }

  async function getTrips() {
    if (!isFirebaseInitialized()) return []
    const db = getFirebaseDb()
    const snap = await getDocs(query(collection(db, 'cms_trips'), where('isPublished', '==', true), orderBy('sortOrder')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as any))
  }

  async function getTripBySlug(slug: string) {
    if (!isFirebaseInitialized()) return null
    const db = getFirebaseDb()
    const snap = await getDocs(query(collection(db, 'cms_trips'), where('slug', '==', slug), where('isPublished', '==', true)))
    if (snap.empty) return null
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as any
  }

  async function getTripFeatures(tripId: string) {
    if (!isFirebaseInitialized()) return []
    const db = getFirebaseDb()
    const snap = await getDocs(query(collection(db, 'cms_trip_features'), where('tripId', '==', tripId), orderBy('sortOrder')))
    return snap.docs.map(d => d.data().featureText as string)
  }

  async function getTripItinerary(tripId: string) {
    if (!isFirebaseInitialized()) return []
    const db = getFirebaseDb()
    const snap = await getDocs(query(collection(db, 'cms_trip_itinerary'), where('tripId', '==', tripId), orderBy('dayNumber')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  }

  async function getBlogs() {
    if (!isFirebaseInitialized()) return []
    const db = getFirebaseDb()
    const snap = await getDocs(query(collection(db, 'cms_blogs'), where('isPublished', '==', true), orderBy('publishedAt', 'desc')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as any))
  }

  async function getBlogBySlug(slug: string) {
    if (!isFirebaseInitialized()) return null
    const db = getFirebaseDb()
    const snap = await getDocs(query(collection(db, 'cms_blogs'), where('slug', '==', slug), where('isPublished', '==', true)))
    if (snap.empty) return null
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as any
  }

  async function getSetting(key: string): Promise<string> {
    if (!isFirebaseInitialized()) return ''
    const db = getFirebaseDb()
    const snap = await getDoc(doc(db, 'cms_settings', key))
    return snap.exists() ? (snap.data().value as string) : ''
  }

  onMounted(loadSectionCache)

  return {
    loading,
    loadSectionCache,
    getSectionImage,
    getTrips,
    getTripBySlug,
    getTripFeatures,
    getTripItinerary,
    getBlogs,
    getBlogBySlug,
    getSetting,
  }
}
