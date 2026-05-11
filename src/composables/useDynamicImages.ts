import { ref, computed } from 'vue'
import { useCMS } from './useCMS'

/**
 * Centralized image key definitions for the entire application.
 * Each page has its own set of image keys to keep things organized.
 */
export const IMAGE_KEYS = {
  // Home page
  home: {
    heroVideo1: 'home_hero_video_1',
    heroVideo2: 'home_hero_video_2',
    heroVideo3: 'home_hero_video_3',
    heroVideo4: 'home_hero_video_4',
    heroVideo5: 'home_hero_video_5',
    introImage1: 'home_intro_image_1',
    introImage2: 'home_intro_image_2',
    tourSylvia: 'home_tour_sylvia',
    tourMillenium: 'home_tour_millenium',
    experienceShip: 'home_experience_ship',
    experienceDining: 'home_experience_dining',
    experienceStateroom: 'home_experience_stateroom',
    ctaBackground: 'home_cta_background',
  },
  // About page
  about: {
    hero: 'about_hero',
    heroVideo: 'about_hero_video',
    australianOysters: 'about_australian_oysters',
    australianOystersSecondary: 'about_australian_oysters_secondary',
    teamAaron: 'about_team_aaron',
    teamAaronSecondary: 'about_team_aaron_secondary',
    history1: 'about_history_1',
    history2: 'about_history_2',
    history3: 'about_history_3',
    history4: 'about_history_4',
  },
  // Expeditions page
  expeditions: {
    hero: 'expeditions_hero',
    heroVideo: 'expeditions_hero_video',
    sylviaHover: 'expeditions_sylvia_hover',
    milleniumHover: 'expeditions_millenium_hover',
  },
  // Sylvia page
  sylvia: {
    heroVideo: 'sylvia_hero_video',
    heroVideoPoster: 'sylvia_hero_video_poster',
    heroFallback: 'sylvia_hero_fallback',
    itineraryDay1: 'sylvia_itinerary_day1',
    itineraryDay2: 'sylvia_itinerary_day2',
    itineraryDay3: 'sylvia_itinerary_day3',
    itineraryDay4: 'sylvia_itinerary_day4',
    vesselGallery1: 'sylvia_vessel_gallery_1',
    vesselGallery2: 'sylvia_vessel_gallery_2',
    vesselGallery3: 'sylvia_vessel_gallery_3',
    vesselGallery4: 'sylvia_vessel_gallery_4',
    vesselGallery5: 'sylvia_vessel_gallery_5',
    vesselGallery6: 'sylvia_vessel_gallery_6',
    diningGallery1: 'sylvia_dining_gallery_1',
    diningGallery2: 'sylvia_dining_gallery_2',
    diningGallery3: 'sylvia_dining_gallery_3',
    diningGallery4: 'sylvia_dining_gallery_4',
    routeMapBg: 'sylvia_route_map_bg',
    aboutSection: 'sylvia_about_section',
    enquiryBg: 'sylvia_enquiry_bg',
  },
  // Millenium page
  millenium: {
    heroVideo: 'millenium_hero_video',
    heroVideoPoster: 'millenium_hero_video_poster',
    heroFallback: 'millenium_hero_fallback',
    itineraryDay1: 'millenium_itinerary_day1',
    itineraryDay2: 'millenium_itinerary_day2',
    itineraryDay3: 'millenium_itinerary_day3',
    itineraryDay4: 'millenium_itinerary_day4',
    itineraryDay5: 'millenium_itinerary_day5',
    itineraryDay6: 'millenium_itinerary_day6',
    itineraryDay7: 'millenium_itinerary_day7',
    vesselGallery1: 'millenium_vessel_gallery_1',
    vesselGallery2: 'millenium_vessel_gallery_2',
    vesselGallery3: 'millenium_vessel_gallery_3',
    vesselGallery4: 'millenium_vessel_gallery_4',
    vesselGallery5: 'millenium_vessel_gallery_5',
    vesselGallery6: 'millenium_vessel_gallery_6',
    vesselGallery7: 'millenium_vessel_gallery_7',
    vesselGallery8: 'millenium_vessel_gallery_8',
    diningGallery1: 'millenium_dining_gallery_1',
    diningGallery2: 'millenium_dining_gallery_2',
    diningGallery3: 'millenium_dining_gallery_3',
    diningGallery4: 'millenium_dining_gallery_4',
    diningGallery5: 'millenium_dining_gallery_5',
    diningGallery6: 'millenium_dining_gallery_6',
    routeMapBg: 'millenium_route_map_bg',
    aboutSection1: 'millenium_about_section_1',
    aboutSection2: 'millenium_about_section_2',
    aboutSection3: 'millenium_about_section_3',
    aboutSection4: 'millenium_about_section_4',
    enquiryBg: 'millenium_enquiry_bg',
  },
  // Blog
  blog: {
    listHero: 'blog_list_hero',
    listHeroVideo: 'blog_list_hero_video',
    detailHeroFallback: 'blog_detail_hero_fallback',
  },
  // Contact
  contact: {
    hero: 'contact_hero',
    heroVideo: 'contact_hero_video',
  },
  // FAQ
  faq: {
    hero: 'faq_hero',
    heroVideo: 'faq_hero_video',
  },
} as const

export type PageImageKeys = typeof IMAGE_KEYS
export type PageKey = keyof PageImageKeys

export function useDynamicImages() {
  const cms = useCMS()
  const loading = ref(false)

  /**
   * Get a single dynamic image URL by key with fallback.
   */
  function getImage(key: string, fallbackUrl: string = ''): string {
    return cms.getImage(key, fallbackUrl)
  }

  /**
   * Get alt text for an image by key.
   */
  function getAlt(key: string, fallbackAlt: string = ''): string {
    return cms.getImageAlt(key, fallbackAlt)
  }

  /**
   * Get multiple images by prefix (for galleries, itineraries, etc.)
   */
  function getImageArray(prefix: string, fallbacks: string[]): string[] {
    const results: string[] = []
    for (let i = 0; i < fallbacks.length; i++) {
      const key = `${prefix}_${i + 1}`
      results.push(cms.getImage(key, fallbacks[i]))
    }
    return results
  }

  /**
   * Get page hero background - handles both video and image fallbacks
   */
  function getHeroBackground(pageKey: PageKey, type: 'image' | 'video' = 'image'): string {
    const page = IMAGE_KEYS[pageKey]
    if (!page) return ''

    if (type === 'video') {
      const videoKey = Object.entries(page).find(([k]) => k.includes('Video'))?.[1]
      return videoKey ? cms.getImage(videoKey, '') : ''
    }

    // For image, prefer a dedicated hero key, otherwise look for fallback
    const heroKey = Object.entries(page).find(([k]) => k === 'hero')?.[1]
    return heroKey ? cms.getImage(heroKey, '') : ''
  }

  /**
   * Check if an image has been overridden in CMS
   */
  function isOverridden(key: string): boolean {
    const img = cms.getAllImages().find((i) => i.key === key)
    return !!img?.url && img.url !== img.fallbackUrl
  }

  return {
    loading,
    getImage,
    getAlt,
    getImageArray,
    getHeroBackground,
    isOverridden,
    IMAGE_KEYS,
  }
}
