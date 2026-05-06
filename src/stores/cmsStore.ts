import { reactive, readonly } from 'vue'
import { supabase } from '@/lib/supabase'

// Global reactive store for all CMS data
interface CMSStore {
  // Loading states
  isInitialized: boolean
  isLoading: boolean
  
  // Sections data
  sections: Map<string, SectionData>
  sectionImages: Map<string, string>
  sectionVideos: Map<string, string>
  
  // Trips data
  trips: TripData[]
  tripFeatures: Map<string, string[]>
  tripItinerary: Map<string, ItineraryItem[]>
  
  // Blogs data
  blogs: BlogData[]
  
  // Settings
  settings: Map<string, string>
}

interface SectionData {
  id: string
  section_key: string
  page: string
  label: string
  description: string
  default_image_url: string
  default_video_url: string
  active_image_url: string | null
  active_video_url: string | null
}

interface TripData {
  id: string
  slug: string
  vessel_name: string
  title: string
  subtitle: string
  duration_days: number
  short_description: string
  description: string
  hero_image_url: string
  card_image_url: string
  price_from: number
  is_published: boolean
  sort_order: number
}

interface ItineraryItem {
  id: string
  day_number: number
  title: string
  description: string
}

interface BlogData {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image_url: string
  author: string
  published_at: string
  is_published: boolean
  category: string
}

// Create the reactive store
const store = reactive<CMSStore>({
  isInitialized: false,
  isLoading: false,
  sections: new Map(),
  sectionImages: new Map(),
  sectionVideos: new Map(),
  trips: [],
  tripFeatures: new Map(),
  tripItinerary: new Map(),
  blogs: [],
  settings: new Map(),
})

// Promise to track initialization
let initPromise: Promise<void> | null = null

/**
 * Initialize all CMS data in parallel for fastest possible loading
 */
export async function initializeCMS(): Promise<void> {
  // If already initialized, return immediately
  if (store.isInitialized) return
  
  // If initialization is in progress, wait for it
  if (initPromise) return initPromise
  
  store.isLoading = true
  
  initPromise = (async () => {
    try {
      // Fetch ALL data in parallel for maximum speed
      const [
        sectionsResult,
        activeImagesResult,
        activeVideosResult,
        tripsResult,
        featuresResult,
        itineraryResult,
        blogsResult,
        settingsResult,
      ] = await Promise.all([
        supabase.from('cms_sections').select('*'),
        supabase.from('cms_section_images').select('section_id, image_url').eq('is_active', true),
        supabase.from('cms_section_videos').select('section_id, video_url').eq('is_active', true),
        supabase.from('cms_trips').select('*').eq('is_published', true).order('sort_order'),
        supabase.from('cms_trip_features').select('*').order('sort_order'),
        supabase.from('cms_trip_itinerary').select('*').order('day_number'),
        supabase.from('cms_blogs').select('*').eq('is_published', true).order('published_at', { ascending: false }),
        supabase.from('cms_settings').select('*'),
      ])

      // Process sections
      const activeImages: Record<string, string> = {}
      const activeVideos: Record<string, string> = {}
      
      if (activeImagesResult.data) {
        for (const img of activeImagesResult.data) {
          activeImages[img.section_id] = img.image_url
        }
      }
      
      if (activeVideosResult.data) {
        for (const vid of activeVideosResult.data) {
          activeVideos[vid.section_id] = vid.video_url
        }
      }

      if (sectionsResult.data) {
        for (const sec of sectionsResult.data) {
          const activeImg = activeImages[sec.id] || null
          const activeVid = activeVideos[sec.id] || null
          
          store.sections.set(sec.section_key, {
            id: sec.id,
            section_key: sec.section_key,
            page: sec.page,
            label: sec.label,
            description: sec.description || '',
            default_image_url: sec.default_image_url || '',
            default_video_url: sec.default_video_url || '',
            active_image_url: activeImg,
            active_video_url: activeVid,
          })
          
          store.sectionImages.set(sec.section_key, activeImg || sec.default_image_url || '')
          store.sectionVideos.set(sec.section_key, activeVid || sec.default_video_url || '')
        }
      }

      // Process trips
      if (tripsResult.data) {
        store.trips = tripsResult.data
      }

      // Process trip features (group by trip_id)
      if (featuresResult.data) {
        for (const feature of featuresResult.data) {
          const existing = store.tripFeatures.get(feature.trip_id) || []
          existing.push(feature.feature_text)
          store.tripFeatures.set(feature.trip_id, existing)
        }
      }

      // Process trip itinerary (group by trip_id)
      if (itineraryResult.data) {
        for (const item of itineraryResult.data) {
          const existing = store.tripItinerary.get(item.trip_id) || []
          existing.push(item)
          store.tripItinerary.set(item.trip_id, existing)
        }
      }

      // Process blogs
      if (blogsResult.data) {
        store.blogs = blogsResult.data
      }

      // Process settings
      if (settingsResult.data) {
        for (const setting of settingsResult.data) {
          store.settings.set(setting.key, setting.value)
        }
      }

      store.isInitialized = true
    } catch (e) {
      console.warn('CMS initialization failed, app will use fallbacks:', e)
      store.isInitialized = true // Mark as initialized to prevent retry loops
    } finally {
      store.isLoading = false
    }
  })()
  
  return initPromise
}

/**
 * Get the readonly store state
 */
export function useCMSStore() {
  return {
    store: readonly(store),
    
    // Getters
    getSectionImage(key: string, fallback: string = ''): string {
      return store.sectionImages.get(key) || fallback
    },
    
    getSectionVideo(key: string, fallback: string = ''): string {
      return store.sectionVideos.get(key) || fallback
    },
    
    getSectionData(key: string): SectionData | undefined {
      return store.sections.get(key)
    },
    
    getAllSections(): SectionData[] {
      return Array.from(store.sections.values())
    },
    
    getSectionsByPage(page: string): SectionData[] {
      return Array.from(store.sections.values()).filter(s => s.page === page)
    },
    
    getTrips(): TripData[] {
      return store.trips
    },
    
    getTripBySlug(slug: string): TripData | undefined {
      return store.trips.find(t => t.slug === slug)
    },
    
    getTripFeatures(tripId: string): string[] {
      return store.tripFeatures.get(tripId) || []
    },
    
    getTripItinerary(tripId: string): ItineraryItem[] {
      return store.tripItinerary.get(tripId) || []
    },
    
    getBlogs(): BlogData[] {
      return store.blogs
    },
    
    getBlogBySlug(slug: string): BlogData | undefined {
      return store.blogs.find(b => b.slug === slug)
    },
    
    getSetting(key: string, fallback: string = ''): string {
      return store.settings.get(key) || fallback
    },
  }
}

/**
 * Force refresh all CMS data
 */
export async function refreshCMS(): Promise<void> {
  store.isInitialized = false
  initPromise = null
  store.sections.clear()
  store.sectionImages.clear()
  store.sectionVideos.clear()
  store.trips = []
  store.tripFeatures.clear()
  store.tripItinerary.clear()
  store.blogs = []
  store.settings.clear()
  
  await initializeCMS()
}
