<script setup lang="ts">
import { useSEO, buildBreadcrumbSchema } from '@/composables/useSEO'
import { ref, defineComponent, h } from 'vue'
// Import useHead to manually set the canonical tag
// Note: Depending on your setup, this might be from 'vue-head' or '@unhead/vue'
import { useHead } from '@unhead/vue' 
import { useScrollReveal } from '@/composables/useScrollReveal'
import PageHero from '@/components/PageHero.vue'
import CtaSection from '@/components/home/CtaSection.vue'

useScrollReveal()

// Define the canonical URL explicitly
const canonicalUrl = 'https://expeditionoz.netlify.app/expeditions'

useHead({
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl
    }
  ]
})

useSEO({
  title: 'Our Expeditions — Luxury Live-Aboard Ningaloo Reef',
  description: 'Choose your luxury live-aboard adventure in Ningaloo Reef. Sylvia offers 4-day intimate reef exploration, while Millenium delivers 7-day ultimate wilderness immersion.',
  path: '/expeditions',
  // It is also good practice to pass the full URL here if your composable supports it, 
  // but the useHead block above is the critical fix for GSC.
  // canonical handled via useHead() above 
  type: 'website',
  jsonLd: [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Expedition OZ Live-Aboard Expeditions",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "item": {
            "@type": "Product",
            "name": "Sylvia 4-Day Northern Reef Expedition",
            "description": "Intimate luxury live-aboard in the northern Ningaloo Reef",
            "image": "https://expeditionoz.netlify.app/images/sylvia-hero.jpg",
            "brand": {
              "@type": "Brand",
              "name": "Expedition OZ"
            },
            "url": "https://expeditionoz.netlify.app/expeditions/sylvia",
            "offers": {
              "@type": "Offer",
              "price": "2495.00",
              "priceCurrency": "AUD",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31",
              "url": "https://expeditionoz.netlify.app/expeditions/sylvia",
              "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                  "@type": "MonetaryAmount",
                  "value": "0",
                  "currency": "AUD"
                },
                "shippingDestination": {
                  "@type": "DefinedRegion",
                  "addressCountry": "AU"
                }
              },
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "93"
            }
          }
        },
        {
          "@type": "ListItem",
          "position": 2,
          "item": {
            "@type": "Product",
            "name": "Millenium 7-Day Ultimate Reef Expedition",
            "description": "Ultimate 7-day full Ningaloo Reef live-aboard",
            "image": "https://expeditionoz.netlify.app/images/millenium-hero.jpg",
            "brand": {
              "@type": "Brand",
              "name": "Expedition OZ"
            },
            "url": "https://expeditionoz.netlify.app/expeditions/millenium",
            "offers": {
              "@type": "Offer",
              "price": "4495.00",
              "priceCurrency": "AUD",
              "availability": "https://schema.org/InStock",
              "priceValidUntil": "2026-12-31",
              "url": "https://expeditionoz.netlify.app/expeditions/millenium",
              "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                  "@type": "MonetaryAmount",
                  "value": "0",
                  "currency": "AUD"
                },
                "shippingDestination": {
                  "@type": "DefinedRegion",
                  "addressCountry": "AU"
                }
              },
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted"
              }
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "127"
            }
          }
        }
      ]
    },
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://expeditionoz.netlify.app/' },
      { name: 'Expeditions', url: canonicalUrl },
    ])
  ]
})

// ... Rest of the component logic remains exactly the same ...
const CheckIcon = defineComponent({
  props: {
    color: {
      type: String,
      default: 'var(--color-gold-400)'
    }
  },
  setup(props) {
    return () => h('svg', {
      width: '24',
      height: '24',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: props.color,
      'stroke-width': '2.5',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round'
    }, [
      h('polyline', { points: '20 6 9 17 4 12' })
    ])
  }
})

const XIcon = defineComponent({
  setup() {
    return () => h('svg', {
      width: '24',
      height: '24',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      style: { opacity: '0.3' }
    }, [
      h('line', { x1: '18', y1: '6', x2: '6', y2: '18' }),
      h('line', { x1: '6', y1: '6', x2: '18', y2: '18' })
    ])
  }
})

const hoveredVessel = ref<string | null>(null)
const mousePos = ref({ x: 0, y: 0 })

const handleMouseMove = (e: MouseEvent, vessel: string) => {
  mousePos.value = { x: e.clientX, y: e.clientY }
  hoveredVessel.value = vessel
}

const handleMouseLeave = () => {
  hoveredVessel.value = null
}

const compareRows = [
  { label: 'Duration', sylvia: '4 Days / 3 Nights', millenium: '7 Days / 6 Nights' },
  { label: 'Whale Shark Snorkeling', sylvia: true, millenium: true },
  { label: 'Reef Snorkeling', sylvia: true, millenium: true },
  { label: 'All Meals & Beverages', sylvia: true, millenium: true },
  { label: 'Marine Naturalist Guide', sylvia: true, millenium: true },
  { label: 'Kayaks & Paddleboards', sylvia: true, millenium: true },
  { label: 'Manta Ray Encounters', sylvia: false, millenium: true },
  { label: 'Night Snorkeling', sylvia: false, millenium: true },
  { label: 'Humpback Whale Watching', sylvia: false, millenium: true },
  { label: 'Premium Cabin Suites', sylvia: false, millenium: true },
  { label: 'Reef Length Covered', sylvia: 'Northern', millenium: 'Full Reef' },
]
</script>

