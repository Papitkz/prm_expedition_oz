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

interface SectionVideo {
  id: string
  section_id: string
  video_url: string
  file_path: string
  sort_order: number
  is_active: boolean
  created_at: string
}

const sections = ref<Section[]>([])
const selectedPage = ref('all')
const selectedSection = ref<Section | null>(null)
const sectionImages = ref<SectionImage[]>([])
const sectionVideos = ref<SectionVideo[]>([])
const loading = ref(true)
const uploading = ref(false)
const uploadingType = ref<'image' | 'video'>('image')
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
const activeVideo = computed(() => sectionVideos.value.find(v => v.is_active))

const resolvedImageUrl = computed(() => activeImage.value?.image_url || selectedSection.value?.default_image_url || '')
const resolvedVideoUrl = computed(() => activeVideo.value?.video_url || selectedSection.value?.default_video_url || '')

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
  await Promise.all([loadSectionImages(section.id), loadSectionVideos(section.id)])
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

async function loadSectionVideos(sectionId: string) {
  try {
    const { data, error } = await supabase
      .from('cms_section_videos')
      .select('*')
      .eq('section_id', sectionId)
      .order('sort_order')

    if (error) throw error
    sectionVideos.value = (data || []) as SectionVideo[]
  } catch (e) {
    console.warn('Supabase unavailable, cannot load section videos:', e)
    sectionVideos.value = []
  }
}

async function handleImageUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length || !selectedSection.value) return

  const file = input.files[0]
  if (!file.type.startsWith('image/')) {
    showMessage('Please select an image file', 'error')
    return
  }

  uploading.value = true
  uploadingType.value = 'image'
  const result = await uploadImage(file, selectedSection.value.section_key)

  if (result) {
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
  } else {
    showMessage('Image upload failed', 'error')
  }

  uploading.value = false
  input.value = ''
}

async function handleVideoUpload(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files?.length || !selectedSection.value) return

  const file = input.files[0]
  if (!file.type.startsWith('video/')) {
    showMessage('Please select a video file', 'error')
    return
  }

  uploading.value = true
  uploadingType.value = 'video'
  const result = await uploadImage(file, selectedSection.value.section_key)

  if (result) {
    const activeVids = sectionVideos.value.filter(v => v.is_active)
    if (activeVids.length > 0) {
      await supabase
        .from('cms_section_videos')
        .update({ is_active: false })
        .in('id', activeVids.map(v => v.id))
    }

    const { error } = await supabase
      .from('cms_section_videos')
      .insert({
        section_id: selectedSection.value.id,
        section_key: selectedSection.value.section_key,
        video_url: result.url,
        file_path: result.path,
        sort_order: sectionVideos.value.length,
        is_active: true,
      })

    if (error) throw error
    showMessage('Video uploaded and set as active', 'success')
    await loadSectionVideos(selectedSection.value.id)
  } else {
    showMessage('Video upload failed', 'error')
  }

  uploading.value = false
  input.value = ''
}

async function setImageActive(image: SectionImage) {
  if (!selectedSection.value) return

  const activeImgs = sectionImages.value.filter(i => i.is_active && i.id !== image.id)
  if (activeImgs.length > 0) {
    await supabase
      .from('cms_section_images')
      .update({ is_active: false })
      .in('id', activeImgs.map(i => i.id))
  }

  await supabase
    .from('cms_section_images')
    .update({ is_active: true })
    .eq('id', image.id)

  await loadSectionImages(selectedSection.value.id)
  showMessage('Set as active image', 'success')
}

