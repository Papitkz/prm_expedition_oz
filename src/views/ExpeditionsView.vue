<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSEO } from '@/composables/useSEO'
import { useScrollReveal } from '@/composables/useScrollReveal'
import CtaSection from '@/components/home/CtaSection.vue'
import PageHero from '@/components/PageHero.vue'
import NoImagePlaceholder from '@/components/NoImagePlaceholder.vue'
import { useComponentCMS } from '@/composables/useComponentCMS'

const cms = useComponentCMS('ExpeditionsView')
const router = useRouter()

useSEO({
  title: 'Our Expeditions – Luxury Live-Aboard Adventures',
  description: 'Explore our luxury live-aboard expeditions at Ningaloo Reef. The Sylvia 4-day and Millenium 7-day experiences offer intimate whale shark encounters, world-class dining, and premium accommodations.',
  path: '/expeditions',
  type: 'website',
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Product",
          "name": "Sylvia 4-Day Northern Reef Expedition",
          "description": "Intimate 4-day luxury live-aboard in the northern Ningaloo Reef",
          "url": "https://expeditionoz.netlify.app/expeditions/sylvia",
          "image": "https://expeditionoz.netlify.app/images/sylvia-hero.jpg",
          "offers": {
            "@type": "Offer",
            "price": "2495.00",
            "priceCurrency": "AUD"
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@type": "Product",
          "name": "Millenium 7-Day Ultimate Expedition",
          "description": "Flagship 7-day live-aboard expedition aboard the Millenium",
          "url": "https://expeditionoz.netlify.app/expeditions/millenium",
          "image": "https://expeditionoz.netlify.app/images/millenium-hero.jpg",
          "offers": {
            "@type": "Offer",
            "price": "3995.00",
            "priceCurrency": "AUD"
          }
        }
      }
    ]
  }
})

useScrollReveal()

const heroImage = computed(() => cms.getImageUrl('hero', 0))

const hoverImages = computed(() =>
  cms.getSection('hoverImages').map((item) => ({
    src: item.imageUrl || '',
    alt: item.alt || '',
    hasImage: !!item.imageUrl,
  }))
)

const sylviaHover = computed(() => hoverImages.value[0])
const milleniumHover = computed(() => hoverImages.value[1])

onMounted(async () => {
  await cms.load()
})
</script>

