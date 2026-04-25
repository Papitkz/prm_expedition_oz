l<script setup lang="ts">
import { useSEO } from '@/composables/useSEO'
import { useScrollReveal } from '@/composables/useScrollReveal'
import HeroSection from '@/components/home/HeroSection.vue'
import IntroSection from '@/components/home/IntroSection.vue'
import ToursSection from '@/components/home/ToursSection.vue'
import ExperienceSection from '@/components/home/ExperienceSection.vue'
import InclusionsSection from '@/components/home/InclusionsSection.vue'
import TestimonialsSection from '@/components/home/TestimonialsSection.vue'
import CtaSection from '@/components/home/CtaSection.vue'

useScrollReveal()

useSEO({
  title: 'Luxury Live-Aboard Ningaloo Reef',
  description: 'Experience luxury live-aboard expeditions on Ningaloo Reef, Western Australia. Swim with whale sharks, snorkel coral gardens, and explore marine wilderness aboard Sylvia or Millenium.',
  image: 'https://expeditionoz.netlify.app/og-image.jpg',
  type: 'website',
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Expedition OZ",
    "url": "https://expeditionoz.netlify.app/",
    "logo": "https://expeditionoz.netlify.app/logo.png",
    "description": "Luxury live-aboard experiences in Ningaloo Reef, Western Australia",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Exmouth",
      "addressRegion": "WA",
      "addressCountry": "AU"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -21.9315,
      "longitude": 114.1280
    },
    "telephone": "+61-234-567-890",
    "priceRange": "$$$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "17:00"
    }
  }
})
</script>

<template>
  <div>
    <HeroSection />
    <IntroSection />
    <ToursSection />
    <ExperienceSection />
    <InclusionsSection />
    <TestimonialsSection />
    <CtaSection />
  </div>
</template>
