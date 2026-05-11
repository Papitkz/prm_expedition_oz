<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useSEO } from '@/composables/useSEO'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { useCMS } from '@/composables/useCMS'

useScrollReveal()

const route = useRoute()
const slug = computed(() => route.params.slug as string)

const blog = ref<any>(null)
const loading = ref(true)
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const { getBlogBySlug } = useCMS()

// SEO updates when blog loads
watch(() => blog.value, (newBlog) => {
  if (newBlog) {
    useSEO({
      title: newBlog.title,
      description: newBlog.excerpt || 'Stories and insights from Ningaloo Reef.',
      path: `/blog/${slug.value}`,
      type: 'article',
      image: newBlog.coverImageUrl || undefined,
      author: newBlog.authorName,
      keywords: ['Ningaloo Reef', 'blog', 'whale sharks', 'Western Australia', 'Expedition OZ', ...(newBlog.gallery?.map((g: any) => g.caption).filter(Boolean) || [])],
      articlePublishedAt: newBlog.publishedAt,
      articleModifiedAt: newBlog.updatedAt,
      articleTags: newBlog.gallery?.map((g: any) => g.caption).filter(Boolean) || [],
    })
  }
}, { immediate: true })

const allMedia = computed(() => {
  if (!blog.value) return []
  const media = []
  if (blog.value.coverImageUrl) {
    media.push({ type: 'image', url: blog.value.coverImageUrl, caption: blog.value.title })
  }
  if (blog.value.coverVideoUrl) {
    media.push({ type: 'video', url: blog.value.coverVideoUrl, caption: 'Cover Video' })
  }
  if (blog.value.gallery?.length) {
    media.push(...blog.value.gallery.map((item: any) => ({
      type: item.type || 'image',
      url: item.url,
      caption: item.caption || '',
      thumbnailUrl: item.thumbnailUrl,
    })))
  }
  return media
})

const galleryOnly = computed(() => {
  if (!blog.value?.gallery?.length) return []
  return blog.value.gallery.map((item: any) => ({
    type: item.type || 'image',
    url: item.url,
    caption: item.caption || '',
    thumbnailUrl: item.thumbnailUrl,
  }))
})

function openLightbox(index: number) {
  lightboxIndex.value = index
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function nextLightbox() {
  lightboxIndex.value = (lightboxIndex.value + 1) % allMedia.value.length
}

function prevLightbox() {
  lightboxIndex.value = (lightboxIndex.value - 1 + allMedia.value.length) % allMedia.value.length
}

function handleKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowRight') nextLightbox()
  if (e.key === 'ArrowLeft') prevLightbox()
}

