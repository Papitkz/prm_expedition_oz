// src/composables/useSEO.ts
import { useHead, useSeoMeta } from '@unhead/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// ─── Types ───
interface SEOConfig {
  title?: string
  description?: string
  image?: string
  path?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
  keywords?: string[]
  author?: string
  jsonLd?: Record<string, any> | Record<string, any>[]
}

// ─── Constants ───
const SITE_NAME = 'Expedition OZ'
const SITE_URL = 'https://expeditionoz.netlify.app' // ← FIXED: no trailing space
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`

// ─── Default descriptions per route (fallbacks) ───
const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  '/': 'Book luxury live-aboard Ningaloo Reef tours. Swim with whale sharks, snorkel coral gardens aboard Sylvia (4-day, from $2,495) or Millenium (7-day, from $4,495). 2026 season open.',
  '/expeditions': 'Choose your Ningaloo Reef expedition — Sylvia 4-day northern reef or Millenium 7-day full reef. Luxury live-aboard with whale sharks, gourmet dining & guided snorkeling.',
  '/expeditions/sylvia': 'Sylvia 4-day Northern Reef expedition — intimate luxury live-aboard with whale shark encounters, gourmet dining & guided snorkeling. From $2,495 AUD. Book 2026.',
  '/expeditions/millenium': 'Millenium 7-day ultimate Ningaloo Reef expedition. Full reef exploration, remote dive sites, luxury cabins. From $4,495 AUD. 2026 season now open.',
  '/about': 'Learn about Expedition OZ — luxury live-aboard expeditions in Ningaloo Reef since 2018. Our mission, crew, and commitment to sustainable marine tourism.',
  '/contact': 'Contact Expedition OZ for bookings and inquiries. Phone, email, or WhatsApp. Exmouth, Western Australia. Response within 24 hours.',
  '/faq': 'FAQ — What to pack, seasickness, diving certification, payment terms, cancellation policy, best time to visit Ningaloo Reef. All your questions answered.',
}

// ─── Schema builders ───
export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Expedition OZ',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Luxury live-aboard expeditions in Ningaloo Reef, Western Australia',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Exmouth',
      addressRegion: 'WA',
      addressCountry: 'AU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -21.9315,
      longitude: 114.1280,
    },
    telephone: '+61-xxx-xxx-xxx',
    priceRange: '$$$$',
    sameAs: [
      'https://facebook.com/expeditionoz',
      'https://instagram.com/expeditionoz',
    ],
  }
}

export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildFAQSchema(questions: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((qa) => ({
      '@type': 'Question',
      name: qa.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.a,
      },
    })),
  }
}

export function buildProductSchema(config: {
  name: string
  description: string
  image: string
  price: string
  url: string
  ratingValue?: string
  reviewCount?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: config.name,
    description: config.description,
    image: config.image,
    brand: {
      '@type': 'Brand',
      name: 'Expedition OZ',
    },
    offers: {
      '@type': 'Offer',
      price: config.price,
      priceCurrency: 'AUD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
      url: config.url,
    },
    ...(config.ratingValue && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: config.ratingValue,
        reviewCount: config.reviewCount || '93',
      },
    }),
  }
}

// ─── Main composable ───
export function useSEO(config: SEOConfig = {}) {
  const route = useRoute()

  const seo = computed(() => {
    const path = config.path || route.path
    const title = config.title
      ? `${config.title} | ${SITE_NAME}`
      : `${SITE_NAME} | Luxury Meets Nature`

    return {
      title,
      description:
        config.description ||
        DEFAULT_DESCRIPTIONS[path] ||
        DEFAULT_DESCRIPTIONS['/'],
      canonical: `${SITE_URL}${path}`,
      ogImage: config.image || DEFAULT_IMAGE,
      ogType: (config.type || 'website') as 'website' | 'article' | 'product',
      robots: config.noindex ? 'noindex, nofollow' : 'index, follow',
      keywords:
        config.keywords?.join(', ') ||
        'Ningaloo Reef, live-aboard, Western Australia, luxury tours, whale sharks, Exmouth, snorkeling',
    }
  })

  // ─── Meta tags ───
  useSeoMeta({
    title: () => seo.value.title,
    description: () => seo.value.description,
    ogTitle: () => seo.value.title,
    ogDescription: () => seo.value.description,
    ogImage: () => seo.value.ogImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/jpeg',
    ogUrl: () => seo.value.canonical,
    ogType: () => seo.value.ogType,
    ogSiteName: SITE_NAME,
    ogLocale: 'en_AU',
    twitterCard: 'summary_large_image',
    twitterTitle: () => seo.value.title,
    twitterDescription: () => seo.value.description,
    twitterImage: () => seo.value.ogImage,
  })

  // ─── Head tags ───
  useHead({
    htmlAttrs: { lang: 'en-AU' },
    link: [
      { rel: 'canonical', href: () => seo.value.canonical },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' }, // ← FIXED
    ],
    meta: [
      { name: 'author', content: config.author || 'Expedition OZ' },
      { name: 'theme-color', content: '#071a2b' },
      { name: 'keywords', content: () => seo.value.keywords },
      { name: 'robots', content: () => seo.value.robots },
    ],
    script: () => {
      const schemas: Record<string, any>[] = []

      // Add provided jsonLd
      if (config.jsonLd) {
        const ld = Array.isArray(config.jsonLd) ? config.jsonLd : [config.jsonLd]
        schemas.push(...ld)
      }

      // Always add Organization schema on every page
      schemas.push(buildOrganizationSchema())

      if (schemas.length === 0) return []

      return schemas.map((schema) => ({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema),
      }))
    },
  })
}