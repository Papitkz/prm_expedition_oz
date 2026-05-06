import { ref, onMounted } from 'vue'
import { getFirebaseDb } from '@/lib/firebase'
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

interface SectionData {
  id: string
  sectionKey: string
  page: string
  label: string
  description: string
  defaultImageUrl: string
  defaultVideoUrl: string
  activeImageUrl: string | null
  activeVideoUrl: string | null
}

const sectionCache = new Map<string, string>()
const sectionVideoCache = new Map<string, string>()
const allSectionsCache = new Map<string, SectionData>()
let cacheLoaded = false

export function useCMS() {
  const loading = ref(false)

  async function loadSectionCache() {
    if (cacheLoaded) return
    loading.value = true

    try {
      const db = getFirebaseDb()

      // Load sections
      const sectionsSnap = await getDocs(collection(db, 'cms_sections'))
      const sections = sectionsSnap.docs.map((d) => ({ id: d.id, ...d.data() }))

      // Load active images
      const imagesSnap = await getDocs(
        query(collection(db, 'cms_section_images'), where('isActive', '==', true))
      )
      const activeImages: Record<string, string> = {}
      imagesSnap.docs.forEach((d) => {
        const data = d.data()
        activeImages[data.sectionId] = data.imageUrl
      })

      // Load active videos
      const videosSnap = await getDocs(
        query(collection(db, 'cms_section_videos'), where('isActive', '==', true))
      )
      const activeVideos: Record<string, string> = {}
      videosSnap.docs.forEach((d) => {
        const data = d.data()
        activeVideos[data.sectionId] = data.videoUrl
      })

      for (const sec of sections as any[]) {
        const activeImg = activeImages[sec.id] || null
        const activeVid = activeVideos[sec.id] || null

        sectionCache.set(sec.sectionKey, activeImg || sec.defaultImageUrl || '')
        sectionVideoCache.set(sec.sectionKey, activeVid || sec.defaultVideoUrl || '')

        allSectionsCache.set(sec.sectionKey, {
          id: sec.id,
          sectionKey: sec.sectionKey,
          page: sec.page,
          label: sec.label,
          description: sec.description || '',
          defaultImageUrl: sec.defaultImageUrl || '',
          defaultVideoUrl: sec.defaultVideoUrl || '',
          activeImageUrl: activeImg,
          activeVideoUrl: activeVid,
        })
      }

      cacheLoaded = true
    } catch (e) {
      console.warn('Firebase unavailable, section cache will use fallbacks:', e)
      cacheLoaded = true
    }

    loading.value = false
  }

  function getSectionImage(sectionKey: string, fallbackUrl: string): string {
    return sectionCache.get(sectionKey) || fallbackUrl
  }

  function getSectionVideo(sectionKey: string, fallbackUrl: string): string {
    return sectionVideoCache.get(sectionKey) || fallbackUrl
  }

  function getSectionData(sectionKey: string): SectionData | null {
    return allSectionsCache.get(sectionKey) || null
  }

  function getAllSections(): SectionData[] {
    return Array.from(allSectionsCache.values())
  }

  function getSectionsByPage(page: string): SectionData[] {
    return Array.from(allSectionsCache.values()).filter((s) => s.page === page)
  }

  function clearCache() {
    cacheLoaded = false
    sectionCache.clear()
    sectionVideoCache.clear()
    allSectionsCache.clear()
  }

  async function getTrips() {
    try {
      const db = getFirebaseDb()
      const q = query(
        collection(db, 'cms_trips'),
        where('isPublished', '==', true),
        orderBy('sortOrder')
      )
      const snap = await getDocs(q)
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    } catch (e) {
      console.warn('Firebase unavailable, returning empty trips:', e)
      return []
    }
  }

  async function getTripBySlug(slug: string) {
    try {
      const db = getFirebaseDb()
      const q = query(
        collection(db, 'cms_trips'),
        where('slug', '==', slug),
        where('isPublished', '==', true)
      )
      const snap = await getDocs(q)
      if (snap.empty) return null
      return { id: snap.docs[0].id, ...snap.docs[0].data() }
    } catch (e) {
      console.warn('Firebase unavailable, cannot load trip:', e)
      return null
    }
  }

  async function getTripFeatures(tripId: string) {
    try {
      const db = getFirebaseDb()
      const q = query(
        collection(db, 'cms_trip_features'),
        where('tripId', '==', tripId),
        orderBy('sortOrder')
      )
      const snap = await getDocs(q)
      return snap.docs.map((d) => d.data().featureText)
    } catch (e) {
      console.warn('Firebase unavailable, cannot load features:', e)
      return []
    }
  }

  async function getTripItinerary(tripId: string) {
    try {
      const db = getFirebaseDb()
      const q = query(
        collection(db, 'cms_trip_itinerary'),
        where('tripId', '==', tripId),
        orderBy('dayNumber')
      )
      const snap = await getDocs(q)
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    } catch (e) {
      console.warn('Firebase unavailable, cannot load itinerary:', e)
      return []
    }
  }

  async function getBlogs() {
    try {
      const db = getFirebaseDb()
      const q = query(
        collection(db, 'cms_blogs'),
        where('isPublished', '==', true),
        orderBy('publishedAt', 'desc')
      )
      const snap = await getDocs(q)
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    } catch (e) {
      console.warn('Firebase unavailable, returning empty blogs:', e)
      return []
    }
  }

  async function getBlogBySlug(slug: string) {
    try {
      const db = getFirebaseDb()
      const q = query(
        collection(db, 'cms_blogs'),
        where('slug', '==', slug),
        where('isPublished', '==', true)
      )
      const snap = await getDocs(q)
      if (snap.empty) return null
      return { id: snap.docs[0].id, ...snap.docs[0].data() }
    } catch (e) {
      console.warn('Firebase unavailable, cannot load blog:', e)
      return null
    }
  }

  async function getSetting(key: string): Promise<string> {
    try {
      const db = getFirebaseDb()
      const docRef = doc(db, 'cms_settings', key)
      const snap = await getDoc(docRef)
      return snap.exists() ? snap.data().value || '' : ''
    } catch (e) {
      console.warn('Firebase unavailable, cannot load setting:', e)
      return ''
    }
  }

  // Admin CRUD operations
  async function createSection(data: Partial<SectionData>) {
    const db = getFirebaseDb()
    const id = data.sectionKey || `section_${Date.now()}`
    await setDoc(doc(db, 'cms_sections', id), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    clearCache()
    return id
  }

  async function updateSection(id: string, data: Partial<SectionData>) {
    const db = getFirebaseDb()
    await updateDoc(doc(db, 'cms_sections', id), {
      ...data,
      updatedAt: serverTimestamp(),
    })
    clearCache()
  }

  async function deleteSection(id: string) {
    const db = getFirebaseDb()
    await deleteDoc(doc(db, 'cms_sections', id))
    clearCache()
  }

  onMounted(loadSectionCache)

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
    createSection,
    updateSection,
    deleteSection,
  }
}
