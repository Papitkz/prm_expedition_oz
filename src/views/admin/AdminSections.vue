<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useFirebaseUpload } from '@/composables/useFirebaseUpload'
import { initFirebase, type FirebaseConfig } from '@/lib/firebase'

interface Section {
  id: string
  section_key: string
  page: string
  label: string
  description: string
  default_image_url: string
}

interface SectionImage {
  id: string
  section_id: string
  image_url: string
  alt_text: string
  sort_order: number
  is_active: boolean
  created_at: string
}

const sections = ref<Section[]>([])
const selectedPage = ref('all')
const selectedSection = ref<Section | null>(null)
const sectionImages = ref<SectionImage[]>([])
const loading = ref(true)
const uploading = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const { uploadImage, deleteImage } = useFirebaseUpload()

const pages = computed(() => {
  const p = new Set(sections.value.map(s => s.page))
  return ['all', ...Array.from(p)]
})

const filteredSections = computed(() => {
  if (selectedPage.value === 'all') return sections.value
  return sections.value.filter(s => s.page === selectedPage.value)
})

function showMessage(text: string, type: 'success' | 'error') {
  message.value = text
  messageType.value = type
  setTimeout(() => { message.value = '' }, 3000)
}

async function loadSections() {
  loading.value = true
  const { data, error } = await supabase
    .from('cms_sections')
    .select('*')
    .order('page', { ascending: true })

  if (!error && data) sections.value = data as Section[]
  loading.value = false
}

async function selectSection(section: Section) {
  selectedSection.value = section
  await loadSectionImages(section.id)
}

async function loadSectionImages(sectionId: string) {
  const { data, error } = await supabase
    .from('cms_section_images')
    .select('*')
    .eq('section_id', sectionId)
    .order('sort_order', { ascending: true })

  if (!error && data) sectionImages.value = data as SectionImage[]
  else sectionImages.value = []
}

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length || !selectedSection.value) return

  const file = input.files[0]
  if (!file.type.startsWith('image/')) {
    showMessage('Please select an image file', 'error')
    return
  }

  uploading.value = true

  // Initialize Firebase from settings
  const { data: settingsData } = await supabase
    .from('cms_settings')
    .select('setting_value')
    .eq('setting_key', 'firebase_config')
    .maybeSingle()

  if (settingsData?.setting_value) {
    try {
      const config = JSON.parse(settingsData.setting_value) as FirebaseConfig
      initFirebase(config)
    } catch {
      showMessage('Firebase not configured. Go to Settings first.', 'error')
      uploading.value = false
      return
    }
  } else {
    showMessage('Firebase not configured. Go to Settings first.', 'error')
    uploading.value = false
    return
  }

  const result = await uploadImage(file, selectedSection.value.section_key)

  if (result) {
    const { error: insertError } = await supabase
      .from('cms_section_images')
      .insert({
        section_id: selectedSection.value.id,
        image_url: result.url,
        alt_text: selectedSection.value.label,
        sort_order: sectionImages.value.length,
        is_active: true,
        uploaded_by: (await supabase.auth.getUser()).data.user?.id,
      })

    if (!insertError) {
      showMessage('Image uploaded successfully', 'success')
      await loadSectionImages(selectedSection.value.id)
    } else {
      showMessage('Failed to save image record', 'error')
    }
  } else {
    showMessage('Upload failed', 'error')
  }

  uploading.value = false
  input.value = ''
}

async function toggleActive(image: SectionImage) {
  await supabase
    .from('cms_section_images')
    .update({ is_active: !image.is_active })
    .eq('id', image.id)
  await loadSectionImages(selectedSection.value!.id)
}

async function removeImage(image: SectionImage) {
  if (!confirm('Remove this image?')) return
  await supabase.from('cms_section_images').delete().eq('id', image.id)
  await loadSectionImages(selectedSection.value!.id)
  showMessage('Image removed', 'success')
}

async function setAsDefault(image: SectionImage) {
  // Deactivate all others, activate this one
  await supabase
    .from('cms_section_images')
    .update({ is_active: false })
    .eq('section_id', image.section_id)
  await supabase
    .from('cms_section_images')
    .update({ is_active: true })
    .eq('id', image.id)
  await loadSectionImages(selectedSection.value!.id)
  showMessage('Set as active image', 'success')
}

