<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

interface Trip {
  id: string
  slug: string
  vessel_name: string
  title: string
  subtitle: string
  duration_days: number
  max_guests: number
  price_aud: number
  price_label: string
  description: string
  short_description: string
  hero_image_url: string
  hero_video_url: string
  is_published: boolean
  sort_order: number
  rezdy_product_id: string
}

interface Feature {
  id: string
  trip_id: string
  feature_text: string
  sort_order: number
}

interface ItineraryDay {
  id: string
  trip_id: string
  day_number: number
  title: string
  description: string
  image_url: string
  activity_label: string
  meals_label: string
}

const DEFAULT_TRIPS = [
  {
    slug: 'sylvia', vessel_name: 'Sylvia', title: 'Sylvia', subtitle: 'Northern Reef Expedition',
    duration_days: 4, max_guests: 12, price_aud: 2495, price_label: 'From $2,495 AUD',
    description: 'Four extraordinary days exploring the untouched northern reaches of Ningaloo Reef aboard our elegant vessel.',
    short_description: 'An intimate four-day voyage exploring the northern reaches of Ningaloo Reef.',
    hero_image_url: 'https://images.pexels.com/photos/6530412/pexels-photo-6530412.jpeg',
    hero_video_url: 'https://cdn.pixabay.com/video/2021/02/18/65560-515098344_large.mp4',
    is_published: true, sort_order: 1, rezdy_product_id: '',
  },
  {
    slug: 'millenium', vessel_name: 'Millenium', title: 'Millenium', subtitle: 'The Ultimate Reef Expedition',
    duration_days: 7, max_guests: 14, price_aud: 4495, price_label: 'From $4,495 AUD',
    description: 'Seven transformative days encompassing the full length of Ningaloo Reef. From whale sharks to humpback whales, this is the definitive ocean adventure.',
    short_description: 'The ultimate seven-day immersion covering the full length of Ningaloo Reef.',
    hero_image_url: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?auto=format&fit=crop&w=1920&q=80',
    hero_video_url: 'https://videos.pexels.com/video-files/30351567/30351567-uhd_2560_1440_25fps.mp4',
    is_published: true, sort_order: 2, rezdy_product_id: '',
  },
]

const trips = ref<Trip[]>([])
const selectedTrip = ref<Trip | null>(null)
const features = ref<Feature[]>([])
const itinerary = ref<ItineraryDay[]>([])
const loading = ref(true)
const saving = ref(false)
const editing = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const newFeature = ref('')
const newDay = ref({ day_number: 1, title: '', description: '', image_url: '', activity_label: '', meals_label: '' })

function showMessage(text: string, type: 'success' | 'error') {
  message.value = text
  messageType.value = type
  setTimeout(() => { message.value = '' }, 3000)
}

async function loadTrips() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('cms_trips')
      .select('*')
      .order('sort_order')

    if (error) throw error

    if (!data || data.length === 0) {
      // Insert default trips if empty
      for (const t of DEFAULT_TRIPS) {
        await supabase.from('cms_trips').insert(t)
      }
      const { data: reData } = await supabase.from('cms_trips').select('*').order('sort_order')
      trips.value = (reData || []) as Trip[]
    } else {
      trips.value = data as Trip[]
    }
  } catch (e) {
    console.warn('Supabase unavailable, using default trips:', e)
    trips.value = DEFAULT_TRIPS.map((t, i) => ({ id: `local-${i}`, ...t } as Trip))
  }
  loading.value = false
}

async function selectTrip(trip: Trip) {
  selectedTrip.value = { ...trip }
  editing.value = false
  await Promise.all([loadFeatures(trip.id), loadItinerary(trip.id)])
}

async function loadFeatures(tripId: string) {
  try {
    const { data, error } = await supabase
      .from('cms_trip_features')
      .select('*')
      .eq('trip_id', tripId)
      .order('sort_order')

    if (error) throw error
    features.value = (data || []) as Feature[]
  } catch (e) {
    console.warn('Supabase unavailable, cannot load features:', e)
    features.value = []
  }
}

async function loadItinerary(tripId: string) {
  try {
    const { data, error } = await supabase
      .from('cms_trip_itinerary')
      .select('*')
      .eq('trip_id', tripId)
      .order('day_number')

    if (error) throw error
    itinerary.value = (data || []) as ItineraryDay[]
  } catch (e) {
    console.warn('Supabase unavailable, cannot load itinerary:', e)
    itinerary.value = []
  }
}