<template>
  <div>
    <PageHero
      title="Our Expeditions"
      subtitle="Discover"
      description="Choose your Ningaloo Reef adventure — from intimate 4-day escapes to the ultimate 7-day expedition"
      image=""
      height="60vh"
    >
      <template #default>
        <template v-if="heroImage">
          <img
            :src="heroImage"
            alt="Ningaloo Reef at sunset"
            class="absolute inset-0 w-full h-full object-cover"
          />
        </template>
        <NoImagePlaceholder v-else class="absolute inset-0" />
      </template>
    </PageHero>

    <section class="py-12 md:py-24" style="background: var(--color-ocean-950);">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-8 md:mb-16 section-reveal">
            <p class="overline-text mb-2 md:mb-4 text-xs md:text-sm">Choose Your Adventure</p>
            <div class="gold-divider mb-3 md:mb-6 mx-auto"></div>
            <h2 class="font-display text-2xl md:text-4xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
              Two Ways to <span class="italic" style="color: var(--color-gold-400);">Experience Ningaloo</span>
            </h2>
          </div>

          <div class="grid md:grid-cols-2 gap-4 md:gap-6">
            <!-- Sylvia Card -->
            <div 
              class="relative overflow-hidden group cursor-pointer section-reveal"
              @click="router.push('/expeditions/sylvia')"
              style="transition-delay: 0.1s;"
            >
              <div class="relative h-72 md:h-[500px] overflow-hidden">
                <template v-if="sylviaHover?.hasImage">
                  <img
                    :src="sylviaHover.src"
                    :alt="sylviaHover.alt || 'Sylvia expedition preview'"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </template>
                <NoImagePlaceholder v-else label="No Sylvia Preview" class="h-full" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#0A2E4A] via-[#0A2E4A]/40 to-transparent" />
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                <p class="overline-text text-[0.5rem] md:text-xs mb-1 md:mb-2">4 Day Live-Aboard</p>
                <h3 class="font-display text-2xl md:text-4xl font-light mb-2" style="font-family: var(--font-display); color: var(--color-sand-100);">
                  Sylvia
                </h3>
                <p class="font-display text-sm md:text-lg italic mb-2 md:mb-4" style="color: var(--color-gold-400);">
                  Northern Reef Expedition
                </p>
                <p class="text-xs md:text-sm opacity-70 mb-3 md:mb-6" style="color: var(--color-sand-200);">
                  Intimate 4-day experience. Maximum 12 guests. Northern reef exploration with whale shark encounters, coral gardens, and all-inclusive luxury.
                </p>
                <div class="flex items-center gap-3 md:gap-6 mb-3 md:mb-4">
                  <div>
                    <p class="font-display text-lg md:text-2xl font-light" style="color: var(--color-gold-400);">4</p>
                    <p class="overline-text text-[0.5rem] md:text-xs">Days</p>
                  </div>
                  <div class="w-px h-6 md:h-8 bg-[#C9A84C]/30" />
                  <div>
                    <p class="font-display text-lg md:text-2xl font-light" style="color: var(--color-gold-400);">12</p>
                    <p class="overline-text text-[0.5rem] md:text-xs">Max Guests</p>
                  </div>
                  <div class="w-px h-6 md:h-8 bg-[#C9A84C]/30" />
                  <div>
                    <p class="font-display text-lg md:text-2xl font-light" style="color: var(--color-gold-400);">$2,495</p>
                    <p class="overline-text text-[0.5rem] md:text-xs">Per Person</p>
                  </div>
                </div>
                <span class="btn-primary inline-block text-xs md:text-sm px-4 py-2 md:px-6 md:py-3">
                  Explore Sylvia
                </span>
              </div>
            </div>

            <!-- Millenium Card -->
            <div 
              class="relative overflow-hidden group cursor-pointer section-reveal"
              @click="router.push('/expeditions/millenium')"
              style="transition-delay: 0.2s;"
            >
              <div class="relative h-72 md:h-[500px] overflow-hidden">
                <template v-if="milleniumHover?.hasImage">
                  <img
                    :src="milleniumHover.src"
                    :alt="milleniumHover.alt || 'Millenium expedition preview'"
                    class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </template>
                <NoImagePlaceholder v-else label="No Millenium Preview" class="h-full" />
                <div class="absolute inset-0 bg-gradient-to-t from-[#0A2E4A] via-[#0A2E4A]/40 to-transparent" />
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-4 md:p-8">
                <p class="overline-text text-[0.5rem] md:text-xs mb-1 md:mb-2">7 Day Live-Aboard</p>
                <h3 class="font-display text-2xl md:text-4xl font-light mb-2" style="font-family: var(--font-display); color: var(--color-sand-100);">
                  Millenium
                </h3>
                <p class="font-display text-sm md:text-lg italic mb-2 md:mb-4" style="color: var(--color-gold-400);">
                  The Complete Expedition
                </p>
                <p class="text-xs md:text-sm opacity-70 mb-3 md:mb-6" style="color: var(--color-sand-200);">
                  Our flagship 7-day adventure. Maximum 14 guests. Northern and southern reef, luxury suites, fine dining, and the most comprehensive Ningaloo experience.
                </p>
                <div class="flex items-center gap-3 md:gap-6 mb-3 md:mb-4">
                  <div>
                    <p class="font-display text-lg md:text-2xl font-light" style="color: var(--color-gold-400);">7</p>
                    <p class="overline-text text-[0.5rem] md:text-xs">Days</p>
                  </div>
                  <div class="w-px h-6 md:h-8 bg-[#C9A84C]/30" />
                  <div>
                    <p class="font-display text-lg md:text-2xl font-light" style="color: var(--color-gold-400);">14</p>
                    <p class="overline-text text-[0.5rem] md:text-xs">Max Guests</p>
                  </div>
                  <div class="w-px h-6 md:h-8 bg-[#C9A84C]/30" />
                  <div>
                    <p class="font-display text-lg md:text-2xl font-light" style="color: var(--color-gold-400);">$3,995</p>
                    <p class="overline-text text-[0.5rem] md:text-xs">Per Person</p>
                  </div>
                </div>
                <span class="btn-primary inline-block text-xs md:text-sm px-4 py-2 md:px-6 md:py-3">
                  Explore Millenium
                </span>
              </div>
            </div>
          </div>

          <div class="mt-8 md:mt-16 text-center section-reveal">
            <p class="text-xs md:text-sm opacity-70 mb-3 md:mb-4 max-w-2xl mx-auto" style="color: var(--color-sand-200);">
              Both expeditions depart from Exmouth, Western Australia — the gateway to Ningaloo Reef. All expeditions are fully inclusive: meals, beverages, snorkel gear, and marine naturalist guides.
            </p>
            <router-link to="/book" class="btn-primary inline-block text-xs md:text-sm px-5 py-3 md:px-8 md:py-4">
              Check Availability & Book
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <CtaSection />
  </div>
</template>
