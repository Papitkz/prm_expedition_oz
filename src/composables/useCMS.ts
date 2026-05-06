import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

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
      const { data: sections } = await supabase
        .from('cms_sections')
        .select('id, section_key, page, label, description, default_image_url, default_video_url')

      const { data: images } = await supabase
        .from('cms_section_images')
        .select('section_id, image_url')
        .eq('is_active', true)

      const { data: videos } = await supabase
        .from('cms_section_videos')
        .select('section_id, video_url')
        .eq('is_active', true)

      const activeImages: Record<string, string> = {}
      if (images) {
        for (const img of images) {
          activeImages[img.section_id] = img.image_url
        }
      }

      const activeVideos: Record<string, string> = {}
      if (videos) {
        for (const vid of videos) {
          activeVideos[vid.section_id] = vid.video_url
        }
      }

      if (sections) {
        for (const sec of sections) {
          const activeImg = activeImages[sec.id] || null
          const activeVid = activeVideos[sec.id] || null

          sectionCache.set(sec.section_key, activeImg || sec.default_image_url || '')
          sectionVideoCache.set(sec.section_key, activeVid || sec.default_video_url || '')

          allSectionsCache.set(sec.section_key, {
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
        }
      }

      cacheLoaded = true
    } catch (e) {
      console.warn('Supabase unavailable, section cache will use fallbacks:', e)
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
    return Array.from(allSectionsCache.values()).filter(s => s.page === page)
  }

  function clearCache() {
    cacheLoaded = false
    sectionCache.clear()
    sectionVideoCache.clear()
    allSectionsCache.clear()
  }

  async function getTrips() {
    try {
      const { data } = await supabase
        .from('cms_trips')
        .select('*')
        .eq('is_published', true)
        .order('sort_order')
      return data || []
    } catch (e) {
      console.warn('Supabase unavailable, returning empty trips:', e)
      return []
    }
  }

  async function getTripBySlug(slug: string) {
    try {
      const { data } = await supabase
        .from('cms_trips')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle()
      return data
    } catch (e) {
      console.warn('Supabase unavailable, cannot load trip:', e)
      return null
    }
  }

  async function getTripFeatures(tripId: string) {
    try {
      const { data } = await supabase
        .from('cms_trip_features')
        .select('feature_text')
        .eq('trip_id', tripId)
        .order('sort_order')
      return data?.map(d => d.feature_text) || []
    } catch (e) {
      console.warn('Supabase unavailable, cannot load features:', e)
      return []
    }
  }

  async function getTripItinerary(tripId: string) {
    try {
      const { data } = await supabase
        .from('cms_trip_itinerary')
        .select('*')
        .eq('trip_id', tripId)
        .order('day_number')
      return data || []
    } catch (e) {
      console.warn('Supabase unavailable, cannot load itinerary:', e)
      return []
    }
  }

  async function getBlogs() {
    try {
      const { data } = await supabase
        .from('cms_blogs')
        .select('*')
        .eq('is_published', true)
        .order('published_at', { ascending: false })
      return data || []
    } catch (e) {
      console.warn('Supabase unavailable, returning empty blogs:', e)
      return []
    }
  }

  async function getBlogBySlug(slug: string) {
    try {
      const { data } = await supabase
        .from('cms_blogs')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .maybeSingle()
      return data
    } catch (e) {
      console.warn('Supabase unavailable, cannot load blog:', e)
      return null
    }
  }

  async function getSetting(key: string): Promise<string> {
    try {
      const { data } = await supabase
        .from('cms_settings')
        .select('value')
        .eq('key', key)
        .maybeSingle()
      return data?.value || ''
    } catch (e) {
      console.warn('Supabase unavailable, cannot load setting:', e)
      return ''
    }
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
  }
}