async function saveTrip() {
  if (!selectedTrip.value) return
  saving.value = true

  const { id, ...updates } = selectedTrip.value
  const { error } = await supabase
    .from('cms_trips')
    .update(updates)
    .eq('id', id)

  if (error) {
    showMessage('Failed to save trip', 'error')
  } else {
    showMessage('Trip saved successfully', 'success')
    editing.value = false
    await loadTrips()
  }
  saving.value = false
}

async function addFeature() {
  if (!selectedTrip.value || !newFeature.value.trim()) return

  const { data, error } = await supabase
    .from('cms_trip_features')
    .insert({
      trip_id: selectedTrip.value.id,
      feature_text: newFeature.value.trim(),
      sort_order: features.value.length,
    })
    .select()
    .single()

  if (!error && data) {
    features.value.push(data as Feature)
    newFeature.value = ''
  }
}

async function removeFeature(featureId: string) {
  const { error } = await supabase
    .from('cms_trip_features')
    .delete()
    .eq('id', featureId)

  if (!error) {
    features.value = features.value.filter(f => f.id !== featureId)
  }
}

async function addItineraryDay() {
  if (!selectedTrip.value) return

  const { data, error } = await supabase
    .from('cms_trip_itinerary')
    .insert({
      trip_id: selectedTrip.value.id,
      ...newDay.value,
    })
    .select()
    .single()

  if (!error && data) {
    itinerary.value.push(data as ItineraryDay)
    newDay.value = { day_number: itinerary.value.length + 1, title: '', description: '', image_url: '', activity_label: '', meals_label: '' }
  }
}

async function removeItineraryDay(dayId: string) {
  const { error } = await supabase
    .from('cms_trip_itinerary')
    .delete()
    .eq('id', dayId)

  if (!error) {
    itinerary.value = itinerary.value.filter(d => d.id !== dayId)
  }
}

async function updateItineraryDay(day: ItineraryDay) {
  const { id, ...updates } = day
  const { error } = await supabase
    .from('cms_trip_itinerary')
    .update(updates)
    .eq('id', id)

  if (!error) {
    showMessage('Day updated', 'success')
  }
}

async function togglePublished() {
  if (!selectedTrip.value) return

  const newVal = !selectedTrip.value.is_published
  const { error } = await supabase
    .from('cms_trips')
    .update({ is_published: newVal })
    .eq('id', selectedTrip.value.id)

  if (!error) {
    selectedTrip.value.is_published = newVal
    showMessage(newVal ? 'Trip published' : 'Trip unpublished', 'success')
  }
}

onMounted(loadTrips)
</script>

