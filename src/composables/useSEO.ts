import { useHead, useSeoMeta } from '@unhead/vue'
import { useRoute } from 'vue-router'

interface SEOConfig {
  title?: string
  description?: string
  image?: string
  path?: string
  type?: 'website' | 'article' | 'product'
  noindex?: boolean
  author?: string
  jsonLd?: Record<string, any> | Record<string, any>[]
}

const SITE_NAME = 'Expedition OZ'
const SITE_URL = 'https://expeditionoz.netlify.app'
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  '/': 'Experience luxury live-aboard expeditions on Ningaloo Reef. Swim with whale sharks, snorkel coral gardens aboard Sylvia or Millenium. Departures from Exmouth, WA.',
  '/expeditions': 'Choose your Ningaloo Reef expedition — Sylvia 4-day northern reef or Millenium 7-day full reef. Luxury live-aboard with whale sharks, gourmet dining & guided snorkeling.',
  '/expeditions/sylvia': 'Sylvia 4-day Northern Reef expedition — intimate luxury live-aboard with whale shark encounters, gourmet dining & guided snorkeling. From $2,495 AUD. Book 2026.',
  '/expeditions/millenium': 'Millenium 7-day ultimate Ningaloo Reef expedition. Full reef exploration, remote dive sites, luxury cabins. From $4,495 AUD. 2026 season now open.',
  '/about': 'Learn about Expedition OZ — luxury live-aboard expeditions in Ningaloo Reef since 2018. Our mission, crew, and commitment to sustainable marine tourism.',
  '/contact': 'Contact Expedition OZ for bookings and inquiries. Phone, email, or WhatsApp. Exmouth, Western Australia. Response within 24 hours.',
  '/faq': 'FAQ — What to pack, seasickness, diving certification, payment terms, cancellation policy, best time to visit Ningaloo Reef. All your questions answered.',
}

export function buildOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Expedition OZ',
    alternateName: ['ExpeditionOZ', 'Expeditionoz'],
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Luxury live-aboard expeditions in Ningaloo Reef, Western Australia',
    email: 'info@expeditionoz.com.au',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Your Street Address',
      addressLocality: 'Exmouth',
      addressRegion: 'WA',
      postalCode: '6707',
      addressCountry: 'AU',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -21.9315,
      longitude: 114.1280,
    },
    telephone: '+61-234-567-890',
    priceRange: '$$$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '17:00',
    },
    sameAs: [
      'https://www.facebook.com/ExpeditionOz/',
      'https://instagram.com/ExpeditionOz',
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
    brand: { '@type': 'Brand', name: 'Expedition OZ' },
    offers: {
      '@type': 'Offer',
      price: config.price,
      priceCurrency: 'AUD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2026-12-31',
      url: config.url,
      seller: {
        '@type': 'Organization',
        name: 'Expedition OZ',
        url: SITE_URL,
      },
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

export function useSEO(config: SEOConfig = {}) {
  const route = useRoute()

  const path = config.path || route.path
  const title = config.title ? `${config.title} | ${SITE_NAME}` : `${SITE_NAME} | Luxury Live-Aboard Ningaloo Reef`
  const description = config.description || DEFAULT_DESCRIPTIONS[path] || DEFAULT_DESCRIPTIONS['/']
  const canonical = `${SITE_URL}${path}`
  const ogImage = config.image || DEFAULT_IMAGE
  const ogType = config.type || 'website'
  const robots = config.noindex ? 'noindex, nofollow' : 'index, follow'

  useSeoMeta({
    title: () => title,
    description: () => description,
    ogTitle: () => title,
    ogDescription: () => description,
    ogImage: () => ogImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/jpeg',
    ogUrl: () => canonical,
    ogType: () => ogType,
    ogSiteName: SITE_NAME,
    ogLocale: 'en_AU',
    twitterCard: 'summary_large_image',
    twitterTitle: () => title,
    twitterDescription: () => description,
    twitterImage: () => ogImage,
    twitterUrl: () => canonical,
  })

  useHead({
    htmlAttrs: { lang: 'en-AU' },
    link: [
      { rel: 'canonical', href: canonical },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    ],
    meta: [
      { name: 'author', content: config.author || 'Expedition OZ' },
      { name: 'theme-color', content: '#071a2b' },
      { name: 'robots', content: robots },
    ],
    script: () => {
      const schemas: Record<string, any>[] = []

      schemas.push(buildOrganizationSchema())

      if (config.jsonLd) {
        const ld = Array.isArray(config.jsonLd) ? config.jsonLd : [config.jsonLd]
        schemas.push(...ld)
      }

      return schemas.map((schema) => ({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema),
      }))
    },
  })
}
