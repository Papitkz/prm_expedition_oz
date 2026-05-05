import { ref, onMounted } from 'vue'
import { getFirebaseDb, isFirebaseInitialized, initFirebase } from '@/lib/firebase'
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

// Ensure Firebase is initialized
initFirebase()

export function useCMS() {
  const loading = ref(false)

  async function loadSectionCache() {
    if (cacheLoaded) return
    loading.value = true

    try {
      const db = getFirebaseDb()

      const sectionsSnap = await getDocs(collection(db, 'cms_sections'))
      const sections: Record<string, { id: string; defaultImageUrl: string }> = {}
      for (const docSnap of sectionsSnap.docs) {
        const d = docSnap.data()
        sections[docSnap.id] = {
          id: docSnap.id,
          defaultImageUrl: d.defaultImageUrl || '',
        }
      }

      const imagesSnap = await getDocs(
        query(collection(db, 'cms_section_images'), where('isActive', '==', true))
      )

      const activeImages: Record<string, string> = {}
      for (const docSnap of imagesSnap.docs) {
        const d = docSnap.data()
        activeImages[d.sectionId] = d.imageUrl
      }

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
    const db = getFirebaseDb()
    const snap = await getDocs(query(collection(db, 'cms_trips'), where('isPublished', '==', true), orderBy('sortOrder')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as any))
  }

  async function getTripBySlug(slug: string) {
    const db = getFirebaseDb()
    const snap = await getDocs(query(collection(db, 'cms_trips'), where('slug', '==', slug), where('isPublished', '==', true)))
    if (snap.empty) return null
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as any
  }

  async function getTripFeatures(tripId: string) {
    const db = getFirebaseDb()
    const snap = await getDocs(query(collection(db, 'cms_trip_features'), where('tripId', '==', tripId), orderBy('sortOrder')))
    return snap.docs.map(d => d.data().featureText as string)
  }

  async function getTripItinerary(tripId: string) {
    const db = getFirebaseDb()
    const snap = await getDocs(query(collection(db, 'cms_trip_itinerary'), where('tripId', '==', tripId), orderBy('dayNumber')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  }

  async function getBlogs() {
    const db = getFirebaseDb()
    const snap = await getDocs(query(collection(db, 'cms_blogs'), where('isPublished', '==', true), orderBy('publishedAt', 'desc')))
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as any))
  }

  async function getBlogBySlug(slug: string) {
    const db = getFirebaseDb()
    const snap = await getDocs(query(collection(db, 'cms_blogs'), where('slug', '==', slug), where('isPublished', '==', true)))
    if (snap.empty) return null
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as any
  }

  async function getSetting(key: string): Promise<string> {
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
