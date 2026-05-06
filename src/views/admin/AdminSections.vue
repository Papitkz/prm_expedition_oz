<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useStorageUpload } from '@/composables/useStorageUpload'

interface Section {
  id: string
  section_key: string
  page: string
  label: string
  description: string
  default_image_url: string
  default_video_url: string
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
const saving = ref(false)
const editing = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const { uploadImage } = useStorageUpload()

const pages = computed(() => {
  const p = new Set(sections.value.map(s => s.page))
  return ['all', ...Array.from(p)]
})

const filteredSections = computed(() => {
  if (selectedPage.value === 'all') return sections.value
  return sections.value.filter(s => s.page === selectedPage.value)
})

const activeImage = computed(() => sectionImages.value.find(i => i.is_active))

function showMessage(text: string, type: 'success' | 'error') {
  message.value = text
  messageType.value = type
  setTimeout(() => { message.value = '' }, 3000)
}

async function loadSections() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('cms_sections')
      .select('*')
      .order('section_key')

    if (error) throw error
    sections.value = (data || []) as Section[]
  } catch (e) {
    console.warn('Supabase unavailable, sections empty:', e)
    sections.value = []
  }
  loading.value = false
}

async function selectSection(section: Section) {
  selectedSection.value = { ...section }
  editing.value = false
  await loadSectionImages(section.id)
}

async function loadSectionImages(sectionId: string) {
  try {
    const { data, error } = await supabase
      .from('cms_section_images')
      .select('*')
      .eq('section_id', sectionId)
      .order('sort_order')

    if (error) throw error
    sectionImages.value = (data || []) as SectionImage[]
  } catch (e) {
    console.warn('Supabase unavailable, cannot load section images:', e)
    sectionImages.value = []
  }
}

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length || !selectedSection.value) return

  const file = input.files[0]
  const isVideo = file.type.startsWith('video/')
  const isImage = file.type.startsWith('image/')

  if (!isImage && !isVideo) {
    showMessage('Please select an image or video file', 'error')
    return
  }

  uploading.value = true
  const result = await uploadImage(file, selectedSection.value.section_key)

  if (result) {
    if (isVideo) {
      // Update the section's default_video_url with the uploaded video
      const { error } = await supabase
        .from('cms_sections')
        .update({ default_video_url: result.url })
        .eq('id', selectedSection.value.id)

      if (error) throw error
      selectedSection.value.default_video_url = result.url
      showMessage('Video uploaded and set as section video', 'success')
    } else {
      // Deactivate existing active images for this section
      const activeImgs = sectionImages.value.filter(i => i.is_active)
      if (activeImgs.length > 0) {
        await supabase
          .from('cms_section_images')
          .update({ is_active: false })
          .in('id', activeImgs.map(i => i.id))
      }

      const { error } = await supabase
        .from('cms_section_images')
        .insert({
          section_id: selectedSection.value.id,
          section_key: selectedSection.value.section_key,
          image_url: result.url,
          file_path: result.path,
          alt_text: selectedSection.value.label,
          sort_order: sectionImages.value.length,
          is_active: true,
        })

      if (error) throw error
      showMessage('Image uploaded and set as active', 'success')
      await loadSectionImages(selectedSection.value.id)
    }
  } else {
    showMessage('Upload failed', 'error')
  }

  uploading.value = false
  input.value = ''
}

async function setAsActive(image: SectionImage) {
  if (!selectedSection.value) return

  // Deactivate all for this section
  const activeImgs = sectionImages.value.filter(i => i.is_active && i.id !== image.id)
  if (activeImgs.length > 0) {
    await supabase
      .from('cms_section_images')
      .update({ is_active: false })
      .in('id', activeImgs.map(i => i.id))
  }

  // Activate selected
  await supabase
    .from('cms_section_images')
    .update({ is_active: true })
    .eq('id', image.id)

  await loadSectionImages(selectedSection.value.id)
  showMessage('Set as active image', 'success')
}

