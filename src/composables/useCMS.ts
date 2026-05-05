import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

interface SectionImage {
  image_url: string
  alt_text: string
  is_active: boolean
}

interface CMSTrip {
  id: string
  slug: string
  vessel_name: string
  title: string
  subtitle: string
  duration_days: number
  max_guests: number
  price_aud: number
  price_label: string
  description: string
  short_description: string
  hero_image_url: string
  hero_video_url: string
  is_published: boolean
  rezdy_product_id: string
}

interface CMSBlog {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image_url: string
  author_name: string
  is_published: boolean
  published_at: string | null
}

const sectionCache = new Map<string, string>()
let cacheLoaded = false

export function useCMS() {
  const loading = ref(false)

  async function loadSectionCache() {
    if (cacheLoaded) return
    loading.value = true

    const { data: sections } = await supabase
      .from('cms_sections')
      .select('id, section_key, default_image_url')

    const { data: images } = await supabase
      .from('cms_section_images')
      .select('section_id, image_url, is_active')
      .eq('is_active', true)

    if (sections && images) {
      for (const section of sections) {
        const activeImage = images.find(img => img.section_id === section.id)
        sectionCache.set(section.section_key, activeImage?.image_url || section.default_image_url)
      }
    } else if (sections) {
      for (const section of sections) {
        sectionCache.set(section.section_key, section.default_image_url)
      }
    }

    cacheLoaded = true
    loading.value = false
  }

  function getSectionImage(sectionKey: string, fallbackUrl: string): string {
    return sectionCache.get(sectionKey) || fallbackUrl
  }

  async function getTrips(): Promise<CMSTrip[]> {
    const { data } = await supabase
      .from('cms_trips')
      .select('*')
      .eq('is_published', true)
      .order('sort_order')
    return (data as CMSTrip[]) || []
  }

  async function getTripBySlug(slug: string): Promise<CMSTrip | null> {
    const { data } = await supabase
      .from('cms_trips')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()
    return data as CMSTrip | null
  }

  async function getTripFeatures(tripId: string): Promise<string[]> {
    const { data } = await supabase
      .from('cms_trip_features')
      .select('feature_text')
      .eq('trip_id', tripId)
      .order('sort_order')
    return data?.map(f => f.feature_text) || []
  }

  async function getTripItinerary(tripId: string) {
    const { data } = await supabase
      .from('cms_trip_itinerary')
      .select('*')
      .eq('trip_id', tripId)
      .order('day_number')
    return data || []
  }

  async function getBlogs(): Promise<CMSBlog[]> {
    const { data } = await supabase
      .from('cms_blogs')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
    return (data as CMSBlog[]) || []
  }

  async function getBlogBySlug(slug: string): Promise<CMSBlog | null> {
    const { data } = await supabase
      .from('cms_blogs')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .maybeSingle()
    return data as CMSBlog | null
  }

  async function getSetting(key: string): Promise<string> {
    const { data } = await supabase
      .from('cms_settings')
      .select('setting_value')
      .eq('setting_key', key)
      .maybeSingle()
    return data?.setting_value || ''
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