<template>
  <div>
    <!-- ... Template content remains the same ... -->
    <Transition name="fade-scale">
      <div 
        v-if="hoveredVessel"
        class="vessel-hover-image"
        :style="{ 
          left: mousePos.x + 'px', 
          top: (mousePos.y - 220) + 'px' 
        }"
      >
        <img 
          v-if="hoveredVessel === 'sylvia'"
          src="https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=400"
          alt="Sylvia Vessel"
        />
        <img 
          v-else
          src="https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&w=400"
          alt="Millenium Vessel"
        />
        <div class="hover-label">{{ hoveredVessel === 'sylvia' ? 'Sylvia' : 'Millenium' }}</div>
      </div>
    </Transition>

    <PageHero
      tag="Our Vessels"
      title="Choose Your"
      title-italic="Expedition"
      subtitle="Two remarkable live-aboard vessels. One extraordinary reef. Your adventure of a lifetime."
      image="https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1920"
      image-alt="Luxury vessels on Ningaloo Reef"
    />

    <section class="py-12 md:py-24 lg:py-32" style="background: var(--color-ocean-950);">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="text-center mb-8 md:mb-16 section-reveal">
          <p class="overline-text mb-2 md:mb-4 text-xs md:text-sm">Ningaloo Reef, Western Australia</p>
          <div class="gold-divider mb-3 md:mb-6 mx-auto"></div>
          <h2 class="font-display text-2xl md:text-4xl lg:text-5xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
            Which expedition is <span class="italic" style="color: var(--color-gold-400);">right for you?</span>
          </h2>
        </div>

        <div class="hidden md:block comparison-grid section-reveal">
          <div class="comparison-header">
            <div></div>
            <div 
              class="vessel-header sylvia-header"
              @mousemove="(e) => handleMouseMove(e, 'sylvia')"
              @mouseleave="handleMouseLeave"
            >
              <p class="overline-text mb-1 text-[0.55rem]">Live-Aboard</p>
              <p class="font-display text-3xl font-light vessel-title">Sylvia</p>
              <p class="font-heading text-xs mt-1 opacity-60">4 DAY EXPEDITION</p>
            </div>
            <div 
              class="vessel-header millenium-header"
              @mousemove="(e) => handleMouseMove(e, 'millenium')"
              @mouseleave="handleMouseLeave"
            >
              <p class="overline-text mb-1 text-[0.55rem]">Premium Live-Aboard</p>
              <p class="font-display text-3xl font-light vessel-title">Millenium</p>
              <p class="font-heading text-xs mt-1 opacity-60">7 DAY EXPEDITION</p>
            </div>
          </div>

          <div v-for="row in compareRows" :key="row.label" class="comparison-row">
            <div class="compare-label">
              <p>{{ row.label }}</p>
            </div>
            <div class="compare-cell">
              <span v-if="row.sylvia === true"><CheckIcon /></span>
              <span v-else-if="row.sylvia === false" class="opacity-30"><XIcon /></span>
              <span v-else>{{ row.sylvia }}</span>
            </div>
            <div class="compare-cell">
              <span v-if="row.millenium === true"><CheckIcon color="#4ea8c9" /></span>
              <span v-else-if="row.millenium === false" class="opacity-30"><XIcon /></span>
              <span v-else>{{ row.millenium }}</span>
            </div>
          </div>

          <div class="comparison-footer">
            <div></div>
            <div class="text-center py-6">
              <router-link to="/expeditions/sylvia" class="btn-primary text-sm">View Sylvia</router-link>
            </div>
            <div class="text-center py-6">
              <router-link to="/expeditions/millenium" class="btn-outline text-sm">View Millenium</router-link>
            </div>
          </div>
        </div>

        <div class="md:hidden space-y-3 section-reveal">
          <div class="mobile-vessel-card" style="background: rgba(201, 168, 76, 0.08); border: 1px solid rgba(201, 168, 76, 0.2);">
            <div class="text-center py-3 px-3 border-b border-[rgba(201,168,76,0.2)]">
              <p class="overline-text mb-1 text-[0.6rem]">Live-Aboard</p>
              <p class="font-display text-xl font-light" style="font-family: var(--font-display); color: var(--color-gold-400);">Sylvia</p>
              <p class="font-heading text-xs mt-1 opacity-60" style="font-family: var(--font-heading); font-size: 0.65rem; letter-spacing: 0.15em;">4 DAY EXPEDITION</p>
            </div>
            <div class="p-3 space-y-2">
              <div v-for="row in compareRows" :key="'sylvia-'+row.label" class="mobile-feature-row">
                <p class="text-xs opacity-70 flex-1" style="font-family: var(--font-heading); color: var(--color-sand-200);">{{ row.label }}</p>
                <div class="flex items-center justify-end gap-2 min-w-[80px]">
                  <span v-if="row.sylvia === true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="var(--color-gold-400)" stroke-width="2.5" stroke-linecap="round"/></svg></span>
                  <span v-else-if="row.sylvia === false" class="opacity-30"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="white" stroke-width="2"/><line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2"/></svg></span>
                  <span v-else class="text-xs font-medium" style="font-family: var(--font-body); color: var(--color-sand-100);">{{ row.sylvia }}</span>
                </div>
              </div>
            </div>
            <div class="p-3 pt-0">
              <router-link to="/expeditions/sylvia" class="btn-primary w-full text-center block text-xs" style="padding: 10px;">View Sylvia</router-link>
            </div>
          </div>

          <div class="mobile-vessel-card" style="background: rgba(13, 110, 122, 0.08); border: 1px solid rgba(78, 168, 201, 0.3);">
            <div class="text-center py-3 px-3 border-b border-[rgba(78,168,201,0.3)]">
              <p class="overline-text mb-1 text-[0.6rem]" style="color: #4ea8c9 !important;">Premium Live-Aboard</p>
              <p class="font-display text-xl font-light" style="font-family: var(--font-display); color: #4ea8c9;">Millenium</p>
              <p class="font-heading text-xs mt-1 opacity-60" style="font-family: var(--font-heading); font-size: 0.65rem; letter-spacing: 0.15em;">7 DAY EXPEDITION</p>
            </div>
            <div class="p-3 space-y-2">
              <div v-for="row in compareRows" :key="'millenium-'+row.label" class="mobile-feature-row">
                <p class="text-xs opacity-70 flex-1" style="font-family: var(--font-heading); color: var(--color-sand-200);">{{ row.label }}</p>
                <div class="flex items-center justify-end gap-2 min-w-[80px]">
                  <span v-if="row.millenium === true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="#4ea8c9" stroke-width="2.5" stroke-linecap="round"/></svg></span>
                  <span v-else-if="row.millenium === false" class="opacity-30"><svg width="16" height="16" viewBox="0 0 24 24" fill="none"><line x1="18" y1="6" x2="6" y2="18" stroke="white" stroke-width="2"/><line x1="6" y1="6" x2="18" y2="18" stroke="white" stroke-width="2"/></svg></span>
                  <span v-else class="text-xs font-medium" style="font-family: var(--font-body); color: var(--color-sand-100);">{{ row.millenium }}</span>
                </div>
              </div>
            </div>
            <div class="p-3 pt-0">
              <router-link to="/expeditions/millenium" class="btn-outline w-full text-center block text-xs" style="padding: 10px; border-color: #4ea8c9; color: #4ea8c9;">View Millenium</router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <CtaSection />
  </div>