async function removeImage(image: SectionImage) {
  if (!confirm('Remove this image?')) return
  await supabase
    .from('cms_section_images')
    .delete()
    .eq('id', image.id)

  await loadSectionImages(selectedSection.value!.id)
  showMessage('Image removed', 'success')
}

async function saveSection() {
  if (!selectedSection.value) return
  saving.value = true
  try {
    const { error } = await supabase
      .from('cms_sections')
      .update({
        default_image_url: selectedSection.value.default_image_url,
        default_video_url: selectedSection.value.default_video_url,
        label: selectedSection.value.label,
        description: selectedSection.value.description,
      })
      .eq('id', selectedSection.value.id)

    if (error) throw error
    showMessage('Section saved', 'success')
    editing.value = false
    await loadSections()
  } catch (e) {
    showMessage('Failed to save section', 'error')
  }
  saving.value = false
}

async function clearVideo() {
  if (!selectedSection.value) return
  const { error } = await supabase
    .from('cms_sections')
    .update({ default_video_url: '' })
    .eq('id', selectedSection.value.id)

  if (!error) {
    selectedSection.value.default_video_url = ''
    showMessage('Video URL cleared', 'success')
  }
}

onMounted(loadSections)
</script>

<template>
  <div class="sections-manager">
    <div v-if="message" class="alert" :class="`alert-${messageType}`">{{ message }}</div>

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
              <span v-if="section.default_video_url" class="video-badge">Video</span>
            </div>
          </button>
        </div>
      </div>

      <div class="image-editor">
        <div v-if="!selectedSection" class="empty-editor">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.3)" stroke-width="1">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
          </svg>
          <p>Select a section to manage its media</p>
        </div>

        <div v-else class="editor-content">
          <div class="editor-header">
            <div>
              <h3 class="editor-title">{{ selectedSection.label }}</h3>
              <p class="editor-page">Page: {{ selectedSection.page }}</p>
              <p v-if="selectedSection.description" class="editor-desc">{{ selectedSection.description }}</p>
            </div>
            <div class="header-actions">
              <button @click="editing = !editing" class="edit-btn">{{ editing ? 'Cancel' : 'Edit' }}</button>
              <button v-if="editing" @click="saveSection" class="save-btn" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
              <label class="upload-btn" :class="{ 'uploading': uploading }">
                <input type="file" accept="image/*,video/*" @change="handleFileUpload" :disabled="uploading" class="hidden-input" />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {{ uploading ? 'Uploading...' : 'Upload Media' }}
              </label>
            </div>
          </div>

          <!-- Editable Fields -->
          <div v-if="editing" class="edit-fields">
            <div class="form-group">
              <label class="form-label">Section Label</label>
              <input v-model="selectedSection.label" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Description</label>
              <input v-model="selectedSection.description" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Default Image URL</label>
              <input v-model="selectedSection.default_image_url" class="form-input" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label class="form-label">Default Video URL</label>
              <input v-model="selectedSection.default_video_url" class="form-input" placeholder="https://...mp4" />
            </div>
          </div>

          <!-- Video Preview -->
          <div v-if="selectedSection.default_video_url" class="video-section">
            <div class="sub-label-row">
              <p class="sub-label">Section Video</p>
              <button v-if="!editing" @click="clearVideo" class="clear-btn" title="Remove video URL">Clear Video</button>
            </div>
            <div class="video-frame">
              <video
                :src="selectedSection.default_video_url"
                controls
                muted
                class="preview-video"
                preload="metadata"
              ></video>
              <div class="video-badge-overlay">Video</div>
            </div>
          </div>

          <!-- Active Image Preview -->
          <div class="current-image-section">
            <p class="sub-label">Active Image</p>
            <div class="active-image-frame">
              <img
                :src="activeImage?.image_url || selectedSection.default_image_url"
                :alt="selectedSection.label"
                class="active-image"
              />
              <div v-if="!activeImage" class="default-badge">Using Default</div>
            </div>
          </div>

          <!-- All Uploaded Images -->
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
                    @click="setAsActive(img)"
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
.alert { padding: 0.75rem 1rem; font-size: 0.8rem; margin-bottom: 1rem; border: 1px solid; }
.alert-success { background: rgba(76,175,80,0.1); border-color: rgba(76,175,80,0.3); color: #4caf50; }
.alert-error { background: rgba(224,123,90,0.1); border-color: rgba(224,123,90,0.3); color: #e07b5a; }

.filter-bar { margin-bottom: 1.5rem; }
.filter-label { font-family: 'Montserrat', sans-serif; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.5); margin-bottom: 0.5rem; display: block; }
.filter-tabs { display: flex; flex-wrap: wrap; gap: 0.375rem; }
.filter-tab { padding: 0.375rem 0.75rem; background: rgba(10,46,74,0.3); border: 1px solid rgba(201,168,76,0.15); color: rgba(248,245,239,0.6); font-family: 'Montserrat', sans-serif; font-size: 0.65rem; letter-spacing: 0.05em; cursor: pointer; transition: all 0.2s; text-transform: capitalize; }
.filter-tab:hover { border-color: rgba(201,168,76,0.3); color: rgba(248,245,239,0.9); }
.filter-active { background: rgba(201,168,76,0.15); border-color: #c9a84c; color: #c9a84c; }

.manager-grid { display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; min-height: 500px; }

.section-list { background: rgba(10,46,74,0.3); border: 1px solid rgba(201,168,76,0.1); overflow: hidden; display: flex; flex-direction: column; }
.list-title { font-family: 'Montserrat', sans-serif; font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.5); padding: 1rem; border-bottom: 1px solid rgba(201,168,76,0.1); }
.sections-scroll { overflow-y: auto; max-height: 600px; }
.section-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: none; border: none; border-bottom: 1px solid rgba(201,168,76,0.05); color: rgba(248,245,239,0.7); cursor: pointer; transition: all 0.2s; text-align: left; width: 100%; }
.section-item:hover { background: rgba(201,168,76,0.05); }
.section-selected { background: rgba(201,168,76,0.1); border-left: 2px solid #c9a84c; }
.section-thumb { width: 48px; height: 36px; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(201,168,76,0.15); }
.section-thumb img { width: 100%; height: 100%; object-fit: cover; }
.section-label { font-size: 0.75rem; font-weight: 500; }
.section-page { font-size: 0.6rem; color: rgba(248,245,239,0.35); text-transform: capitalize; }
.video-badge { font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; background: rgba(13,110,122,0.2); color: #4ea8c9; border: 1px solid rgba(78,168,201,0.3); padding: 0.125rem 0.375rem; display: inline-block; margin-top: 0.25rem; }

.image-editor { background: rgba(10,46,74,0.3); border: 1px solid rgba(201,168,76,0.1); padding: 1.5rem; overflow-y: auto; max-height: 80vh; }
.empty-editor { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; min-height: 400px; color: rgba(248,245,239,0.35); font-size: 0.85rem; }

.editor-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; gap: 1rem; flex-wrap: wrap; }
.editor-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 300; color: #f8f5ef; }
.editor-page { font-size: 0.65rem; color: rgba(248,245,239,0.4); text-transform: capitalize; }
.editor-desc { font-size: 0.75rem; color: rgba(248,245,239,0.5); margin-top: 0.25rem; }

.header-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.edit-btn, .save-btn { padding: 0.375rem 0.75rem; font-family: 'Montserrat', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border: 1px solid; transition: all 0.2s; }
.edit-btn { background: rgba(10,46,74,0.5); border-color: rgba(201,168,76,0.2); color: rgba(248,245,239,0.7); }
.edit-btn:hover { border-color: #c9a84c; color: #c9a84c; }
.save-btn { background: #c9a84c; border-color: #c9a84c; color: #071a2b; }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.upload-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; background: #c9a84c; color: #071a2b; font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
.upload-btn:hover { background: #e8c05a; }
.uploading { opacity: 0.6; cursor: not-allowed; }
.hidden-input { display: none; }

/* Edit Fields */
.edit-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: rgba(7,26,43,0.4); border: 1px solid rgba(201,168,76,0.15); }
.form-group { display: flex; flex-direction: column; gap: 0.375rem; }
.form-group:nth-child(n+3) { grid-column: span 2; }
.form-label { font-family: 'Montserrat', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.5); }
.form-input { background: rgba(7,26,43,0.6); border: 1px solid rgba(201,168,76,0.2); color: #f8f5ef; padding: 0.625rem 0.75rem; font-family: 'Inter', sans-serif; font-size: 0.8rem; outline: none; transition: border-color 0.3s; -webkit-appearance: none; }
.form-input:focus { border-color: #c9a84c; }

/* Video Section */
.video-section { margin-bottom: 1.5rem; }
.sub-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
.clear-btn { background: none; border: 1px solid rgba(224,123,90,0.3); color: rgba(224,123,90,0.7); font-family: 'Montserrat', sans-serif; font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.25rem 0.5rem; cursor: pointer; transition: all 0.2s; }
.clear-btn:hover { background: rgba(224,123,90,0.1); color: #e07b5a; }
.video-frame { position: relative; width: 100%; border: 1px solid rgba(201,168,76,0.2); overflow: hidden; }
.preview-video { width: 100%; max-height: 240px; object-fit: cover; display: block; }
.video-badge-overlay { position: absolute; top: 0.75rem; right: 0.75rem; background: rgba(7,26,43,0.9); border: 1px solid rgba(78,168,201,0.4); padding: 0.25rem 0.75rem; font-family: 'Montserrat', sans-serif; font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; color: #4ea8c9; }

.sub-label { font-family: 'Montserrat', sans-serif; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.4); margin-bottom: 0.75rem; }

.active-image-frame { position: relative; width: 100%; max-height: 300px; overflow: hidden; border: 1px solid rgba(201,168,76,0.2); margin-bottom: 1.5rem; }
.active-image { width: 100%; height: 300px; object-fit: cover; }
.default-badge { position: absolute; top: 0.75rem; right: 0.75rem; background: rgba(7,26,43,0.9); border: 1px solid rgba(201,168,76,0.3); padding: 0.25rem 0.75rem; font-family: 'Montserrat', sans-serif; font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; color: #c9a84c; }

.no-images { padding: 1.5rem; text-align: center; color: rgba(248,245,239,0.35); font-size: 0.8rem; border: 1px dashed rgba(201,168,76,0.15); }

.images-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 0.75rem; }
.image-card { position: relative; border: 1px solid rgba(201,168,76,0.1); overflow: hidden; transition: border-color 0.2s; }
.image-active { border-color: #c9a84c; }
.image-thumb { width: 100%; height: 120px; object-fit: cover; }
.image-actions { display: flex; gap: 0.25rem; padding: 0.5rem; background: rgba(7,26,43,0.8); }
.img-action { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.2); color: rgba(248,245,239,0.6); cursor: pointer; transition: all 0.2s; }
.img-action:hover { background: rgba(201,168,76,0.2); color: #c9a84c; }
.img-action-active { color: #c9a84c; }
.img-action-delete:hover { background: rgba(224,123,90,0.2); color: #e07b5a; border-color: rgba(224,123,90,0.3); }
.image-date { padding: 0.25rem 0.5rem; font-size: 0.55rem; color: rgba(248,245,239,0.3); }

.loading-state { padding: 2rem; text-align: center; color: rgba(248,245,239,0.4); }

@media (max-width: 768px) {
  .manager-grid { grid-template-columns: 1fr; }
  .sections-scroll { max-height: 200px; }
  .edit-fields { grid-template-columns: 1fr; }
  .form-group:nth-child(n+3) { grid-column: span 1; }
}
</style>
