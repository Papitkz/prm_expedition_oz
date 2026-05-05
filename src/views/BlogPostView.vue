<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSEO } from '@/composables/useSEO'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useCMS } from '@/composables/useCMS'

useScrollReveal()

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const blog = ref<any>(null)
const loading = ref(true)
const { getBlogBySlug } = useCMS()

useSEO({
  title: 'Blog — Expedition OZ',
  description: 'Stories and insights from Ningaloo Reef.',
  path: `/blog/${slug.value}`,
  type: 'article',
})

onMounted(async () => {
  blog.value = await getBlogBySlug(slug.value)
  loading.value = false
})
</script>

<template>
  <div>
    <div v-if="loading" class="min-h-screen flex items-center justify-center" style="background: var(--color-ocean-950);">
      <p class="opacity-50" style="color: var(--color-sand-200);">Loading...</p>
    </div>

    <div v-else-if="!blog" class="min-h-screen flex items-center justify-center" style="background: var(--color-ocean-950);">
      <div class="text-center">
        <h1 class="font-display text-4xl mb-4" style="font-family: var(--font-display); color: var(--color-sand-100);">Post Not Found</h1>
        <router-link to="/blog" class="btn-primary">Back to Blog</router-link>
      </div>
    </div>

    <div v-else>
      <!-- Hero -->
      <section class="relative h-[50vh] flex items-end overflow-hidden">
        <div class="absolute inset-0 z-10" style="background: linear-gradient(to top, rgba(7,26,43,0.92) 0%, rgba(7,26,43,0.4) 50%, rgba(7,26,43,0.3) 100%);"></div>
        <img
          v-if="blog.cover_image_url"
          :src="blog.cover_image_url"
          :alt="blog.title"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div class="relative z-20 w-full container mx-auto px-6 lg:px-12 pb-16">
          <router-link to="/blog" class="text-sm mb-4 inline-block" style="color: var(--color-gold-400); opacity: 0.7; font-family: var(--font-heading); letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;">
            &larr; Back to Blog
          </router-link>
          <h1 class="font-display text-4xl md:text-6xl font-light leading-tight" style="font-family: var(--font-display); color: var(--color-sand-100);">
            {{ blog.title }}
          </h1>
          <div class="mt-4 flex items-center gap-4">
            <span class="text-sm" style="color: var(--color-gold-400); font-family: var(--font-heading); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;">
              {{ blog.author_name }}
            </span>
            <span style="color: rgba(201,168,76,0.3);">|</span>
            <span class="text-sm" style="color: var(--color-sand-200); opacity: 0.6; font-family: var(--font-body); font-size: 0.75rem;">
              {{ new Date(blog.published_at).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' }) }}
            </span>
          </div>
        </div>
      </section>

      <!-- Content -->
      <section class="py-16 lg:py-24" style="background: var(--color-ocean-950);">
        <div class="container mx-auto px-6 lg:px-12 max-w-3xl">
          <div v-if="blog.excerpt" class="mb-8 pb-8" style="border-bottom: 1px solid rgba(201,168,76,0.1);">
            <p class="font-display text-xl italic leading-relaxed" style="font-family: var(--font-display); color: var(--color-sand-200); line-height: 1.8;">
              {{ blog.excerpt }}
            </p>
          </div>

          <div class="prose-content" style="color: var(--color-sand-200); font-family: var(--font-body); line-height: 1.9; font-size: 1rem;">
            <p v-for="(paragraph, i) in blog.content.split('\n').filter((p: string) => p.trim())" :key="i" class="mb-4">
              {{ paragraph }}
            </p>
          </div>

          <div class="mt-12 pt-8" style="border-top: 1px solid rgba(201,168,76,0.1);">
            <router-link to="/blog" class="btn-outline">Back to Blog</router-link>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.prose-content p {
  margin-bottom: 1.25rem;
  opacity: 0.85;
}
</style>