<template>
  <div class="trips-manager">
    <div v-if="message" class="alert" :class="`alert-${messageType}`">{{ message }}</div>

    <div class="manager-grid">
      <div class="trip-list">
        <h3 class="list-title">Expeditions</h3>
        <div v-if="loading" class="loading-state">Loading...</div>
        <div v-else class="trips-scroll">
          <button
            v-for="trip in trips"
            :key="trip.id"
            @click="selectTrip(trip)"
            class="trip-item"
            :class="{ 'trip-selected': selectedTrip?.id === trip.id }"
          >
            <div class="trip-thumb">
              <img :src="trip.hero_image_url" :alt="trip.title" />
            </div>
            <div class="trip-meta">
              <p class="trip-name">{{ trip.vessel_name }}</p>
              <p class="trip-duration">{{ trip.duration_days }} Day Expedition</p>
              <span class="trip-status" :class="trip.is_published ? 'status-published' : 'status-draft'">
                {{ trip.is_published ? 'Published' : 'Draft' }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <div class="trip-editor">
        <div v-if="!selectedTrip" class="empty-editor">
          <p>Select an expedition to edit</p>
        </div>

        <div v-else class="editor-content">
          <div class="editor-header">
            <h3 class="editor-title">{{ selectedTrip.vessel_name }} - {{ selectedTrip.title }}</h3>
            <div class="header-actions">
              <button @click="togglePublished" class="pub-btn" :class="selectedTrip.is_published ? 'pub-active' : 'pub-inactive'">
                {{ selectedTrip.is_published ? 'Published' : 'Draft' }}
              </button>
              <button @click="editing = !editing" class="edit-btn">{{ editing ? 'Cancel' : 'Edit' }}</button>
              <button v-if="editing" @click="saveTrip" class="save-btn" :disabled="saving">
                {{ saving ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </div>

          <div class="form-grid" :class="{ 'form-readonly': !editing }">
            <div class="form-group">
              <label class="form-label">Vessel Name</label>
              <input v-model="selectedTrip.vessel_name" :readonly="!editing" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Title</label>
              <input v-model="selectedTrip.title" :readonly="!editing" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Subtitle</label>
              <input v-model="selectedTrip.subtitle" :readonly="!editing" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Duration (days)</label>
              <input v-model.number="selectedTrip.duration_days" type="number" :readonly="!editing" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Max Guests</label>
              <input v-model.number="selectedTrip.max_guests" type="number" :readonly="!editing" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Price (AUD)</label>
              <input v-model.number="selectedTrip.price_aud" type="number" step="0.01" :readonly="!editing" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Price Label</label>
              <input v-model="selectedTrip.price_label" :readonly="!editing" class="form-input" placeholder="e.g. From $2,495 AUD" />
            </div>
            <div class="form-group">
              <label class="form-label">Rezdy Product ID</label>
              <input v-model="selectedTrip.rezdy_product_id" :readonly="!editing" class="form-input" placeholder="Rezdy product code" />
            </div>
            <div class="form-group col-span-2">
              <label class="form-label">Short Description</label>
              <textarea v-model="selectedTrip.short_description" :readonly="!editing" class="form-input" rows="2"></textarea>
            </div>
            <div class="form-group col-span-2">
              <label class="form-label">Full Description</label>
              <textarea v-model="selectedTrip.description" :readonly="!editing" class="form-input" rows="4"></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Hero Image URL</label>
              <input v-model="selectedTrip.hero_image_url" :readonly="!editing" class="form-input" />
            </div>
            <div class="form-group">
              <label class="form-label">Hero Video URL</label>
              <input v-model="selectedTrip.hero_video_url" :readonly="!editing" class="form-input" />
            </div>
          </div>

          <div class="sub-section">
            <h4 class="sub-title">Features ({{ features.length }})</h4>
            <div class="features-list">
              <div v-for="feat in features" :key="feat.id" class="feature-item">
                <span>{{ feat.feature_text }}</span>
                <button @click="removeFeature(feat.id)" class="remove-btn" title="Remove">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              </div>
            </div>
            <div class="add-row">
              <input v-model="newFeature" class="form-input" placeholder="Add a feature..." @keyup.enter="addFeature" />
              <button @click="addFeature" class="add-btn">Add</button>
            </div>
          </div>

          <div class="sub-section">
            <h4 class="sub-title">Itinerary ({{ itinerary.length }} days)</h4>
            <div class="itinerary-list">
              <div v-for="day in itinerary" :key="day.id" class="itinerary-item">
                <div class="day-header">
                  <span class="day-number">Day {{ day.day_number }}</span>
                  <input v-model="day.title" class="day-title-input" @change="updateItineraryDay(day)" />
                  <button @click="removeItineraryDay(day.id)" class="remove-btn" title="Remove day">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
                <textarea v-model="day.description" class="form-input" rows="2" @change="updateItineraryDay(day)"></textarea>
                <div class="day-meta-row">
                  <input v-model="day.activity_label" class="form-input sm" placeholder="Activity" @change="updateItineraryDay(day)" />
                  <input v-model="day.meals_label" class="form-input sm" placeholder="Meals" @change="updateItineraryDay(day)" />
                  <input v-model="day.image_url" class="form-input sm" placeholder="Image URL" @change="updateItineraryDay(day)" />
                </div>
              </div>
            </div>
            <div class="add-day-form">
              <p class="add-day-label">Add Day</p>
              <div class="add-row">
                <input v-model.number="newDay.day_number" type="number" class="form-input sm" placeholder="Day #" />
                <input v-model="newDay.title" class="form-input" placeholder="Title" />
                <button @click="addItineraryDay" class="add-btn">Add Day</button>
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

.manager-grid { display: grid; grid-template-columns: 280px 1fr; gap: 1.5rem; min-height: 500px; }

.trip-list { background: rgba(10,46,74,0.3); border: 1px solid rgba(201,168,76,0.1); overflow: hidden; display: flex; flex-direction: column; }
.list-title { font-family: 'Montserrat', sans-serif; font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.5); padding: 1rem; border-bottom: 1px solid rgba(201,168,76,0.1); }
.trips-scroll { overflow-y: auto; max-height: 600px; }
.loading-state { padding: 2rem; text-align: center; color: rgba(248,245,239,0.4); }

.trip-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem; background: none; border: none; border-bottom: 1px solid rgba(201,168,76,0.05); color: rgba(248,245,239,0.7); cursor: pointer; transition: all 0.2s; text-align: left; width: 100%; }
.trip-item:hover { background: rgba(201,168,76,0.05); }
.trip-selected { background: rgba(201,168,76,0.1); border-left: 2px solid #c9a84c; }
.trip-thumb { width: 56px; height: 40px; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(201,168,76,0.15); }
.trip-thumb img { width: 100%; height: 100%; object-fit: cover; }
.trip-name { font-size: 0.8rem; font-weight: 500; }
.trip-duration { font-size: 0.6rem; color: rgba(248,245,239,0.35); }
.trip-status { font-size: 0.5rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.125rem 0.375rem; display: inline-block; margin-top: 0.25rem; }
.status-published { background: rgba(76,175,80,0.15); color: #4caf50; }
.status-draft { background: rgba(201,168,76,0.15); color: #c9a84c; }

.trip-editor { background: rgba(10,46,74,0.3); border: 1px solid rgba(201,168,76,0.1); padding: 1.5rem; }
.empty-editor { display: flex; align-items: center; justify-content: center; min-height: 400px; color: rgba(248,245,239,0.35); }

.editor-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 0.75rem; }
.editor-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 300; color: #f8f5ef; }
.header-actions { display: flex; gap: 0.5rem; }
.pub-btn, .edit-btn, .save-btn { padding: 0.375rem 0.75rem; font-family: 'Montserrat', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border: 1px solid; transition: all 0.2s; }
.pub-active { background: rgba(76,175,80,0.15); border-color: rgba(76,175,80,0.3); color: #4caf50; }
.pub-inactive { background: rgba(201,168,76,0.15); border-color: rgba(201,168,76,0.3); color: #c9a84c; }
.edit-btn { background: rgba(10,46,74,0.5); border-color: rgba(201,168,76,0.2); color: rgba(248,245,239,0.7); }
.edit-btn:hover { border-color: #c9a84c; color: #c9a84c; }
.save-btn { background: #c9a84c; border-color: #c9a84c; color: #071a2b; }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 2rem; }
.form-readonly .form-input { opacity: 0.7; cursor: default; }
.form-group { display: flex; flex-direction: column; gap: 0.375rem; }
.col-span-2 { grid-column: span 2; }
.form-label { font-family: 'Montserrat', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.5); }
.form-input { background: rgba(7,26,43,0.6); border: 1px solid rgba(201,168,76,0.2); color: #f8f5ef; padding: 0.625rem 0.75rem; font-family: 'Inter', sans-serif; font-size: 0.8rem; outline: none; transition: border-color 0.3s; -webkit-appearance: none; }
.form-input:focus { border-color: #c9a84c; }
.form-input.sm { padding: 0.5rem 0.625rem; font-size: 0.7rem; }

.sub-section { margin-bottom: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(201,168,76,0.1); }
.sub-title { font-family: 'Montserrat', sans-serif; font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.5); margin-bottom: 1rem; }

.features-list { display: flex; flex-direction: column; gap: 0.375rem; margin-bottom: 0.75rem; }
.feature-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0.75rem; background: rgba(7,26,43,0.4); border: 1px solid rgba(201,168,76,0.08); font-size: 0.8rem; color: rgba(248,245,239,0.7); }
.remove-btn { background: none; border: none; color: rgba(224,123,90,0.5); cursor: pointer; padding: 0.25rem; transition: color 0.2s; }
.remove-btn:hover { color: #e07b5a; }

.add-row { display: flex; gap: 0.5rem; }
.add-btn { padding: 0.5rem 1rem; background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.3); color: #c9a84c; font-family: 'Montserrat', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.add-btn:hover { background: rgba(201,168,76,0.25); }

.itinerary-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1rem; }
.itinerary-item { padding: 1rem; background: rgba(7,26,43,0.3); border: 1px solid rgba(201,168,76,0.08); }
.day-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; }
.day-number { font-family: 'Montserrat', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #c9a84c; white-space: nowrap; }
.day-title-input { flex: 1; background: rgba(7,26,43,0.6); border: 1px solid rgba(201,168,76,0.2); color: #f8f5ef; padding: 0.5rem 0.75rem; font-family: 'Inter', sans-serif; font-size: 0.8rem; outline: none; }
.day-meta-row { display: grid; grid-template-columns: 1fr 1fr 2fr; gap: 0.5rem; margin-top: 0.75rem; }

.add-day-form { padding: 1rem; background: rgba(7,26,43,0.2); border: 1px dashed rgba(201,168,76,0.15); }
.add-day-label { font-family: 'Montserrat', sans-serif; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.4); margin-bottom: 0.75rem; }

@media (max-width: 768px) {
  .manager-grid { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .col-span-2 { grid-column: span 1; }
  .day-meta-row { grid-template-columns: 1fr; }
}
</style>
