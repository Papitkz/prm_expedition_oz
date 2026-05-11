<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useComponentCMS } from '@/composables/useComponentCMS'
import NoImagePlaceholder from '@/components/NoImagePlaceholder.vue'

const cms = useComponentCMS('ToursSection')
const router = useRouter()
useScrollReveal()

const tourCards = computed(() =>
  cms.getSection('tourCards').map((item, index) => ({
    src: item.imageUrl || '',
    title: item.title || '',
    desc: item.description || '',
    hasImage: !!item.imageUrl,
    name: item.title || `Tour ${index + 1}`,
    vessel: 'Live-Aboard Expedition',
    duration: index === 0 ? '4 Days' : '7 Days',
    link: index === 0 ? '/expeditions/sylvia' : '/expeditions/millenium',
    featured: index === 1, // ✅ Millenium (index 1) is featured - always boolean!
    features: index === 0 ? [
      'Whale shark snorkeling',
      'Guided reef dives', 
      'Gourmet meals all-inclusive',
      'Sunset cocktails on deck',
      'Exmouth departure'
    ] : [
      'Full reef exploration',
      'Manta ray encounters',
      'Night snorkeling',
      'Premium cabin suites',
      'Marine naturalist guide'
    ]
  }))
)

const sylviaCard = computed(() => tourCards.value[0] || {})
const milleniumCard = computed(() => tourCards.value[1] || {})

let observer: IntersectionObserver | null = null

onMounted(async () => {
  await cms.load()
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        observer?.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })

  const revealElements = document.querySelectorAll('.section-reveal, .section-reveal-left, .section-reveal-right')
  revealElements.forEach((el) => observer?.observe(el))
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>