async function setVideoActive(video: SectionVideo) {
  if (!selectedSection.value) return

  const activeVids = sectionVideos.value.filter(v => v.is_active && v.id !== video.id)
  if (activeVids.length > 0) {
    await supabase
      .from('cms_section_videos')
      .update({ is_active: false })
      .in('id', activeVids.map(v => v.id))
  }

  await supabase
    .from('cms_section_videos')
    .update({ is_active: true })
    .eq('id', video.id)

  await loadSectionVideos(selectedSection.value.id)
  showMessage('Set as active video', 'success')
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

async function removeVideo(video: SectionVideo) {
  if (!confirm('Remove this video?')) return
  await supabase
    .from('cms_section_videos')
    .delete()
    .eq('id', video.id)

  await loadSectionVideos(selectedSection.value!.id)
  showMessage('Video removed', 'success')
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

async function clearDefaultVideo() {
  if (!selectedSection.value) return
  const { error } = await supabase
    .from('cms_sections')
    .update({ default_video_url: '' })
    .eq('id', selectedSection.value.id)

  if (!error) {
    selectedSection.value.default_video_url = ''
    showMessage('Default video URL cleared', 'success')
  }
}

async function clearDefaultImage() {
  if (!selectedSection.value) return
  const { error } = await supabase
    .from('cms_sections')
    .update({ default_image_url: '' })
    .eq('id', selectedSection.value.id)

  if (!error) {
    selectedSection.value.default_image_url = ''
    showMessage('Default image URL cleared', 'success')
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
              <img :src="section.default_image_url || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2248%22 height=%2236%22%3E%3Crect fill=%22%230a2e4a%22 width=%2248%22 height=%2236%22/%3E%3C/svg%3E'" :alt="section.label" />
            </div>
            <div class="section-meta">
              <p class="section-label">{{ section.label }}</p>
              <p class="section-page">{{ section.page }}</p>
              <div class="section-badges">
                <span v-if="section.default_video_url" class="video-badge">Video</span>
                <span v-if="section.default_image_url" class="image-badge">Image</span>
              </div>
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
              <label class="form-label">Default Image URL (fallback)</label>
              <input v-model="selectedSection.default_image_url" class="form-input" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label class="form-label">Default Video URL (fallback)</label>
              <input v-model="selectedSection.default_video_url" class="form-input" placeholder="https://...mp4" />
            </div>
          </div>

          <!-- ============ IMAGE SECTION ============ -->
          <div class="media-section">
            <div class="sub-label-row">
              <p class="sub-label">Image</p>
              <div class="sub-label-actions">
                <span v-if="activeImage" class="status-badge status-override">Custom Override</span>
                <span v-else-if="selectedSection.default_image_url" class="status-badge status-default">Using Default</span>
                <span v-else class="status-badge status-none">No Image</span>
                <label class="upload-btn-sm" :class="{ 'uploading': uploading && uploadingType === 'image' }">
                  <input type="file" accept="image/*" @change="handleImageUpload" :disabled="uploading" class="hidden-input" />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  {{ uploading && uploadingType === 'image' ? 'Uploading...' : 'Upload Image' }}
                </label>
              </div>
            </div>

            <!-- Active Image Preview -->
            <div class="active-image-frame">
              <img
                v-if="resolvedImageUrl"
                :src="resolvedImageUrl"
                :alt="selectedSection.label"
                class="active-image"
              />
              <div v-else class="no-media-placeholder">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.2)" stroke-width="1">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
                </svg>
                <span>No image set</span>
              </div>
              <div v-if="!activeImage && selectedSection.default_image_url" class="default-badge">Default</div>
              <div v-if="activeImage" class="override-badge">Custom</div>
            </div>

            <!-- All Uploaded Images -->
            <div class="all-uploads-section">
              <p class="sub-sub-label">Uploaded Images ({{ sectionImages.length }})</p>
              <div v-if="sectionImages.length === 0" class="no-uploads">
                No custom images uploaded. Upload one to override the default.
              </div>
              <div v-else class="uploads-grid">
                <div
                  v-for="img in sectionImages"
                  :key="img.id"
                  class="upload-card"
                  :class="{ 'upload-active': img.is_active }"
                >
                  <img :src="img.image_url" :alt="img.alt_text" class="upload-thumb" />
                  <div class="upload-actions">
                    <button
                      @click="setImageActive(img)"
                      class="upload-action"
                      :class="{ 'upload-action-active': img.is_active }"
                      :title="img.is_active ? 'Currently active' : 'Set as active'"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </button>
                    <button @click="removeImage(img)" class="upload-action upload-action-delete" title="Remove">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                  <div class="upload-date">{{ new Date(img.created_at).toLocaleDateString() }}</div>
                </div>
              </div>
            </div>

            <button v-if="!editing && selectedSection.default_image_url" @click="clearDefaultImage" class="clear-btn" title="Remove default image URL">Clear Default Image URL</button>
          </div>

          <!-- ============ VIDEO SECTION ============ -->
          <div class="media-section">
            <div class="sub-label-row">
              <p class="sub-label">Video</p>
              <div class="sub-label-actions">
                <span v-if="activeVideo" class="status-badge status-override">Custom Override</span>
                <span v-else-if="selectedSection.default_video_url" class="status-badge status-default">Using Default</span>
                <span v-else class="status-badge status-none">No Video</span>
                <label class="upload-btn-sm" :class="{ 'uploading': uploading && uploadingType === 'video' }">
                  <input type="file" accept="video/*" @change="handleVideoUpload" :disabled="uploading" class="hidden-input" />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  {{ uploading && uploadingType === 'video' ? 'Uploading...' : 'Upload Video' }}
                </label>
              </div>
            </div>

            <!-- Active Video Preview -->
            <div v-if="resolvedVideoUrl" class="active-video-frame">
              <video
                :src="resolvedVideoUrl"
                controls
                muted
                class="preview-video"
                preload="metadata"
              ></video>
              <div v-if="!activeVideo && selectedSection.default_video_url" class="default-badge">Default</div>
              <div v-if="activeVideo" class="override-badge">Custom</div>
            </div>
            <div v-else class="no-media-placeholder-wide">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(201,168,76,0.2)" stroke-width="1">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <span>No video set</span>
            </div>

            <!-- All Uploaded Videos -->
            <div class="all-uploads-section">
              <p class="sub-sub-label">Uploaded Videos ({{ sectionVideos.length }})</p>
              <div v-if="sectionVideos.length === 0" class="no-uploads">
                No custom videos uploaded. Upload one to override the default.
              </div>
              <div v-else class="videos-list">
                <div
                  v-for="vid in sectionVideos"
                  :key="vid.id"
                  class="video-card"
                  :class="{ 'video-active': vid.is_active }"
                >
                  <div class="video-card-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  </div>
                  <div class="video-card-info">
                    <p class="video-card-url">{{ vid.video_url.length > 60 ? vid.video_url.substring(0, 60) + '...' : vid.video_url }}</p>
                    <p class="video-card-date">{{ new Date(vid.created_at).toLocaleDateString() }}</p>
                  </div>
                  <div class="video-card-actions">
                    <button
                      @click="setVideoActive(vid)"
                      class="upload-action"
                      :class="{ 'upload-action-active': vid.is_active }"
                      :title="vid.is_active ? 'Currently active' : 'Set as active'"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    </button>
                    <button @click="removeVideo(vid)" class="upload-action upload-action-delete" title="Remove">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <button v-if="!editing && selectedSection.default_video_url" @click="clearDefaultVideo" class="clear-btn" title="Remove default video URL">Clear Default Video URL</button>
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
.section-thumb { width: 48px; height: 36px; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(201,168,76,0.15); background: #0a2e4a; }
.section-thumb img { width: 100%; height: 100%; object-fit: cover; }
.section-label { font-size: 0.75rem; font-weight: 500; }
.section-page { font-size: 0.6rem; color: rgba(248,245,239,0.35); text-transform: capitalize; }
.section-badges { display: flex; gap: 0.375rem; margin-top: 0.25rem; }
.video-badge { font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; background: rgba(13,110,122,0.2); color: #4ea8c9; border: 1px solid rgba(78,168,201,0.3); padding: 0.125rem 0.375rem; display: inline-block; }
.image-badge { font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; background: rgba(201,168,76,0.15); color: #c9a84c; border: 1px solid rgba(201,168,76,0.3); padding: 0.125rem 0.375rem; display: inline-block; }

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

.hidden-input { display: none; }

/* Edit Fields */
.edit-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: rgba(7,26,43,0.4); border: 1px solid rgba(201,168,76,0.15); }
.form-group { display: flex; flex-direction: column; gap: 0.375rem; }
.form-group:nth-child(n+3) { grid-column: span 2; }
.form-label { font-family: 'Montserrat', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.5); }
.form-input { background: rgba(7,26,43,0.6); border: 1px solid rgba(201,168,76,0.2); color: #f8f5ef; padding: 0.625rem 0.75rem; font-family: 'Inter', sans-serif; font-size: 0.8rem; outline: none; transition: border-color 0.3s; -webkit-appearance: none; }
.form-input:focus { border-color: #c9a84c; }

/* Media Section */
.media-section { margin-bottom: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(201,168,76,0.1); }
.media-section:first-of-type { border-top: none; padding-top: 0; }

.sub-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem; }
.sub-label-actions { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }

.status-badge { font-family: 'Montserrat', sans-serif; font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.2rem 0.5rem; border: 1px solid; }
.status-override { background: rgba(76,175,80,0.1); border-color: rgba(76,175,80,0.3); color: #4caf50; }
.status-default { background: rgba(201,168,76,0.1); border-color: rgba(201,168,76,0.3); color: #c9a84c; }
.status-none { background: rgba(248,245,239,0.05); border-color: rgba(248,245,239,0.1); color: rgba(248,245,239,0.4); }

.upload-btn-sm { display: inline-flex; align-items: center; gap: 0.375rem; padding: 0.375rem 0.75rem; background: #c9a84c; color: #071a2b; font-family: 'Montserrat', sans-serif; font-size: 0.55rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
.upload-btn-sm:hover { background: #e8c05a; }
.uploading { opacity: 0.6; cursor: not-allowed; }

.sub-label { font-family: 'Montserrat', sans-serif; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.4); margin-bottom: 0; }
.sub-sub-label { font-family: 'Montserrat', sans-serif; font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(248,245,239,0.3); margin-bottom: 0.5rem; }

/* Image Preview */
.active-image-frame { position: relative; width: 100%; max-height: 300px; overflow: hidden; border: 1px solid rgba(201,168,76,0.2); margin-bottom: 1rem; background: rgba(7,26,43,0.4); }
.active-image { width: 100%; height: 300px; object-fit: cover; }
.default-badge { position: absolute; top: 0.75rem; right: 0.75rem; background: rgba(7,26,43,0.9); border: 1px solid rgba(201,168,76,0.3); padding: 0.2rem 0.6rem; font-family: 'Montserrat', sans-serif; font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; color: #c9a84c; }
.override-badge { position: absolute; top: 0.75rem; right: 0.75rem; background: rgba(7,26,43,0.9); border: 1px solid rgba(76,175,80,0.3); padding: 0.2rem 0.6rem; font-family: 'Montserrat', sans-serif; font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; color: #4caf50; }

.no-media-placeholder { width: 100%; height: 200px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; color: rgba(248,245,239,0.25); font-size: 0.75rem; }
.no-media-placeholder-wide { width: 100%; padding: 2rem; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.75rem; color: rgba(248,245,239,0.25); font-size: 0.75rem; border: 1px dashed rgba(201,168,76,0.15); margin-bottom: 1rem; }

/* Video Preview */
.active-video-frame { position: relative; width: 100%; border: 1px solid rgba(201,168,76,0.2); overflow: hidden; margin-bottom: 1rem; background: #000; }
.preview-video { width: 100%; max-height: 240px; object-fit: contain; display: block; }

/* Uploads Grid */
.all-uploads-section { margin-bottom: 0.75rem; }
.no-uploads { padding: 1rem; text-align: center; color: rgba(248,245,239,0.3); font-size: 0.75rem; border: 1px dashed rgba(201,168,76,0.1); }

.uploads-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.5rem; }
.upload-card { position: relative; border: 1px solid rgba(201,168,76,0.1); overflow: hidden; transition: border-color 0.2s; }
.upload-active { border-color: #c9a84c; }
.upload-thumb { width: 100%; height: 100px; object-fit: cover; }
.upload-actions { display: flex; gap: 0.25rem; padding: 0.375rem; background: rgba(7,26,43,0.8); }
.upload-action { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; background: rgba(201,168,76,0.1); border: 1px solid rgba(201,168,76,0.2); color: rgba(248,245,239,0.6); cursor: pointer; transition: all 0.2s; }
.upload-action:hover { background: rgba(201,168,76,0.2); color: #c9a84c; }
.upload-action-active { color: #c9a84c; }
.upload-action-delete:hover { background: rgba(224,123,90,0.2); color: #e07b5a; border-color: rgba(224,123,90,0.3); }
.upload-date { padding: 0.2rem 0.375rem; font-size: 0.5rem; color: rgba(248,245,239,0.25); }

/* Video List */
.videos-list { display: flex; flex-direction: column; gap: 0.5rem; }
.video-card { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; background: rgba(7,26,43,0.4); border: 1px solid rgba(201,168,76,0.08); transition: border-color 0.2s; }
.video-card:hover { border-color: rgba(201,168,76,0.2); }
.video-active { border-color: rgba(76,175,80,0.3); background: rgba(76,175,80,0.05); }
.video-card-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: rgba(13,110,122,0.15); border: 1px solid rgba(78,168,201,0.2); color: #4ea8c9; flex-shrink: 0; }
.video-card-info { flex: 1; min-width: 0; }
.video-card-url { font-size: 0.7rem; color: rgba(248,245,239,0.7); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.video-card-date { font-size: 0.55rem; color: rgba(248,245,239,0.3); margin-top: 0.125rem; }
.video-card-actions { display: flex; gap: 0.25rem; flex-shrink: 0; }

.clear-btn { background: none; border: 1px solid rgba(224,123,90,0.3); color: rgba(224,123,90,0.7); font-family: 'Montserrat', sans-serif; font-size: 0.55rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.25rem 0.5rem; cursor: pointer; transition: all 0.2s; margin-top: 0.5rem; }
.clear-btn:hover { background: rgba(224,123,90,0.1); color: #e07b5a; }

.loading-state { padding: 2rem; text-align: center; color: rgba(248,245,239,0.4); }

@media (max-width: 768px) {
  .manager-grid { grid-template-columns: 1fr; }
  .sections-scroll { max-height: 200px; }
  .edit-fields { grid-template-columns: 1fr; }
  .form-group:nth-child(n+3) { grid-column: span 1; }
  .sub-label-row { flex-direction: column; align-items: flex-start; }
  .sub-label-actions { width: 100%; }
  .upload-btn-sm { width: 100%; justify-content: center; }
}
</style>
