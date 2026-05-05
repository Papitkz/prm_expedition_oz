<script setup lang="ts">
import { useSEO, buildBreadcrumbSchema } from '@/composables/useSEO'
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import CtaSection from '@/components/home/CtaSection.vue'

useScrollReveal()

useSEO(
  {
  title: 'Millenium – 7-Day Ultimate Expedition',
  description: 'Millenium: The ultimate 7-day Ningaloo Reef live-aboard adventure. Full reef coverage, whale sharks, manta rays, humpback whales, night snorkeling, and premium cabin suites.',
  path: '/expeditions/millenium',
  type: 'product',
  jsonLd: [
   {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Millenium 7-Day Ultimate Reef Expedition",
    "description": "Seven transformative days encompassing the full length of Ningaloo Reef aboard our premium vessel",
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
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 1,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 0,
            "maxValue": 0,
            "unitCode": "DAY"
          }
        }
      },
      "hasMerchantReturnPolicy": {
        "@type": "MerchantReturnPolicy",
        "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
        "applicableCountry": "AU"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "127"
    }
  },
    buildBreadcrumbSchema([
      { name: 'Home', url: 'https://expeditionoz.netlify.app/' },
      { name: 'Expeditions', url: 'https://expeditionoz.netlify.app/expeditions' },
      { name: 'Millenium', url: 'https://expeditionoz.netlify.app/expeditions/millenium' },
    ])
  ]

}
)

const isVideoLoaded = ref(false)
const showVideo = ref(true)
const videoElement = ref<HTMLVideoElement | null>(null)
const showCabinModal = ref(false)
const activeDay = ref(0)

const itinerary = [
  { 
    day: 'Day 1', 
    title: 'Embarkation & Welcome Dinner', 
    desc: 'Board Millenium at Exmouth Marina. Settle into your premium suite with en-suite bathroom and ocean views. Meet the crew and fellow expeditioners over champagne and canapés. Sunset departure as we head to our first anchorage in the northern reef.',
    image: 'https://plus.unsplash.com/premium_photo-1682804227999-899fd9011e45?q=80&w=1075&auto=format&fit=crop',
    activity: 'Boarding & Departure',
    meals: 'Dinner'
  },
  { 
    day: 'Day 2', 
    title: 'Whale Shark Encounter', 
    desc: 'Our spotter plane locates whale sharks from above while you enjoy breakfast. Multiple swims with the oceans most gentle giants, guided by our marine naturalist. Each encounter is unique — these prehistoric creatures can reach 12 meters in length.',
    image: 'https://images.unsplash.com/photo-1576124344805-c47cea66b0db?q=80&w=1112&auto=format&fit=crop',
    activity: 'Whale Shark Swimming',
    meals: 'All Meals'
  },
  { 
    day: 'Day 3', 
    title: 'Manta Ray Dive & Coral Gardens', 
    desc: 'Head to the legendary cleaning stations where manta rays congregate. Drift over dramatic coral formations — an otherworldly experience. Our dive masters guide you through underwater cathedrals of coral teeming with life.',
    image: 'https://images.unsplash.com/photo-1616464592706-f39e5b192451?q=80&w=1633&auto=format&fit=crop',
    activity: 'Manta Rays & Diving',
    meals: 'All Meals'
  },
  { 
    day: 'Day 4', 
    title: 'Deep Reef & Night Snorkel', 
    desc: 'Explore deeper sections of the reef accessible only to live-aboard guests. After a gourmet dinner, descend for our magical night snorkel experience. Witness the reef transform as nocturnal creatures emerge — a completely different world.',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1200&q=80',
    activity: 'Night Snorkeling',
    meals: 'All Meals'
  },
  { 
    day: 'Day 5', 
    title: 'Humpback Whale Watching', 
    desc: 'During season (June-November), encounter humpback whales in their natural environment. Watch from the deck as they breach and play, or enter the water for an encounter that will leave you speechless. These magnificent creatures travel 5,000km to reach these waters.',
    image: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1200&q=80',
    activity: 'Whale Watching',
    meals: 'All Meals'
  },
  { 
    day: 'Day 6', 
    title: 'Coral Bay & Reef Walk', 
    desc: 'Anchor at Coral Bay, a pristine section of the southern reef. Guided reef walk at low tide reveals marine life usually hidden beneath the waves. Kayaking in glassy bays, stand-up paddleboarding, and our finest dinner yet — a beach barbecue under the stars.',
    image: 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=1200&q=80',
    activity: 'Beach & Water Sports',
    meals: 'Beach BBQ Dinner'
  },
  { 
    day: 'Day 7', 
    title: 'Final Morning & Farewell', 
    desc: 'One last sunrise snorkel in paradise. A champagne farewell brunch featuring local delicacies and fresh fruits. Exchange contact details with new friends as we cruise back to Exmouth. You will return, forever changed by the ocean.',
    image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80',
    activity: 'Return & Brunch',
    meals: 'Champagne Brunch'
  },
]

