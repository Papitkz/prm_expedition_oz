import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

const sectionCache = new Map<string, string>()
let cacheLoaded = false

export function useCMS() {
  const loading = ref(false)

  async function loadSectionCache() {
    if (cacheLoaded) return
    loading.value = true

    try {
      const { data: sections } = await supabase
        .from('cms_sections')
        .select('id, section_key, default_image_url')

      const { data: images } = await supabase
        .from('cms_section_images')
        .select('section_id, image_url')
        .eq('is_active', true)

      const activeImages: Record<string, string> = {}
      if (images) {
        for (const img of images) {
          activeImages[img.section_id] = img.image_url
        }
      }

      if (sections) {
        for (const sec of sections) {
          sectionCache.set(sec.section_key, activeImages[sec.id] || sec.default_image_url || '')
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
    getTrips,
    getTripBySlug,
    getTripFeatures,
    getTripItinerary,
    getBlogs,
    getBlogBySlug,
    getSetting,
  }
}
