<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useComponentCMS } from '@/composables/useComponentCMS'
import NoImagePlaceholder from '@/components/NoImagePlaceholder.vue'

const cms = useComponentCMS('ExperienceSection')
useScrollReveal()

const experiences = computed(() =>
  cms.getSection('experiences').map((item, i) => ({
    index: i + 1,
    image: item.imageUrl || '',
    title: item.title || '',
    description: item.description || '',
    hasImage: !!item.imageUrl,
  }))
)

const staticExperiences = [
  {
    title: 'Marine Encounters',
    description: 'Swim alongside whale sharks, encounter manta rays, and witness humpback whales breaching at sunset.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1.5"><path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  },
  {
    title: 'Onboard Life',
    description: 'Gourmet dining, sunset yoga, stargazing sessions, and the luxury of having nothing to do but be present.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>`,
  },
  {
    title: 'The Reef',
    description: 'Drift over 260km of UNESCO World Heritage coral, home to 500+ fish species and some of the worlds most pristine marine ecosystems.',
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  },
]

onMounted(async () => {
  await cms.load()
})
</script>

<template>
  <section class="py-16 md:py-24 lg:py-32" style="background: var(--color-ocean-950);">
    <div class="container mx-auto px-4 sm:px-6 lg:px-12">
      <div class="text-center mb-8 md:mb-16 section-reveal">
        <p class="overline-text mb-3 md:mb-4 text-xs md:text-sm">The Details</p>
        <div class="gold-divider mb-4 md:mb-8 mx-auto"></div>
        <h2 class="font-display text-2xl md:text-4xl lg:text-5xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
          What to <span class="italic" style="color: var(--color-gold-400);">Expect</span>
        </h2>
        <p class="mt-3 md:mt-4 max-w-2xl mx-auto text-sm md:text-base opacity-70 px-2" style="color: var(--color-sand-200);">
          Every element of our expeditions has been thoughtfully designed. From the moment you step aboard to your final sunset, you'll experience Ningaloo at its most magnificent.
        </p>
      </div>

      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <div
            v-for="(exp, i) in staticExperiences"
            :key="exp.title"
            class="section-reveal"
            :style="`transition-delay: ${i * 0.15}s`"
          >
            <div class="mb-4 md:mb-6">
              <template v-if="experiences[i]?.hasImage">
                <img
                  :src="experiences[i].image"
                  :alt="experiences[i].title || exp.title"
                  class="w-full h-48 md:h-56 object-cover"
                  loading="lazy"
                />
              </template>
              <NoImagePlaceholder v-else :label="exp.title" class="h-48 md:h-56" />
            </div>

            <div class="flex items-center gap-3 mb-3 md:mb-4">
              <div class="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center border border-[#C9A84C]/20" v-html="exp.icon" />
              <h3 class="font-display text-lg md:text-2xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
                {{ experiences[i]?.title || exp.title }}
              </h3>
            </div>

            <p class="text-sm md:text-base opacity-70 leading-relaxed" style="font-family: var(--font-body); color: var(--color-sand-200); line-height: 1.8;">
              {{ experiences[i]?.description || exp.description }}
            </p>

            <div class="mt-4 md:mt-6 pt-3 md:pt-4" style="border-top: 1px solid rgba(201, 168, 76, 0.1);">
              <div class="flex items-center justify-between">
                <span class="overline-text text-[0.5rem] md:text-xs">0{{ i + 1 }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" stroke-width="1.5">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