const vesselImages = [
  { src: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=800&q=80', caption: 'Millenium at Anchor', category: 'Exterior', size: 'large' },
  { src: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', caption: 'Premium Suite', category: 'Accommodation', size: 'normal' },
  { src: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80', caption: 'Master Cabin', category: 'Accommodation', size: 'normal' },
  { src: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=800&q=80', caption: 'Observation Deck', category: 'Common Areas', size: 'large' },
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80', caption: 'Dining Salon', category: 'Dining', size: 'normal' },
  { src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80', caption: 'Dive Platform', category: 'Activities', size: 'normal' },
  { src: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80', caption: 'Gourmet Galley', category: 'Dining', size: 'normal' },
  { src: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', caption: 'Lounge Area', category: 'Common Areas', size: 'normal' },
]

const diningImages = [
  { src: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80', title: 'Sunset Dining', desc: 'Multi-course dinners on deck', featured: true },
  { src: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=600&q=80', title: 'Exmouth Seafood', desc: 'Western Australian prawns and fish', featured: false },
  { src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80', title: 'Margaret River Wines', desc: 'Premium WA cellar selection', featured: false },
  { src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80', title: 'Beach BBQ', desc: 'Private Coral Bay dining', featured: false },
  { src: 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=600&q=80', title: 'Champagne Brunch', desc: 'Farewell celebration', featured: false },
  { src: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=600&q=80', title: 'Chefs Table', desc: 'Interactive culinary experience', featured: false },
]

const highlights = [
  'Full reef length covered — northern to southern Ningaloo',
  'Whale shark swims with expert marine naturalist',
  'Manta ray encounters at cleaning stations',
  'Night snorkeling experience',
  'Humpback whale watching (seasonal)',
  'Premium cabin suites with en-suite bathrooms',
  'All meals, wine, cocktails and beverages',
  'Kayaks, paddleboards, and water toys',
  'Guided reef walks at low tide',
  'Maximum 14 guests — intimate and exclusive',
  'Spotter aircraft for whale shark location',
  'Reef conservation briefings and marine talks',
]

const lightboxOpen = ref(false)
const currentImage = ref(0)

const openLightbox = (index: number) => {
  currentImage.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

const nextImage = () => {
  currentImage.value = (currentImage.value + 1) % vesselImages.length
}

const prevImage = () => {
  currentImage.value = (currentImage.value - 1 + vesselImages.length) % vesselImages.length
}

const toggleVideo = () => {
  if (videoElement.value) {
    if (videoElement.value.paused) {
      videoElement.value.play()
      showVideo.value = true
    } else {
      videoElement.value.pause()
      showVideo.value = false
    }
  }
}

onMounted(() => {
  const video = document.querySelector('video')
  if (video) {
    video.addEventListener('error', () => { showVideo.value = false })
    video.addEventListener('loadeddata', () => { isVideoLoaded.value = true })
  }
})
</script>

<template>
  <div>
    <!-- Cinematic Video Hero -->
    <section class="relative h-[85vh] md:h-screen w-full overflow-hidden bg-[#0A2E4A]">
      <div class="absolute inset-0 z-0">
        <video
          ref="videoElement"
          v-show="showVideo"
          autoplay
          muted
          loop
          playsinline
          poster="https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1920&q=80"
          class="w-full h-full object-cover"
          @loadeddata="isVideoLoaded = true"
        >
          <source src="https://videos.pexels.com/video-files/28268195/12345243_2560_1440_25fps.mp4" type="video/mp4">
        </video>
        <div 
          v-if="!showVideo" 
          class="w-full h-full bg-cover bg-center"
          style="background-image: url('https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1920&q=80')"
        />
        <div class="absolute inset-0 bg-[#0A2E4A]/70" />
        <div class="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
        <div class="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
      </div>

      <div class="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6">
        <div class="section-reveal">
          <p class="overline-text mb-3 md:mb-4 text-xs md:text-base tracking-[0.3em] md:tracking-[0.4em] text-[#C9A84C] font-medium">7 Day Premium Live-Aboard</p>
          <h1 class="font-display text-5xl md:text-8xl lg:text-9xl font-light text-white mb-3 md:mb-4 tracking-tight" style="font-family: var(--font-display);">
            Millenium
          </h1>
          <p class="font-display text-xl md:text-4xl lg:text-5xl italic text-[#C9A84C] mb-6 md:mb-8" style="font-family: var(--font-display);">
            The Ultimate Reef Expedition
          </p>
          <p class="max-w-3xl text-sm md:text-xl text-white/90 mb-8 md:mb-10 font-light leading-relaxed px-2">
            Seven transformative days encompassing the full length of Ningaloo Reef. 
            From whale sharks to humpback whales, this is the definitive ocean adventure.
          </p>

          <div class="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
            <router-link to="/contact" class="btn-primary px-8 py-4 md:px-10 md:py-5 text-sm md:text-lg tracking-wide">
              Reserve Your Expedition
            </router-link>
          </div>
        </div>
      </div>

      <div class="absolute bottom-6 md:bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-1 md:gap-2 animate-pulse">
        <span class="text-[10px] md:text-[10px] uppercase tracking-[0.3em] text-white/60">Scroll</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5" class="animate-bounce">
          <path d="M12 5v14M19 12l-7 7-7-7"/>
        </svg>
      </div>
    </section>

    <!-- About Section -->
    <section class="py-12 md:py-32" style="background: var(--color-ocean-950);">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 lg:gap-20 items-center">
          <div class="section-reveal-left order-2 lg:order-1">
            <p class="overline-text mb-2 md:mb-3 text-xs md:text-sm">The Flagship Experience</p>
            <div class="gold-divider-left mb-4 md:mb-6"></div>
            <h2 class="font-display text-3xl md:text-5xl lg:text-6xl font-light mb-4 md:mb-6 leading-tight" style="font-family: var(--font-display); color: var(--color-sand-100);">
              The <span class="italic" style="color: var(--color-gold-400);">Complete</span><br>Ningaloo Experience
            </h2>
            <p class="text-sm md:text-lg leading-relaxed mb-4 md:mb-6 opacity-80" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.9;">
              The Millenium expedition is the flagship Expedition OZ experience. Seven extraordinary days aboard our most premium vessel, covering the entire length of Ningaloo Reef — from the northern whale shark grounds to the southern manta ray cleaning stations.
            </p>
            <p class="text-sm md:text-lg leading-relaxed mb-6 md:mb-10 opacity-80" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.9;">
              With premium cabin suites, a dedicated chef, and a maximum of 14 guests, Millenium delivers a truly exclusive experience that no shore-based tour can replicate. This is the expedition that changes people.
            </p>

            <div class="grid grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-10 pt-6 md:pt-8" style="border-top: 1px solid rgba(201, 168, 76, 0.2);">
              <div class="text-center">
                <p class="font-display text-2xl md:text-4xl font-light text-[#C9A84C]">7</p>
                <p class="text-[10px] md:text-[10px] uppercase tracking-wider mt-1 md:mt-2 opacity-60" style="color: var(--color-sand-200);">Days</p>
              </div>
              <div class="text-center">
                <p class="font-display text-2xl md:text-4xl font-light text-[#C9A84C]">14</p>
                <p class="text-[10px] md:text-[10px] uppercase tracking-wider mt-1 md:mt-2 opacity-60" style="color: var(--color-sand-200);">Guests</p>
              </div>
              <div class="text-center">
                <p class="font-display text-2xl md:text-4xl font-light text-[#C9A84C]">260<span class="text-sm md:text-xl">km</span></p>
                <p class="text-[10px] md:text-[10px] uppercase tracking-wider mt-1 md:mt-2 opacity-60" style="color: var(--color-sand-200);">Reef</p>
              </div>
              <div class="text-center">
                <p class="font-display text-2xl md:text-4xl font-light text-[#C9A84C]">5★</p>
                <p class="text-[10px] md:text-[10px] uppercase tracking-wider mt-1 md:mt-2 opacity-60" style="color: var(--color-sand-200);">Luxury</p>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 md:gap-4">
              <router-link to="/contact" class="btn-primary inline-block text-sm md:text-base px-6 py-3 md:px-8 md:py-4 text-center">
                Check Availability
              </router-link>
              <button 
                @click="showCabinModal = true"
                class="px-6 py-3 md:px-8 md:py-4 border border-[#C9A84C]/30 text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all text-xs md:text-sm uppercase tracking-wider text-center"
              >
                View Cabins
              </button>
            </div>
          </div>

          <div class="section-reveal-right order-1 lg:order-2">
            <div class="relative">
              <div class="grid grid-cols-2 gap-2 md:gap-3">
                <div class="space-y-2 md:space-y-3">
                  <div class="overflow-hidden h-36 md:h-64">
                    <img
                      src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80"
                      alt="Manta ray at Ningaloo Reef cleaning station"
                      class="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div class="overflow-hidden h-24 md:h-48">
                    <img
                      src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80"
                      alt="Sunset dining on deck"
                      class="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
                <div class="space-y-2 md:space-y-3 mt-4 md:mt-6">
                  <div class="overflow-hidden h-24 md:h-48">
                    <img
                      src="https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=600&q=80"
                      alt="Ningaloo Reef turquoise waters"
                      class="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <div class="overflow-hidden h-36 md:h-64">
                    <img
                      src="https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=600&q=80"
                      alt="Whale shark encounter Ningaloo Reef"
                      class="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>
              <div class="absolute -bottom-3 -left-3 md:-bottom-4 md:-left-4 bg-[#C9A84C] text-[#0A2E4A] px-4 py-2 md:px-6 md:py-3 shadow-xl">
                <p class="font-display text-xs md:text-sm font-medium">Premium Vessel</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vessel Showcase -->
    <section class="py-12 md:py-32" style="background: var(--color-ocean-900);">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="text-center mb-8 md:mb-16 section-reveal">
          <p class="overline-text mb-2 md:mb-3 text-xs md:text-sm">Your Home at Sea</p>
          <div class="gold-divider mb-4 md:mb-6 mx-auto"></div>
          <h2 class="font-display text-3xl md:text-5xl lg:text-6xl font-light mb-3 md:mb-4" style="font-family: var(--font-display); color: var(--color-sand-100);">
            The Vessel <span class="italic" style="color: var(--color-gold-400);">Millenium</span>
          </h2>
          <p class="max-w-2xl mx-auto text-sm md:text-base opacity-70 px-2" style="color: var(--color-sand-200);">
            Originally built as a private luxury yacht, Millenium has been extensively refitted for expedition cruising. 
            Every cabin features en-suite bathrooms, ocean views, and premium linens.
          </p>
        </div>

        <div class="columns-2 md:columns-4 gap-2 md:gap-3 space-y-2 md:space-y-3 section-reveal">
          <div 
            v-for="(img, i) in vesselImages" 
            :key="i"
            class="relative overflow-hidden cursor-pointer group break-inside-avoid mb-2 md:mb-3"
            :class="i === 0 ? 'md:col-span-2' : ''"
            @click="openLightbox(i)"
          >
            <img 
              :src="img.src" 
              :alt="img.caption"
              class="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div class="absolute bottom-2 md:bottom-4 left-2 md:left-4 text-white">
                <p class="text-[10px] md:text-xs uppercase tracking-wider text-[#C9A84C] mb-0.5 md:mb-1">{{ img.category }}</p>
                <p class="font-display text-sm md:text-xl">{{ img.caption }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-6 md:mt-10">
          <button @click="openLightbox(0)" class="text-[#C9A84C] hover:text-white transition-colors text-xs md:text-sm uppercase tracking-widest border-b border-[#C9A84C] pb-1 hover:border-white">
            Explore Gallery
          </button>
        </div>
      </div>
    </section>

    <!-- Itinerary -->
    <section class="py-12 md:py-32" style="background: var(--color-ocean-950);">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="text-center mb-8 md:mb-16 section-reveal">
          <p class="overline-text mb-2 md:mb-3 text-xs md:text-sm">Seven Days of Wonder</p>
          <div class="gold-divider mb-4 md:mb-6 mx-auto"></div>
          <h2 class="font-display text-3xl md:text-5xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
            Your <span class="italic" style="color: var(--color-gold-400);">Itinerary</span>
          </h2>
        </div>

        <div class="flex md:hidden gap-1.5 mb-6 overflow-x-auto pb-4 scrollbar-hide">
          <button 
            v-for="(day, i) in itinerary" 
            :key="i"
            @click="activeDay = i"
            class="flex-shrink-0 px-3 py-2 text-xs transition-all border rounded-sm"
            :class="activeDay === i 
              ? 'bg-[#C9A84C] border-[#C9A84C] text-[#0A2E4A] font-medium' 
              : 'border-[#C9A84C]/30 text-[#C9A84C]'"
          >
            {{ day.day }}
          </button>
        </div>

        <div class="max-w-6xl mx-auto relative">
          <div class="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#C9A84C]/20 transform -translate-x-1/2" />

          <div 
            v-for="(item, i) in itinerary" 
            :key="item.day"
            class="relative mb-8 md:mb-24 section-reveal"
            :class="i !== activeDay ? 'hidden md:block' : ''"
          >
            <div class="grid md:grid-cols-2 gap-4 md:gap-16 items-center">
              <div :class="i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:order-2 md:pl-12'">
                <div class="flex items-center gap-2 md:gap-3 mb-2 md:mb-4" :class="i % 2 === 0 ? 'md:justify-end' : ''">
                  <span class="text-[#C9A84C] font-display text-xl md:text-3xl">{{ item.day }}</span>
                  <div class="h-px w-8 md:w-12 bg-[#C9A84C]/30" />
                </div>
                <h3 class="font-display text-xl md:text-3xl font-light mb-2 md:mb-4 text-white" style="font-family: var(--font-display);">
                  {{ item.title }}
                </h3>
                <p class="text-sm md:text-base leading-relaxed opacity-75 mb-4 md:mb-6" style="color: var(--color-sand-200); line-height: 1.8;">
                  {{ item.desc }}
                </p>
                <div class="flex flex-wrap gap-3 md:gap-4 text-xs md:text-sm" :class="i % 2 === 0 ? 'md:justify-end' : ''">
                  <span class="flex items-center gap-1.5 md:gap-2 text-[#C9A84C]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {{ item.activity }}
                  </span>
                  <span class="flex items-center gap-1.5 md:gap-2 text-[#C9A84C]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                    </svg>
                    {{ item.meals }}
                  </span>
                </div>
              </div>

              <div :class="i % 2 === 0 ? 'md:order-2' : ''" class="relative group">
                <div class="overflow-hidden">
                  <img 
                    :src="item.image" 
                    :alt="item.title"
                    class="w-full h-48 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div class="absolute top-3 left-3 bg-[#0A2E4A]/90 backdrop-blur px-3 py-1.5 border border-[#C9A84C]/30">
                  <span class="text-[#C9A84C] font-display text-xs md:text-sm">{{ item.day }}</span>
                </div>
              </div>
            </div>

            <div class="hidden md:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="w-4 h-4 bg-[#C9A84C] rounded-full border-4 border-[#0A2E4A]" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Culinary Experience -->
    <section class="py-12 md:py-32" style="background: var(--color-ocean-900);">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="grid lg:grid-cols-5 gap-6 md:gap-12 items-start">
          <div class="lg:col-span-2 section-reveal-left lg:sticky lg:top-24">
            <p class="overline-text mb-2 md:mb-3 text-xs md:text-sm">Gastronomy at Sea</p>
            <div class="gold-divider-left mb-4 md:mb-6"></div>
            <h2 class="font-display text-3xl md:text-5xl font-light mb-4 md:mb-6 leading-tight" style="font-family: var(--font-display); color: var(--color-sand-100);">
              Culinary <span class="italic" style="color: var(--color-gold-400);">Excellence</span>
            </h2>
            <p class="text-sm md:text-lg leading-relaxed mb-6 md:mb-8 opacity-80" style="color: var(--color-sand-200); line-height: 1.9;">
              Our onboard chef crafts multi-course experiences using the finest Western Australian ingredients. 
              From Exmouth prawns to Margaret River wines, every meal celebrates local terroir.
            </p>

            <div class="space-y-3 md:space-y-4 mb-6 md:mb-8">
              <div class="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-[#0A2E4A]/50 border border-[#C9A84C]/10">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-[#C9A84C]/20 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div>
                  <h4 class="text-white font-medium mb-0.5 md:mb-1 text-sm md:text-base">All-Inclusive Dining</h4>
                  <p class="text-xs md:text-sm opacity-70" style="color: var(--color-sand-200);">All meals, snacks, and beverages included</p>
                </div>
              </div>
              <div class="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-[#0A2E4A]/50 border border-[#C9A84C]/10">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-[#C9A84C]/20 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <div>
                  <h4 class="text-white font-medium mb-0.5 md:mb-1 text-sm md:text-base">Premium Cellar</h4>
                  <p class="text-xs md:text-sm opacity-70" style="color: var(--color-sand-200);">Curated wines and craft cocktails</p>
                </div>
              </div>
              <div class="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-[#0A2E4A]/50 border border-[#C9A84C]/10">
                <div class="w-10 h-10 md:w-12 md:h-12 bg-[#C9A84C]/20 flex items-center justify-center flex-shrink-0">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                </div>
                <div>
                  <h4 class="text-white font-medium mb-0.5 md:mb-1 text-sm md:text-base">Dietary Expertise</h4>
                  <p class="text-xs md:text-sm opacity-70" style="color: var(--color-sand-200);">Vegan, gluten-free, and allergies catered</p>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-3 section-reveal-right">
            <div class="grid grid-cols-2 gap-2 md:gap-3">
              <div 
                v-for="(img, i) in diningImages" 
                :key="i" 
                class="relative overflow-hidden group"
                :class="img.featured ? 'col-span-2 row-span-2' : ''"
              >
                <img 
                  :src="img.src" 
                  :alt="img.title" 
                  class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  :class="img.featured ? 'h-48 md:h-96' : 'h-24 md:h-48'"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div class="absolute bottom-3 left-3 text-white">
                    <p class="font-display text-sm md:text-lg">{{ img.title }}</p>
                    <p class="text-xs opacity-80">{{ img.desc }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Expedition Route Map -->
    <section class="py-12 md:py-32 relative overflow-hidden" style="background: var(--color-ocean-900);">
      <div class="absolute inset-0 opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?auto=format&fit=crop&w=1920&q=80" 
          alt="Ningaloo Reef aerial view Western Australia"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div class="text-center mb-8 md:mb-16 section-reveal">
          <p class="overline-text mb-2 md:mb-3 text-xs md:text-sm">The Journey</p>
          <div class="gold-divider mb-4 md:mb-6 mx-auto"></div>
          <h2 class="font-display text-3xl md:text-5xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
            Expedition <span class="italic" style="color: var(--color-gold-400);">Route</span>
          </h2>
        </div>

        <div class="max-w-5xl mx-auto bg-[#0A2E4A]/90 backdrop-blur-lg p-4 md:p-16 rounded-sm border border-[#C9A84C]/20 section-reveal">
          <div class="relative">
            <div class="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C9A84C] via-[#C9A84C] to-[#C9A84C]/30 transform -translate-y-1/2 z-0" />

            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 relative z-10">
              <div class="text-center md:col-span-1">
                <div class="w-4 h-4 md:w-6 md:h-6 bg-[#C9A84C] rounded-full mx-auto mb-2 shadow-lg shadow-[#C9A84C]/50" />
                <p class="font-display text-sm md:text-lg text-white mb-0.5 md:mb-1">Exmouth</p>
                <p class="text-[10px] md:text-xs opacity-60 uppercase tracking-wider" style="color: var(--color-sand-200);">Departure</p>
                <p class="text-[10px] opacity-40 mt-0.5 md:mt-1">Day 1</p>
              </div>

              <div class="text-center md:col-span-1">
                <div class="w-4 h-4 md:w-6 md:h-6 bg-[#C9A84C] rounded-full mx-auto mb-2 shadow-lg shadow-[#C9A84C]/50" />
                <p class="font-display text-sm md:text-lg text-white mb-0.5 md:mb-1">Northern Reef</p>
                <p class="text-[10px] md:text-xs opacity-60 uppercase tracking-wider" style="color: var(--color-sand-200);">Whale Sharks</p>
                <p class="text-[10px] opacity-40 mt-0.5 md:mt-1">Days 2-3</p>
              </div>

              <div class="text-center md:col-span-1">
                <div class="w-4 h-4 md:w-6 md:h-6 bg-[#C9A84C] rounded-full mx-auto mb-2 shadow-lg shadow-[#C9A84C]/50" />
                <p class="font-display text-sm md:text-lg text-white mb-0.5 md:mb-1">Central Reef</p>
                <p class="text-[10px] md:text-xs opacity-60 uppercase tracking-wider" style="color: var(--color-sand-200);">Manta Rays</p>
                <p class="text-[10px] opacity-40 mt-0.5 md:mt-1">Days 4-5</p>
              </div>

              <div class="text-center md:col-span-1">
                <div class="w-4 h-4 md:w-6 md:h-6 bg-[#C9A84C] rounded-full mx-auto mb-2 shadow-lg shadow-[#C9A84C]/50" />
                <p class="font-display text-sm md:text-lg text-white mb-0.5 md:mb-1">Coral Bay</p>
                <p class="text-[10px] md:text-xs opacity-60 uppercase tracking-wider" style="color: var(--color-sand-200);">Southern Reef</p>
                <p class="text-[10px] opacity-40 mt-0.5 md:mt-1">Day 6</p>
              </div>

              <div class="text-center md:col-span-1 col-span-2">
                <div class="w-4 h-4 md:w-6 md:h-6 bg-[#C9A84C] rounded-full mx-auto mb-2 shadow-lg shadow-[#C9A84C]/50" />
                <p class="font-display text-sm md:text-lg text-white mb-0.5 md:mb-1">Exmouth</p>
                <p class="text-[10px] md:text-xs opacity-60 uppercase tracking-wider" style="color: var(--color-sand-200);">Return</p>
                <p class="text-[10px] opacity-40 mt-0.5 md:mt-1">Day 7</p>
              </div>
            </div>
          </div>

          <div class="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-[#C9A84C]/10 text-center">
            <p class="text-xs md:text-sm opacity-60" style="color: var(--color-sand-200);">
              *Route may vary based on weather, wildlife sightings, and guest preferences to ensure optimal experience
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- What's Included -->
    <section class="py-12 md:py-32" style="background: var(--color-ocean-950);">
      <div class="container mx-auto px-4 sm:px-6 lg:px-12">
        <div class="text-center mb-8 md:mb-16 section-reveal">
          <p class="overline-text mb-2 md:mb-3 text-xs md:text-sm">All-Inclusive</p>
          <div class="gold-divider mb-4 md:mb-6 mx-auto"></div>
          <h2 class="font-display text-3xl md:text-5xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
            Everything <span class="italic" style="color: var(--color-gold-400);">Included</span>
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4 max-w-6xl mx-auto">
          <div 
            v-for="(item, i) in highlights" 
            :key="item" 
            class="highlight-item section-reveal"
            :style="`transition-delay: ${i * 0.05}s`"
          >
            <div class="w-6 h-6 md:w-8 md:h-8 rounded-full bg-[#C9A84C]/10 flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <p class="text-sm md:text-base opacity-90" style="color: var(--color-sand-200);">{{ item }}</p>
          </div>
        </div>
      </div>
    </section>

    <CtaSection />

    <!-- Lightbox Modal -->
    <div 
      v-if="lightboxOpen" 
      class="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-2 md:p-4"
      @click="closeLightbox"
    >
      <button class="absolute top-4 right-4 md:top-6 md:right-6 text-white/70 hover:text-white p-2 transition-colors" @click="closeLightbox">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <button class="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 md:p-4 transition-colors hidden md:block" @click.stop="prevImage">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <polyline points="15,18 9,12 15,6"/>
        </svg>
      </button>

      <button class="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 md:p-4 transition-colors hidden md:block" @click.stop="nextImage">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <polyline points="9,18 15,12 9,6"/>
        </svg>
      </button>

      <div class="max-w-6xl max-h-[90vh]" @click.stop>
        <img 
          :src="vesselImages[currentImage].src" 
          :alt="vesselImages[currentImage].caption"
          class="max-w-full max-h-[85vh] object-contain shadow-2xl"
        />
        <div class="text-center mt-4 md:mt-6">
          <p class="font-display text-lg md:text-xl text-white mb-0.5 md:mb-1">{{ vesselImages[currentImage].caption }}</p>
          <p class="text-xs md:text-sm text-[#C9A84C] uppercase tracking-widest">{{ vesselImages[currentImage].category }}</p>
        </div>
      </div>
    </div>

    <!-- Cabin Modal -->
    <div v-if="showCabinModal" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-3 md:p-4" @click="showCabinModal = false">
      <div class="bg-[#0A2E4A] border border-[#C9A84C]/30 p-5 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
        <div class="flex justify-between items-center mb-4 md:mb-6">
          <h3 class="font-display text-xl md:text-2xl text-white">Premium Cabins</h3>
          <button @click="showCabinModal = false" class="text-white/60 hover:text-white p-1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="space-y-3 md:space-y-4">
          <div class="border border-[#C9A84C]/20 p-3 md:p-4">
            <h4 class="text-[#C9A84C] font-medium mb-1 md:mb-2 text-sm md:text-base">Master Suite</h4>
            <p class="text-xs md:text-sm opacity-70 mb-1 md:mb-2">King bed, panoramic windows, en-suite bathroom with rainfall shower</p>
            <p class="text-[10px] md:text-xs opacity-50">2 available | Premium pricing</p>
          </div>
          <div class="border border-[#C9A84C]/20 p-3 md:p-4">
            <h4 class="text-[#C9A84C] font-medium mb-1 md:mb-2 text-sm md:text-base">Deluxe Cabin</h4>
            <p class="text-xs md:text-sm opacity-70 mb-1 md:mb-2">Queen bed, ocean view, en-suite bathroom</p>
            <p class="text-[10px] md:text-xs opacity-50">6 available | Standard pricing</p>
          </div>
          <div class="border border-[#C9A84C]/20 p-3 md:p-4">
            <h4 class="text-[#C9A84C] font-medium mb-1 md:mb-2 text-sm md:text-base">Classic Cabin</h4>
            <p class="text-xs md:text-sm opacity-70 mb-1 md:mb-2">Twin beds, porthole windows, shared facilities</p>
            <p class="text-[10px] md:text-xs opacity-50">6 available | Value pricing</p>
          </div>
        </div>
        <router-link to="/contact" class="btn-primary block text-center mt-5 md:mt-6 py-3 text-sm md:text-base" @click="showCabinModal = false">
          Enquire Now
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.avatar-wrapper {
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--color-gold-400);
  box-shadow: 0 4px 20px rgba(201, 168, 76, 0.3);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border: 1px solid rgba(201, 168, 76, 0.1);
  background: rgba(10, 46, 74, 0.3);
  transition: all 0.3s ease;
}

@media (min-width: 768px) {
  .highlight-item {
    gap: 12px;
    padding: 16px;
  }
}

.highlight-item:hover {
  background: rgba(201, 168, 76, 0.05);
  border-color: rgba(201, 168, 76, 0.25);
  transform: translateX(4px);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

html {
  scroll-behavior: smooth;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--color-ocean-950);
}
::-webkit-scrollbar-thumb {
  background: var(--color-gold-400);
  border-radius: 4px;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.break-inside-avoid {
  break-inside: avoid;
}
</style>