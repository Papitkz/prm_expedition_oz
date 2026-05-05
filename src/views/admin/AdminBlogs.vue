<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

interface Blog {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  cover_image_url: string
  author_name: string
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

const blogs = ref<Blog[]>([])
const selectedBlog = ref<Blog | null>(null)
const loading = ref(true)
const saving = ref(false)
const editing = ref(false)
const creating = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

const newBlog = ref({ title: '', slug: '', excerpt: '', content: '', cover_image_url: '', author_name: 'Expedition OZ' })

function showMessage(text: string, type: 'success' | 'error') {
  message.value = text
  messageType.value = type
  setTimeout(() => { message.value = '' }, 3000)
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

async function loadBlogs() {
  loading.value = true
  const { data, error } = await supabase.from('cms_blogs').select('*').order('created_at', { ascending: false })
  if (!error && data) blogs.value = data as Blog[]
  loading.value = false
}

async function selectBlog(blog: Blog) {
  selectedBlog.value = { ...blog }
  editing.value = false
  creating.value = false
}

async function createBlog() {
  if (!newBlog.value.title.trim()) return
  saving.value = true

  const slug = newBlog.value.slug || generateSlug(newBlog.value.title)
  const { data, error } = await supabase.from('cms_blogs').insert({
    slug,
    title: newBlog.value.title,
    excerpt: newBlog.value.excerpt,
    content: newBlog.value.content,
    cover_image_url: newBlog.value.cover_image_url,
    author_name: newBlog.value.author_name,
    is_published: false,
  }).select().single()

  if (!error && data) {
    blogs.value.unshift(data as Blog)
    selectedBlog.value = data as Blog
    creating.value = false
    newBlog.value = { title: '', slug: '', excerpt: '', content: '', cover_image_url: '', author_name: 'Expedition OZ' }
    showMessage('Blog post created', 'success')
  } else {
    showMessage('Failed to create: ' + (error?.message || 'Unknown error'), 'error')
  }
  saving.value = false
}

async function saveBlog() {
  if (!selectedBlog.value) return
  saving.value = true

  const { id, ...updates } = selectedBlog.value
  const { error } = await supabase.from('cms_blogs').update(updates).eq('id', id)

  if (!error) {
    showMessage('Blog saved', 'success')
    editing.value = false
    await loadBlogs()
  } else {
    showMessage('Failed to save: ' + error.message, 'error')
  }
  saving.value = false
}

async function togglePublished() {
  if (!selectedBlog.value) return
  const newVal = !selectedBlog.value.is_published
  const updates: any = { is_published: newVal }
  if (newVal && !selectedBlog.value.published_at) updates.published_at = new Date().toISOString()

  await supabase.from('cms_blogs').update(updates).eq('id', selectedBlog.value.id)
  selectedBlog.value.is_published = newVal
  if (newVal) selectedBlog.value.published_at = updates.published_at
  showMessage(newVal ? 'Published' : 'Unpublished', 'success')
  await loadBlogs()
}

async function deleteBlog() {
  if (!selectedBlog.value || !confirm('Delete this blog post?')) return
  await supabase.from('cms_blogs').delete().eq('id', selectedBlog.value.id)
  blogs.value = blogs.value.filter(b => b.id !== selectedBlog.value!.id)
  selectedBlog.value = null
  showMessage('Blog deleted', 'success')
}

function startCreating() {
  creating.value = true
  selectedBlog.value = null
  editing.value = false
}

onMounted(loadBlogs)
</script>

<template>
  <div class="blogs-manager">
    <div v-if="message" class="alert" :class="`alert-${messageType}`">{{ message }}</div>

    <div class="manager-grid">
      <!-- Blog List -->
      <div class="blog-list">
        <div class="list-header">
          <h3 class="list-title">Blog Posts</h3>
          <button @click="startCreating" class="new-btn">+ New</button>
        </div>
        <div v-if="loading" class="loading-state">Loading...</div>
        <div v-else class="blogs-scroll">
          <button
            v-for="blog in blogs"
            :key="blog.id"
            @click="selectBlog(blog)"
            class="blog-item"
            :class="{ 'blog-selected': selectedBlog?.id === blog.id }"
          >
            <div class="blog-thumb" v-if="blog.cover_image_url">
              <img :src="blog.cover_image_url" :alt="blog.title" />
            </div>
            <div class="blog-meta">
              <p class="blog-title-text">{{ blog.title }}</p>
              <p class="blog-date">{{ new Date(blog.created_at).toLocaleDateString() }}</p>
              <span class="blog-status" :class="blog.is_published ? 'status-published' : 'status-draft'">
                {{ blog.is_published ? 'Published' : 'Draft' }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Blog Editor -->
      <div class="blog-editor">
        <!-- Create Form -->
        <div v-if="creating" class="editor-content">
          <h3 class="editor-title">New Blog Post</h3>
          <div class="form-grid">
            <div class="form-group col-span-2">
              <label class="form-label">Title</label>
              <input v-model="newBlog.title" class="form-input" placeholder="Blog post title" @input="newBlog.slug = generateSlug(newBlog.title)" />
            </div>
            <div class="form-group col-span-2">
              <label class="form-label">Slug</label>
              <input v-model="newBlog.slug" class="form-input" placeholder="url-slug" />
            </div>
            <div class="form-group col-span-2">
              <label class="form-label">Excerpt</label>
              <textarea v-model="newBlog.excerpt" class="form-input" rows="2" placeholder="Brief summary..."></textarea>
            </div>
            <div class="form-group col-span-2">
              <label class="form-label">Content</label>
              <textarea v-model="newBlog.content" class="form-input content-area" rows="10" placeholder="Full blog post content..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Cover Image URL</label>
              <input v-model="newBlog.cover_image_url" class="form-input" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label class="form-label">Author</label>
              <input v-model="newBlog.author_name" class="form-input" />
            </div>
          </div>
          <div class="form-actions">
            <button @click="creating = false" class="cancel-btn">Cancel</button>
            <button @click="createBlog" class="save-btn" :disabled="saving">{{ saving ? 'Creating...' : 'Create Post' }}</button>
          </div>
        </div>

        <!-- Edit/View Blog -->
        <div v-else-if="selectedBlog" class="editor-content">
          <div class="editor-header">
            <h3 class="editor-title">{{ selectedBlog.title }}</h3>
            <div class="header-actions">
              <button @click="togglePublished" class="pub-btn" :class="selectedBlog.is_published ? 'pub-active' : 'pub-inactive'">
                {{ selectedBlog.is_published ? 'Published' : 'Draft' }}
              </button>
              <button @click="editing = !editing" class="edit-btn">{{ editing ? 'Cancel' : 'Edit' }}</button>
              <button v-if="editing" @click="saveBlog" class="save-btn" :disabled="saving">{{ saving ? 'Saving...' : 'Save' }}</button>
              <button @click="deleteBlog" class="delete-btn">Delete</button>
            </div>
          </div>

          <div class="form-grid" :class="{ 'form-readonly': !editing }">
            <div class="form-group col-span-2">
              <label class="form-label">Title</label>
              <input v-model="selectedBlog.title" :readonly="!editing" class="form-input" />
            </div>
            <div class="form-group col-span-2">
              <label class="form-label">Slug</label>
              <input v-model="selectedBlog.slug" :readonly="!editing" class="form-input" />
            </div>
            <div class="form-group col-span-2">
              <label class="form-label">Excerpt</label>
              <textarea v-model="selectedBlog.excerpt" :readonly="!editing" class="form-input" rows="2"></textarea>
            </div>
            <div class="form-group col-span-2">
              <label class="form-label">Content</label>
              <textarea v-model="selectedBlog.content" :readonly="!editing" class="form-input content-area" rows="12"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Cover Image URL</label>
              <input v-model="selectedBlog.cover_image_url" :readonly="!editing" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Author</label>
              <input v-model="selectedBlog.author_name" :readonly="!editing" class="form-input" />
            </div>
          </div>

          <div v-if="selectedBlog.cover_image_url" class="cover-preview">
            <p class="sub-label">Cover Preview</p>
            <img :src="selectedBlog.cover_image_url" :alt="selectedBlog.title" class="cover-img" />
          </div>
        </div>

        <div v-else class="empty-editor">
          <p>Select a blog post or create a new one</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert { padding: 0.75rem 1rem; font-size: 0.8rem; margin-bottom: 1rem; border: 1px solid; }
.alert-success { background: rgba(76,175,80,0.1); border-color: rgba(76,175,80,0.3); color: #4caf50; }
.alert-error { background: rgba(224,123,90,0.1); border-color: rgba(224,123,90,0.3); color: #e07b5a; }

.manager-grid { display: grid; grid-template-columns: 300px 1fr; gap: 1.5rem; min-height: 500px; }

.blog-list { background: rgba(10,46,74,0.3); border: 1px solid rgba(201,168,76,0.1); overflow: hidden; display: flex; flex-direction: column; }
.list-header { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1rem; border-bottom: 1px solid rgba(201,168,76,0.1); }
.list-title { font-family: 'Montserrat', sans-serif; font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.5); }
.new-btn { background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.3); color: #c9a84c; font-family: 'Montserrat', sans-serif; font-size: 0.6rem; font-weight: 600; padding: 0.25rem 0.75rem; cursor: pointer; }
.blogs-scroll { overflow-y: auto; max-height: 600px; }

.blog-item { display: flex; gap: 0.75rem; padding: 0.75rem 1rem; background: none; border: none; border-bottom: 1px solid rgba(201,168,76,0.05); color: rgba(248,245,239,0.7); cursor: pointer; transition: all 0.2s; text-align: left; width: 100%; }
.blog-item:hover { background: rgba(201,168,76,0.05); }
.blog-selected { background: rgba(201,168,76,0.1); border-left: 2px solid #c9a84c; }
.blog-thumb { width: 48px; height: 36px; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(201,168,76,0.15); }
.blog-thumb img { width: 100%; height: 100%; object-fit: cover; }
.blog-title-text { font-size: 0.75rem; font-weight: 500; line-height: 1.3; }
.blog-date { font-size: 0.55rem; color: rgba(248,245,239,0.35); margin-top: 0.25rem; }
.blog-status { font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.125rem 0.375rem; display: inline-block; margin-top: 0.25rem; }
.status-published { background: rgba(76,175,80,0.15); color: #4caf50; }
.status-draft { background: rgba(201,168,76,0.15); color: #c9a84c; }

.blog-editor { background: rgba(10,46,74,0.3); border: 1px solid rgba(201,168,76,0.1); padding: 1.5rem; }
.empty-editor { display: flex; align-items: center; justify-content: center; min-height: 400px; color: rgba(248,245,239,0.35); }

.editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem; }
.editor-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 300; color: #f8f5ef; }
.header-actions { display: flex; gap: 0.5rem; }
.pub-btn, .edit-btn, .save-btn, .delete-btn, .cancel-btn { padding: 0.375rem 0.75rem; font-family: 'Montserrat', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border: 1px solid; transition: all 0.2s; }
.pub-active { background: rgba(76,175,80,0.15); border-color: rgba(76,175,80,0.3); color: #4caf50; }
.pub-inactive { background: rgba(201,168,76,0.15); border-color: rgba(201,168,76,0.3); color: #c9a84c; }
.edit-btn { background: rgba(10,46,74,0.5); border-color: rgba(201,168,76,0.2); color: rgba(248,245,239,0.7); }
.save-btn { background: #c9a84c; border-color: #c9a84c; color: #071a2b; }
.save-btn:disabled { opacity: 0.5; }
.cancel-btn { background: none; border-color: rgba(248,245,239,0.2); color: rgba(248,245,239,0.5); }
.delete-btn { background: none; border-color: rgba(224,123,90,0.3); color: rgba(224,123,90,0.7); }
.delete-btn:hover { background: rgba(224,123,90,0.1); color: #e07b5a; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
.form-readonly .form-input { opacity: 0.7; cursor: default; }
.form-group { display: flex; flex-direction: column; gap: 0.375rem; }
.col-span-2 { grid-column: span 2; }
.form-label { font-family: 'Montserrat', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.5); }
.form-input { background: rgba(7,26,43,0.6); border: 1px solid rgba(201,168,76,0.2); color: #f8f5ef; padding: 0.625rem 0.75rem; font-family: 'Inter', sans-serif; font-size: 0.8rem; outline: none; transition: border-color 0.3s; -webkit-appearance: none; resize: vertical; }
.form-input:focus { border-color: #c9a84c; }
.content-area { min-height: 200px; }

.form-actions { display: flex; gap: 0.75rem; justify-content: flex-end; }

.sub-label { font-family: 'Montserrat', sans-serif; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.4); margin-bottom: 0.5rem; }
.cover-preview { margin-top: 1rem; }
.cover-img { max-width: 100%; max-height: 200px; object-fit: cover; border: 1px solid rgba(201,168,76,0.15); }

.loading-state { padding: 2rem; text-align: center; color: rgba(248,245,239,0.4); }

@media (max-width: 768px) {
  .manager-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .col-span-2 { grid-column: span 1; }
}
</style>
