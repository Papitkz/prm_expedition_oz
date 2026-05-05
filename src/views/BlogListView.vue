<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useSEO } from '@/composables/useSEO'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useCMS } from '@/composables/useCMS'
import PageHero from '@/components/PageHero.vue'

useScrollReveal()

useSEO({
  title: 'Blog — Expedition OZ',
  description: 'Stories, guides, and insights from Ningaloo Reef. Read about whale shark encounters, marine conservation, and life aboard our luxury vessels.',
  path: '/blog',
  type: 'article',
})

const blogs = ref<any[]>([])
const loading = ref(true)
const { getBlogs } = useCMS()

onMounted(async () => {
  blogs.value = await getBlogs()
  loading.value = false
})
</script>

<template>
  <div>
    <PageHero
      tag="Stories & Insights"
      title="Expedition"
      title-italic="Journal"
      subtitle="Tales from the reef, marine conservation updates, and guides for your next adventure."
      image="https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1920"
      image-alt="Ningaloo Reef blog"
      height="50vh"
    />

    <section class="py-24 lg:py-32" style="background: var(--color-ocean-950);">
      <div class="container mx-auto px-6 lg:px-12 max-w-6xl">
        <div v-if="loading" class="text-center py-12 opacity-50">Loading posts...</div>

        <div v-else-if="blogs.length === 0" class="text-center py-12 opacity-50">
          <p class="font-display text-2xl mb-4" style="font-family: var(--font-display); color: var(--color-sand-100);">No posts yet</p>
          <p class="text-sm" style="color: var(--color-sand-200);">Check back soon for stories from the reef.</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <router-link
            v-for="blog in blogs"
            :key="blog.id"
            :to="`/blog/${blog.slug}`"
            class="blog-card group section-reveal"
          >
            <div class="blog-image-wrap">
              <img
                v-if="blog.cover_image_url"
                :src="blog.cover_image_url"
                :alt="blog.title"
                class="blog-image"
              />
              <div v-else class="blog-image-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.3)" stroke-width="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                </svg>
              </div>
            </div>
            <div class="blog-content">
              <p class="blog-date">{{ new Date(blog.published_at).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' }) }}</p>
              <h3 class="blog-title" style="font-family: var(--font-display); color: var(--color-sand-100);">{{ blog.title }}</h3>
              <p v-if="blog.excerpt" class="blog-excerpt" style="color: var(--color-sand-200);">{{ blog.excerpt }}</p>
              <span class="blog-read-more">Read more</span>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.blog-card {
  display: flex;
  flex-direction: column;
  background: rgba(10, 46, 74, 0.3);
  border: 1px solid rgba(201, 168, 76, 0.1);
  text-decoration: none;
  transition: all 0.3s ease;
  overflow: hidden;
}

.blog-card:hover {
  border-color: rgba(201, 168, 76, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.blog-image-wrap {
  height: 200px;
  overflow: hidden;
}

.blog-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.blog-card:hover .blog-image {
  transform: scale(1.05);
}

.blog-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(7, 26, 43, 0.5);
}

.blog-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.blog-date {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-gold-400);
  opacity: 0.7;
  margin-bottom: 0.5rem;
}

.blog-title {
  font-size: 1.25rem;
  font-weight: 300;
  line-height: 1.3;
  margin-bottom: 0.75rem;
}

.blog-excerpt {
  font-size: 0.85rem;
  line-height: 1.7;
  opacity: 0.7;
  flex: 1;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-read-more {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-gold-400);
  transition: opacity 0.2s;
}

.blog-card:hover .blog-read-more {
  opacity: 0.8;
}
</style>