function getActiveImageUrl(section: Section): string {
  const active = sectionImages.value.find(img => img.section_id === section.id && img.is_active)
  return active?.image_url || section.default_image_url
}

onMounted(loadSections)
</script>

<template>
  <div class="sections-manager">
    <div v-if="message" class="alert" :class="`alert-${messageType}`">{{ message }}</div>

    <!-- Page Filter -->
    <div class="filter-bar">
      <label class="filter-label">Filter by page:</label>
      <div class="filter-tabs">
        <button
          v-for="page in pages"
          :key="page"
          @click="selectedPage = page"
          class="filter-tab"
          :class="{ 'filter-active': selectedPage === page }"
        >
          {{ page === 'all' ? 'All Pages' : page }}
        </button>
      </div>
    </div>

    <div class="manager-grid">
      <!-- Section List -->
      <div class="section-list">
        <h3 class="list-title">Sections</h3>
        <div v-if="loading" class="loading-state">Loading...</div>
        <div v-else class="sections-scroll">
          <button
            v-for="section in filteredSections"
            :key="section.id"
            @click="selectSection(section)"
            class="section-item"
            :class="{ 'section-selected': selectedSection?.id === section.id }"
          >
            <div class="section-thumb">
              <img :src="section.default_image_url" :alt="section.label" />
            </div>
            <div class="section-meta">
              <p class="section-label">{{ section.label }}</p>
              <p class="section-page">{{ section.page }}</p>
            </div>
          </button>
        </div>
      </div>

      <!-- Image Editor -->
      <div class="image-editor">
        <div v-if="!selectedSection" class="empty-editor">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.3)" stroke-width="1">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
          </svg>
          <p>Select a section to manage its images</p>
        </div>

        <div v-else class="editor-content">
          <div class="editor-header">
            <div>
              <h3 class="editor-title">{{ selectedSection.label }}</h3>
              <p class="editor-page">Page: {{ selectedSection.page }}</p>
              <p v-if="selectedSection.description" class="editor-desc">{{ selectedSection.description }}</p>
            </div>
            <label class="upload-btn" :class="{ 'uploading': uploading }">
              <input type="file" accept="image/*" @change="handleFileUpload" :disabled="uploading" class="hidden-input" />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              {{ uploading ? 'Uploading...' : 'Upload Image' }}
            </label>
          </div>

          <!-- Current Active Image -->
          <div class="current-image-section">
            <p class="sub-label">Active Image</p>
            <div class="active-image-frame">
              <img
                :src="sectionImages.find(i => i.is_active)?.image_url || selectedSection.default_image_url"
                :alt="selectedSection.label"
                class="active-image"
              />
              <div v-if="!sectionImages.find(i => i.is_active)" class="default-badge">Using Default</div>
            </div>
          </div>

          <!-- All Images for Section -->
          <div class="all-images-section">
            <p class="sub-label">All Uploaded Images ({{ sectionImages.length }})</p>
            <div v-if="sectionImages.length === 0" class="no-images">
              No custom images uploaded. The default image is being used.
            </div>
            <div v-else class="images-grid">
              <div
                v-for="img in sectionImages"
                :key="img.id"
                class="image-card"
                :class="{ 'image-active': img.is_active }"
              >
                <img :src="img.image_url" :alt="img.alt_text" class="image-thumb" />
                <div class="image-actions">
                  <button
                    @click="setAsDefault(img)"
                    class="img-action"
                    :class="{ 'img-action-active': img.is_active }"
                    :title="img.is_active ? 'Currently active' : 'Set as active'"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </button>
                  <button @click="removeImage(img)" class="img-action img-action-delete" title="Remove">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
                <div class="image-date">{{ new Date(img.created_at).toLocaleDateString() }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert {
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid;
}
.alert-success { background: rgba(76,175,80,0.1); border-color: rgba(76,175,80,0.3); color: #4caf50; }
.alert-error { background: rgba(224,123,90,0.1); border-color: rgba(224,123,90,0.3); color: #e07b5a; }

.filter-bar {
  margin-bottom: 1.5rem;
}
.filter-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(248,245,239,0.5);
  margin-bottom: 0.5rem;
  display: block;
}
.filter-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
.filter-tab {
  padding: 0.375rem 0.75rem;
  background: rgba(10,46,74,0.3);
  border: 1px solid rgba(201,168,76,0.15);
  color: rgba(248,245,239,0.6);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;
}
.filter-tab:hover { border-color: rgba(201,168,76,0.3); color: rgba(248,245,239,0.9); }
.filter-active { background: rgba(201,168,76,0.15); border-color: #c9a84c; color: #c9a84c; }

.manager-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.5rem;
  min-height: 500px;
}

.section-list {
  background: rgba(10,46,74,0.3);
  border: 1px solid rgba(201,168,76,0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.list-title {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(248,245,239,0.5);
  padding: 1rem;
  border-bottom: 1px solid rgba(201,168,76,0.1);
}
.sections-scroll {
  overflow-y: auto;
  max-height: 600px;
}
.section-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-bottom: 1px solid rgba(201,168,76,0.05);
  color: rgba(248,245,239,0.7);
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
}
.section-item:hover { background: rgba(201,168,76,0.05); }
.section-selected { background: rgba(201,168,76,0.1); border-left: 2px solid #c9a84c; }
.section-thumb {
  width: 48px;
  height: 36px;
  overflow: hidden;
  flex-shrink: 0;
  border: 1px solid rgba(201,168,76,0.15);
}
.section-thumb img { width: 100%; height: 100%; object-fit: cover; }
.section-label { font-size: 0.75rem; font-weight: 500; }
.section-page { font-size: 0.6rem; color: rgba(248,245,239,0.35); text-transform: capitalize; }

.image-editor {
  background: rgba(10,46,74,0.3);
  border: 1px solid rgba(201,168,76,0.1);
  padding: 1.5rem;
}
.empty-editor {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  min-height: 400px;
  color: rgba(248,245,239,0.35);
  font-size: 0.85rem;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}
.editor-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 300;
  color: #f8f5ef;
}
.editor-page {
  font-size: 0.65rem;
  color: rgba(248,245,239,0.4);
  text-transform: capitalize;
}
.editor-desc {
  font-size: 0.75rem;
  color: rgba(248,245,239,0.5);
  margin-top: 0.25rem;
}

.upload-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #c9a84c;
  color: #071a2b;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.upload-btn:hover { background: #e8c05a; }
.uploading { opacity: 0.6; cursor: not-allowed; }
.hidden-input { display: none; }

.sub-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(248,245,239,0.4);
  margin-bottom: 0.75rem;
}

.active-image-frame {
  position: relative;
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  border: 1px solid rgba(201,168,76,0.2);
  margin-bottom: 1.5rem;
}
.active-image { width: 100%; height: 300px; object-fit: cover; }
.default-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: rgba(7,26,43,0.9);
  border: 1px solid rgba(201,168,76,0.3);
  padding: 0.25rem 0.75rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.55rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #c9a84c;
}

.no-images {
  padding: 1.5rem;
  text-align: center;
  color: rgba(248,245,239,0.35);
  font-size: 0.8rem;
  border: 1px dashed rgba(201,168,76,0.15);
}

.images-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
}
.image-card {
  position: relative;
  border: 1px solid rgba(201,168,76,0.1);
  overflow: hidden;
  transition: border-color 0.2s;
}
.image-active { border-color: #c9a84c; }
.image-thumb { width: 100%; height: 120px; object-fit: cover; }
.image-actions {
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem;
  background: rgba(7,26,43,0.8);
}
.img-action {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(201,168,76,0.1);
  border: 1px solid rgba(201,168,76,0.2);
  color: rgba(248,245,239,0.6);
  cursor: pointer;
  transition: all 0.2s;
}
.img-action:hover { background: rgba(201,168,76,0.2); color: #c9a84c; }
.img-action-active { color: #c9a84c; }
.img-action-delete:hover { background: rgba(224,123,90,0.2); color: #e07b5a; border-color: rgba(224,123,90,0.3); }
.image-date {
  padding: 0.25rem 0.5rem;
  font-size: 0.55rem;
  color: rgba(248,245,239,0.3);
}

.loading-state {
  padding: 2rem;
  text-align: center;
  color: rgba(248,245,239,0.4);
}

@media (max-width: 768px) {
  .manager-grid {
    grid-template-columns: 1fr;
  }
  .sections-scroll {
    max-height: 200px;
  }
}
</style>