onMounted(async () => {
  blog.value = await getBlogBySlug(slug.value)
  loading.value = false
  window.addEventListener('keydown', handleKeydown)
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
      <!-- Hero with Image or Video -->
      <section class="relative h-[50vh] md:h-[60vh] flex items-end overflow-hidden">
        <div class="absolute inset-0 z-10" style="background: linear-gradient(to top, rgba(7,26,43,0.92) 0%, rgba(7,26,43,0.4) 50%, rgba(7,26,43,0.3) 100%);"></div>

        <!-- Cover Video -->
        <video
          v-if="blog.coverVideoUrl"
          :src="blog.coverVideoUrl"
          class="absolute inset-0 w-full h-full object-cover"
          autoplay
          muted
          loop
          playsinline
        />

        <!-- Cover Image -->
        <img
          v-else-if="blog.coverImageUrl"
          :src="blog.coverImageUrl"
          :alt="blog.title"
          class="absolute inset-0 w-full h-full object-cover"
        />

        <div class="relative z-20 w-full container mx-auto px-4 md:px-6 lg:px-12 pb-8 md:pb-16">
          <router-link to="/blog" class="text-sm mb-4 inline-block" style="color: var(--color-gold-400); opacity: 0.7; font-family: var(--font-heading); letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;">
            ← Back to Blog
          </router-link>
          <h1 class="font-display text-3xl md:text-5xl lg:text-6xl font-light leading-tight" style="font-family: var(--font-display); color: var(--color-sand-100);">
            {{ blog.title }}
          </h1>
          <div class="mt-4 flex items-center gap-4 flex-wrap">
            <span class="text-xs md:text-sm" style="color: var(--color-gold-400); font-family: var(--font-heading); font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase;">
              {{ blog.authorName }}
            </span>
            <span style="color: rgba(201,168,76,0.3);">|</span>
            <span class="text-xs md:text-sm" style="color: var(--color-sand-200); opacity: 0.6; font-family: var(--font-body);">
              {{ blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Draft' }}
            </span>
          </div>
        </div>
      </section>

      <!-- Content -->
      <section class="py-12 md:py-16 lg:py-24" style="background: var(--color-ocean-950);">
        <div class="container mx-auto px-4 md:px-6 lg:px-12 max-w-3xl">
          <div v-if="blog.excerpt" class="mb-8 pb-8" style="border-bottom: 1px solid rgba(201,168,76,0.1);">
            <p class="font-display text-lg md:text-xl italic leading-relaxed" style="font-family: var(--font-display); color: var(--color-sand-200); line-height: 1.8;">
              {{ blog.excerpt }}
            </p>
          </div>

          <!-- Content -->
          <div class="prose-content" style="color: var(--color-sand-200); font-family: var(--font-body); line-height: 1.9; font-size: 1rem;">
            <p v-for="(paragraph, i) in blog.content.split('\n').filter((p: string) => p.trim())" :key="i" class="mb-4">
              {{ paragraph }}
            </p>
          </div>

          <!-- Media Gallery -->
          <div v-if="galleryOnly.length" class="mt-12">
            <h3 class="font-display text-2xl mb-6" style="font-family: var(--font-display); color: var(--color-gold-400);">
              Gallery
            </h3>
            <div class="blog-gallery">
              <div
                v-for="(item, index) in galleryOnly"
                :key="index"
                class="blog-gallery-item"
                :class="{
                  'blog-gallery-single': galleryOnly.length === 1,
                  'blog-gallery-featured': index === 0 && galleryOnly.length > 1
                }"
                @click="openLightbox(Number(index) + (blog.coverImageUrl || blog.coverVideoUrl ? 1 : 0))"
              >
                <img
                  v-if="item.type === 'image'"
                  :src="item.url"
                  :alt="item.caption || `Gallery item ${Number(index) + 1}`"
                  loading="lazy"
                />
                <div v-else class="relative">
                  <video
                    :src="item.url"
                    :poster="item.thumbnailUrl"
                    preload="metadata"
                  />
                  <div class="video-play-overlay">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <polygon points="5,3 19,12 5,21" fill="rgba(201,168,76,0.9)" stroke="none"/>
                    </svg>
                  </div>
                </div>
                <div v-if="item.caption" class="gallery-caption-bar">
                  {{ item.caption }}
                </div>
              </div>
            </div>
          </div>

          <!-- Back to Blog -->
          <div class="mt-12 pt-8" style="border-top: 1px solid rgba(201,168,76,0.1);">
            <router-link to="/blog" class="btn-outline">Back to Blog</router-link>
          </div>
        </div>
      </section>
    </div>

    <!-- Lightbox -->
    <Transition name="lightbox">
      <div v-if="lightboxOpen" class="lightbox-overlay" @click="closeLightbox">
        <button class="lightbox-close" @click="closeLightbox">×</button>
        <button v-if="allMedia.length > 1" class="lightbox-nav lightbox-prev" @click.stop="prevLightbox">‹</button>
        <button v-if="allMedia.length > 1" class="lightbox-nav lightbox-next" @click.stop="nextLightbox">›</button>

        <div class="lightbox-content" @click.stop>
          <template v-if="allMedia[lightboxIndex]">
            <img
              v-if="allMedia[lightboxIndex].type === 'image'"
              :src="allMedia[lightboxIndex].url"
              :alt="allMedia[lightboxIndex].caption || ''"
            />
            <video
              v-else
              :src="allMedia[lightboxIndex].url"
              controls
              autoplay
            />
            <p v-if="allMedia[lightboxIndex].caption" class="lightbox-caption">
              {{ allMedia[lightboxIndex].caption }}
            </p>
          </template>
        </div>

        <div v-if="allMedia.length > 1" class="lightbox-counter">
          {{ lightboxIndex + 1 }} / {{ allMedia.length }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.prose-content p {
  margin-bottom: 1.25rem;
  opacity: 0.85;
}

.gallery-caption-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.5rem 0.75rem;
  background: linear-gradient(to top, rgba(7,26,43,0.9) 0%, transparent 100%);
  color: var(--color-sand-200);
  font-family: var(--font-heading);
  font-size: 0.7rem;
  letter-spacing: 0.05em;
}

/* Lightbox */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
}

.lightbox-content {
  max-width: 90vw;
  max-height: 85vh;
  cursor: default;
}

.lightbox-content img,
.lightbox-content video {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
}

.lightbox-close {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.lightbox-close:hover {
  background: rgba(255,255,255,0.2);
}

.lightbox-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  color: #fff;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.lightbox-nav:hover {
  background: rgba(255,255,255,0.25);
}

.lightbox-prev { left: 1rem; }
.lightbox-next { right: 1rem; }

.lightbox-caption {
  text-align: center;
  color: rgba(255,255,255,0.8);
  font-family: var(--font-heading);
  font-size: 0.85rem;
  margin-top: 1rem;
  padding: 0 1rem;
}

.lightbox-counter {
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(255,255,255,0.6);
  font-family: var(--font-heading);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.3s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .lightbox-nav {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .lightbox-prev { left: 0.5rem; }
  .lightbox-next { right: 0.5rem; }

  .lightbox-counter {
    bottom: 1rem;
  }
}
</style>
