import { useHead, useSeoMeta } from '@unhead/vue'
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
  jsonLd?: Record<string, any> | Record<string, any>[]
  articlePublishedAt?: string
  articleModifiedAt?: string
  articleTags?: string[]
}

const SITE_NAME = 'Expedition OZ'
const SITE_URL = 'https://expeditionoz.netlify.app'
const DEFAULT_IMAGE = `${SITE_URL}/og-default.jpg`

const DEFAULT_DESCRIPTIONS: Record<string, string> = {
  '/': 'Book luxury live-aboard Ningaloo Reef tours. Swim with whale sharks, snorkel coral gardens aboard Sylvia (4-day, from $2,495) or Millenium (7-day, from $4,495). 2026 season open.',
  '/expeditions': 'Choose your Ningaloo Reef expedition — Sylvia 4-day northern reef or Millenium 7-day full reef. Luxury live-aboard with whale sharks, gourmet dining & guided snorkeling.',
  '/expeditions/sylvia': 'Sylvia 4-day Northern Reef expedition — intimate luxury live-aboard with whale shark encounters, gourmet dining & guided snorkeling. From $2,495 AUD. Book 2026.',
  '/expeditions/millenium': 'Millenium 7-day ultimate Ningaloo Reef expedition. Full reef exploration, remote dive sites, luxury cabins. From $4,495 AUD. 2026 season now open.',
  '/about': 'Learn about Expedition OZ — luxury live-aboard expeditions in Ningaloo Reef since 2018. Our mission, crew, and commitment to sustainable marine tourism.',
  '/contact': 'Contact Expedition OZ for bookings and inquiries. Phone, email, or WhatsApp. Exmouth, Western Australia. Response within 24 hours.',
  '/faq': 'FAQ — What to pack, seasickness, diving certification, payment terms, cancellation policy, best time to visit Ningaloo Reef. All your questions answered.',
  '/blog': 'Stories, guides, and insights from Ningaloo Reef. Read about whale shark encounters, marine conservation, and life aboard our luxury vessels.',
}

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
    telephone: '+61-234-567-890',
    priceRange: '$$$$',
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

export function buildArticleSchema(config: {
  title: string
  description: string
  image: string
  url: string
  publishedAt: string
  modifiedAt?: string
  author?: string
  tags?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: config.title,
    description: config.description,
    image: config.image,
    url: config.url,
    datePublished: config.publishedAt,
    dateModified: config.modifiedAt || config.publishedAt,
    author: {
      '@type': 'Person',
      name: config.author || 'Expedition OZ',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Expedition OZ',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    keywords: config.tags?.join(', ') || 'Ningaloo Reef, whale sharks, Western Australia',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': config.url,
    },
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
  const title = config.title ? `${config.title} | ${SITE_NAME}` : `${SITE_NAME} | Luxury Meets Nature`
  const description = config.description || DEFAULT_DESCRIPTIONS[path] || DEFAULT_DESCRIPTIONS['/']
  const canonical = `${SITE_URL}${path}`
  const ogImage = config.image || DEFAULT_IMAGE
  const ogType = config.type || 'website'
  const robots = config.noindex ? 'noindex, nofollow' : 'index, follow'
  const keywords = config.keywords?.join(', ') || 'Ningaloo Reef, live-aboard, Western Australia, luxury tours, whale sharks, Exmouth, snorkeling'

  // Use useHead for googlebot meta to avoid zhead type restrictions
  useHead({
    meta: [
      { name: 'robots', content: robots },
      { name: 'googlebot', content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' },
      { name: 'bingbot', content: 'index, follow' },
    ],
  })

  useSeoMeta({
    title: () => title,
    titleTemplate: (t) => t === SITE_NAME ? `${SITE_NAME} | Luxury Meets Nature` : t as string,
    description: () => description,
    ogTitle: () => title,
    ogDescription: () => description,
    ogImage: () => ogImage,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageType: 'image/jpeg',
    ogUrl: () => canonical,
    ogType: ogType as 'website' | 'article',
    ogSiteName: SITE_NAME,
    ogLocale: 'en_AU',
    twitterCard: 'summary_large_image',
    twitterTitle: () => title,
    twitterDescription: () => description,
    twitterImage: () => ogImage,
    twitterSite: '@ExpeditionOz',
    twitterCreator: '@ExpeditionOz',
    author: () => config.author || 'Expedition OZ',
    keywords: () => keywords,
    articlePublishedTime: config.articlePublishedAt,
    articleModifiedTime: config.articleModifiedAt,
    articleAuthor: config.author ? [config.author] : undefined,
    articleTag: config.articleTags,
    articleSection: 'Travel',
  })

  useHead({
    htmlAttrs: { lang: 'en-AU', dir: 'ltr' },
    link: [
      { rel: 'canonical', href: canonical },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
      { rel: 'dns-prefetch', href: 'https://cdn.freebiesupply.com' },
      { rel: 'alternate', hreflang: 'en-au', href: canonical },
      { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}${path}` },
      { rel: 'sitemap', type: 'application/xml', href: `${SITE_URL}/sitemap.xml`, title: 'Sitemap' },
    ],
    meta: [
      { name: 'author', content: config.author || 'Expedition OZ' },
      { name: 'theme-color', content: '#071a2b', media: '(prefers-color-scheme: dark)' },
      { name: 'theme-color', content: '#f8f5ef', media: '(prefers-color-scheme: light)' },
      { name: 'msapplication-TileColor', content: '#071a2b' },
      { name: 'msapplication-config', content: '/browserconfig.xml' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'apple-mobile-web-app-title', content: SITE_NAME },
      { name: 'application-name', content: SITE_NAME },
      { name: 'format-detection', content: 'telephone=no' },
      { property: 'fb:app_id', content: '1234567890' },
    ],
    script: () => {
      const schemas: Record<string, any>[] = []

      if (config.jsonLd) {
        const ld = Array.isArray(config.jsonLd) ? config.jsonLd : [config.jsonLd]
        schemas.push(...ld)
      }

      // Add article schema if this is an article type
      if (config.type === 'article' && config.articlePublishedAt) {
        schemas.push(buildArticleSchema({
          title: config.title || 'Blog Post',
          description: description,
          image: ogImage,
          url: canonical,
          publishedAt: config.articlePublishedAt,
          modifiedAt: config.articleModifiedAt,
          author: config.author,
          tags: config.articleTags,
        }))
      }

      schemas.push(buildOrganizationSchema())

      if (schemas.length === 0) return []

      return schemas.map((schema) => ({
        type: 'application/ld+json',
        innerHTML: JSON.stringify(schema),
      }))
    },
  })
}