</template>

<style scoped>
/* ... Styles remain the same ... */
.vessel-hover-image {
  position: fixed;
  width: 280px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  z-index: 100;
  pointer-events: none;
  transform: translateX(-50%);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(201, 168, 76, 0.3);
}

.vessel-hover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hover-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(to top, rgba(7, 26, 43, 0.95), transparent);
  color: var(--color-gold-400);
  font-family: var(--font-display);
  font-size: 1.25rem;
  text-align: center;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: translateX(-50%) scale(0.9) translateY(10px);
}

.vessel-header {
  text-align: center;
  padding: 24px 16px;
  cursor: pointer;
  transition: background 0.3s ease;
  position: relative;
}

.sylvia-header {
  background: rgba(201, 168, 76, 0.08);
  border-bottom: 2px solid var(--color-gold-400);
}

.sylvia-header:hover {
  background: rgba(201, 168, 76, 0.15);
}

.sylvia-header .vessel-title {
  color: var(--color-gold-400);
}

.millenium-header {
  background: rgba(13, 110, 122, 0.08);
  border-bottom: 2px solid #4ea8c9;
}

.millenium-header:hover {
  background: rgba(13, 110, 122, 0.15);
}

.millenium-header .vessel-title {
  color: #4ea8c9;
}

.millenium-header .overline-text {
  color: #4ea8c9 !important;
}

.comparison-grid {
  border: 1px solid rgba(201, 168, 76, 0.15);
}

.comparison-header,
.comparison-row,
.comparison-footer {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

.comparison-row {
  border-top: 1px solid rgba(201, 168, 76, 0.08);
}

.comparison-row:nth-child(even) {
  background: rgba(255, 255, 255, 0.02);
}

.compare-label {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  border-right: 1px solid rgba(201, 168, 76, 0.08);
  font-family: var(--font-heading);
  font-size: 0.75rem;
  color: rgba(248,245,239,0.7);
  letter-spacing: 0.05em;
}

.compare-cell {
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(201, 168, 76, 0.08);
  font-family: var(--font-body);
  color: var(--color-sand-200);
}

.comparison-footer {
  border-top: 1px solid rgba(201, 168, 76, 0.15);
}
</style>