import { useHead, useSeoMeta } from '@unhead/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface SEOConfig {
  title?: string
  description?: string
  image?: string
  path?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
  keywords?: string[]
  author?: string
  jsonLd?: Record<string, any>
}

const SITE_NAME = 'Expedition OZ'
const SITE_URL = 'https://expedition-oz.com'  // ← FIXED: removed trailing space
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`

export function useSEO(config: SEOConfig = {}) {
  const route = useRoute()
  
  const seo = computed(() => {
    const path = config.path || route.path
    const title = config.title ? `${config.title} | ${SITE_NAME}` : `${SITE_NAME} | Luxury Meets Nature`
    
    return {
      title,
      description: config.description || 'Luxury live-aboard experiences in Ningaloo Reef, Western Australia.',
      canonical: `${SITE_URL}${path}`,
      ogImage: config.image || DEFAULT_IMAGE,
      ogType: config.type || 'website',
      robots: config.noindex ? 'noindex, nofollow' : 'index, follow',
      keywords: config.keywords?.join(', ') || 'Ningaloo Reef, live-aboard, Western Australia, luxury tours'
    }
  })

  useSeoMeta({
    title: () => seo.value.title,
    description: () => seo.value.description,
    keywords: () => seo.value.keywords,
    robots: () => seo.value.robots,
    ogTitle: () => seo.value.title,
    ogDescription: () => seo.value.description,
    ogImage: () => seo.value.ogImage,
    ogImageWidth: 1200,           // ← ADDED
    ogImageHeight: 630,           // ← ADDED
    ogImageType: 'image/jpeg',    // ← ADDED
    ogUrl: () => seo.value.canonical,
    ogType: () => seo.value.ogType,
    ogSiteName: SITE_NAME,
    ogLocale: 'en_AU',            // ← ADDED
    twitterCard: 'summary_large_image',
    twitterTitle: () => seo.value.title,
    twitterDescription: () => seo.value.description,
    twitterImage: () => seo.value.ogImage
  })

  useHead({
    htmlAttrs: { lang: 'en-AU' },  // ← ADDED
    link: [
      { rel: 'canonical', href: () => seo.value.canonical },
      // Preconnect for performance
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
    ],
    meta: [
      { name: 'author', content: config.author || 'Expedition OZ' },
      { name: 'theme-color', content: '#071a2b' }
    ],
    script: config.jsonLd ? [{
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify({
        ...config.jsonLd,
        '@context': 'https://schema.org'  // Ensure no trailing space
      })
    }] : []
  })
}