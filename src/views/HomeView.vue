<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import HeroSection from '@/components/home/HeroSection.vue'
import IntroSection from '@/components/home/IntroSection.vue'
import ToursSection from '@/components/home/ToursSection.vue'
import ExperienceSection from '@/components/home/ExperienceSection.vue'
import InclusionsSection from '@/components/home/InclusionsSection.vue'
import TestimonialsSection from '@/components/home/TestimonialsSection.vue'
import CtaSection from '@/components/home/CtaSection.vue'

useScrollReveal()
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