<template>
  <section class="py-16 md:py-24 lg:py-32" style="background: var(--color-ocean-900);">
    <!-- Section anchor for navigation -->
    <a id="compare-tours" class="sr-only" aria-hidden="true"></a>
    
    <div class="container mx-auto px-4 sm:px-6 lg:px-12">
      <div class="text-center mb-8 md:mb-16 section-reveal">
        <p class="overline-text mb-3 md:mb-4 text-xs md:text-sm">Our Expeditions</p>
        <div class="gold-divider mb-4 md:mb-8 mx-auto"></div>
        <h2 class="font-display text-2xl md:text-4xl lg:text-5xl font-light" style="font-family: var(--font-display); color: var(--color-sand-100);">
          Choose Your <span class="italic" style="color: var(--color-gold-400);">Vessel</span>
        </h2>
        <p class="mt-3 md:mt-4 max-w-2xl mx-auto text-sm md:text-base opacity-70 px-2" style="color: var(--color-sand-200);">
          Whether you have four days or seven, Expedition OZ has the perfect live-aboard experience for you.
          <span class="block mt-2 text-sm" style="color: var(--color-gold-400); opacity: 0.6;">
            Both include whale shark season access · All meals · Dive equipment
          </span>
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-4 md:gap-6 max-w-5xl mx-auto">
        <!-- Sylvia Card -->
        <div
          class="group cursor-pointer tour-card section-reveal-left"
          :class="{ 'tour-featured': sylviaCard.featured }"
          @click="router.push(sylviaCard.link)"
        >
          <div class="tour-image-wrap relative overflow-hidden">
            <template v-if="sylviaCard.hasImage">
              <img
                :src="sylviaCard.src"
                :alt="sylviaCard.title || 'Sylvia expedition vessel at Ningaloo Reef'"
                class="tour-image w-full h-48 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </template>
            <NoImagePlaceholder v-else label="No Sylvia Card Image" class="h-48 md:h-80" />
            
            <div class="tour-overlay">
              <span class="duration-badge">
                {{ sylviaCard.duration }}
              </span>
              <span v-if="sylviaCard.featured" class="featured-tag">Most Popular</span>
            </div>

            <div class="absolute inset-0 bg-gradient-to-t from-[#0A2E4A]/90 via-[#0A2E4A]/30 to-transparent" />
          </div>

          <div class="tour-content absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <p class="overline-text text-[0.5rem] md:text-xs mb-1 md:mb-2">{{ sylviaCard.vessel }}</p>
            <h3 class="font-display text-xl md:text-3xl font-light mb-1 md:mb-2" style="font-family: var(--font-display); color: var(--color-sand-100);">
              {{ sylviaCard.name }}
            </h3>
            <p class="font-display text-sm md:text-base italic mb-2 md:mb-4" style="color: var(--color-gold-400);">
              Northern Reef Expedition
            </p>
            <p class="text-xs md:text-sm opacity-70 mb-3 md:mb-4 line-clamp-2" style="color: var(--color-sand-200);">
              {{ sylviaCard.desc }}
            </p>
            
            <!-- Features List -->
            <ul class="space-y-1 mb-4" style="max-height: 80px; overflow: hidden;">
              <li v-for="(feature, i) in sylviaCard.features?.slice(0, 3)" :key="i" class="flex items-center gap-2 text-xs opacity-80" style="color: var(--color-sand-200);">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" stroke="var(--color-gold-400)" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
            
            <span class="btn-primary inline-block text-xs md:text-sm px-4 py-2 md:px-6 md:py-3" :class="{ 'btn-featured': sylviaCard.featured }">
              Learn More →
            </span>
          </div>
        </div>

        <!-- Millenium Card -->
        <div
          class="group cursor-pointer tour-card section-reveal-right"
          :class="{ 'tour-featured': milleniumCard.featured }"
          @click="router.push(milleniumCard.link)"
        >
          <div class="tour-image-wrap relative overflow-hidden">
            <template v-if="milleniumCard.hasImage">
              <img
                :src="milleniumCard.src"
                :alt="milleniumCard.title || 'Millenium expedition vessel sailing at sunset'"
                class="tour-image w-full h-48 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </template>
            <NoImagePlaceholder v-else label="No Millenium Card Image" class="h-48 md:h-80" />
            
            <div class="tour-overlay">
              <span class="duration-badge">
                {{ milleniumCard.duration }}
              </span>
              <span v-if="milleniumCard.featured" class="featured-tag">Most Popular</span>
            </div>

            <div class="absolute inset-0 bg-gradient-to-t from-[#0A2E4A]/90 via-[#0A2E4A]/30 to-transparent" />
          </div>

          <div class="tour-content absolute bottom-0 left-0 right-0 p-4 md:p-6">
            <p class="overline-text text-[0.5rem] md:text-xs mb-1 md:mb-2">{{ milleniumCard.vessel }}</p>
            <h3 class="font-display text-xl md:text-3xl font-light mb-1 md:mb-2" style="font-family: var(--font-display); color: var(--color-sand-100);">
              {{ milleniumCard.name }}
            </h3>
            <p class="font-display text-sm md:text-base italic mb-2 md:mb-4" style="color: var(--color-gold-400);">
              The Complete Expedition
            </p>
            <p class="text-xs md:text-sm opacity-70 mb-3 md:mb-4 line-clamp-2" style="color: var(--color-sand-200);">
              {{ milleniumCard.desc }}
            </p>
            
            <!-- Features List -->
            <ul class="space-y-1 mb-4" style="max-height: 80px; overflow: hidden;">
              <li v-for="(feature, i) in milleniumCard.features?.slice(0, 3)" :key="i" class="flex items-center gap-2 text-xs opacity-80" style="color: var(--color-sand-200);">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" class="flex-shrink-0">
                  <polyline points="20 6 9 17 4 12" stroke="var(--color-gold-400)" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
                <span>{{ feature }}</span>
              </li>
            </ul>
            
            <span class="btn-primary inline-block text-xs md:text-sm px-4 py-2 md:px-6 md:py-3" :class="{ 'btn-featured': milleniumCard.featured }">
              Learn More →
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Enhanced animations */
.section-reveal,
.section-reveal-left,
.section-reveal-right {
  opacity: 0;
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.section-reveal {
  transform: translateY(30px);
}

.section-reveal.is-visible,
.section-reveal-left.is-visible,
.section-reveal-right.is-visible {
  opacity: 1;
}

.section-reveal.is-visible {
  transform: translateY(0);
}

.section-reveal-left {
  transform: translateX(-50px);
}

.section-reveal-left.is-visible {
  transform: translateX(0);
  transition-delay: 0.1s;
}

.section-reveal-right {
  transform: translateX(50px);
}

.section-reveal-right.is-visible {
  transform: translateX(0);
  transition-delay: 0.2s;
}

/* Tour Card Enhancements */
.tour-card {
  background: rgba(7, 26, 43, 0.6);
  border: 1px solid rgba(201, 168, 76, 0.12);
  overflow: hidden;
  transition: all 0.4s ease;
  position: relative;
  height: 100%;
}

.tour-card:hover {
  border-color: rgba(201, 168, 76, 0.4);
  transform: translateY(-4px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.tour-featured {
  border-color: rgba(201, 168, 76, 0.25);
}

.tour-featured::before {
  content: '';
  position: absolute;
  inset: -1px;
  background: linear-gradient(135deg, rgba(201, 168, 76, 0.3), transparent 50%);
  z-index: 0;
  pointer-events: none;
  border-radius: inherit;
}

.tour-featured > * {
  position: relative;
  z-index: 1;
}

.tour-image-wrap {
  position: relative;
  overflow: hidden;
}

.tour-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.group:hover .tour-image {
  transform: scale(1.04);
}

.tour-overlay {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 2;
}

/* Duration Badge */
.duration-badge {
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.2em;
  font-size: 0.55rem;
  font-weight: 600;
  background: #C9A84C;
  color: #0A2E4A;
  padding: 0.375rem 0.875rem;
  text-transform: uppercase;
  align-self: flex-start;
}

/* Featured Tag */
.featured-tag {
  font-family: 'Montserrat', sans-serif;
  letter-spacing: 0.15em;
  font-size: 0.5rem;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(129, 199, 132, 0.15);
  color: #81c784;
  border: 1px solid rgba(129, 199, 132, 0.3);
  padding: 0.25rem 0.625rem;
  align-self: flex-start;
}

.tour-content {
  position: relative;
  z-index: 2;
}

/* Featured Button */
.btn-featured {
  background: #C9A84C !important;
  color: #0A2E4A !important;
  border-color: #C9A84C !important;
  font-weight: 600;
}

.btn-featured:hover {
  background: transparent !important;
  color: #C9A84C !important;
}

/* Text truncation utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>