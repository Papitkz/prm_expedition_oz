<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { initFirebase, type FirebaseConfig } from '@/lib/firebase'

interface Setting {
  id: string
  setting_key: string
  setting_value: string
  description: string
}

const settings = ref<Setting[]>([])
const loading = ref(true)
const saving = ref(false)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

// Firebase config form
const firebaseConfig = ref({
  apiKey: '',
  authDomain: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
})

function showMessage(text: string, type: 'success' | 'error') {
  message.value = text
  messageType.value = type
  setTimeout(() => { message.value = '' }, 3000)
}

async function loadSettings() {
  loading.value = true
  const { data, error } = await supabase.from('cms_settings').select('*').order('setting_key')
  if (!error && data) {
    settings.value = data as Setting[]

    // Parse firebase config
    const firebaseSetting = data.find(s => s.setting_key === 'firebase_config')
    if (firebaseSetting?.setting_value) {
      try {
        const parsed = JSON.parse(firebaseSetting.setting_value)
        firebaseConfig.value = { ...firebaseConfig.value, ...parsed }
      } catch { /* ignore parse errors */ }
    }
  }
  loading.value = false
}

async function saveSetting(key: string, value: string) {
  saving.value = true
  const { error } = await supabase
    .from('cms_settings')
    .update({ setting_value: value })
    .eq('setting_key', key)

  if (!error) showMessage('Setting saved', 'success')
  else showMessage('Failed to save: ' + error.message, 'error')
  saving.value = false
}

async function saveFirebaseConfig() {
  saving.value = true
  const configJson = JSON.stringify(firebaseConfig.value)
  const { error } = await supabase
    .from('cms_settings')
    .update({ setting_value: configJson })
    .eq('setting_key', 'firebase_config')

  if (!error) {
    showMessage('Firebase config saved', 'success')
    // Test initialization
    try {
      initFirebase(firebaseConfig.value as FirebaseConfig)
      showMessage('Firebase initialized successfully', 'success')
    } catch (e: any) {
      showMessage('Firebase init failed: ' + e.message, 'error')
    }
  } else {
    showMessage('Failed to save: ' + error.message, 'error')
  }
  saving.value = false
}

function getSettingValue(key: string): string {
  return settings.value.find(s => s.setting_key === key)?.setting_value || ''
}

function updateSettingValue(key: string, value: string) {
  const setting = settings.value.find(s => s.setting_key === key)
  if (setting) setting.setting_value = value
}

onMounted(loadSettings)
</script>

<template>
  <div class="settings-page">
    <div v-if="message" class="alert" :class="`alert-${messageType}`">{{ message }}</div>

    <!-- Firebase Configuration -->
    <div class="settings-card">
      <h3 class="card-title">Firebase Configuration</h3>
      <p class="card-desc">Required for image uploads. Enter your Firebase project credentials below.</p>

      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">API Key</label>
          <input v-model="firebaseConfig.apiKey" class="form-input" placeholder="AIzaSy..." />
        </div>
        <div class="form-group">
          <label class="form-label">Auth Domain</label>
          <input v-model="firebaseConfig.authDomain" class="form-input" placeholder="your-project.firebaseapp.com" />
        </div>
        <div class="form-group">
          <label class="form-label">Project ID</label>
          <input v-model="firebaseConfig.projectId" class="form-input" placeholder="your-project-id" />
        </div>
        <div class="form-group">
          <label class="form-label">Storage Bucket</label>
          <input v-model="firebaseConfig.storageBucket" class="form-input" placeholder="your-project.appspot.com" />
        </div>
        <div class="form-group">
          <label class="form-label">Messaging Sender ID</label>
          <input v-model="firebaseConfig.messagingSenderId" class="form-input" placeholder="123456789" />
        </div>
        <div class="form-group">
          <label class="form-label">App ID</label>
          <input v-model="firebaseConfig.appId" class="form-input" placeholder="1:123456:web:abc123" />
        </div>
      </div>

      <button @click="saveFirebaseConfig" class="save-btn" :disabled="saving">
        {{ saving ? 'Saving...' : 'Save Firebase Config' }}
      </button>
    </div>

    <!-- Rezdy Integration -->
    <div class="settings-card">
      <h3 class="card-title">Rezdy Booking Integration</h3>
      <p class="card-desc">Connect your Rezdy account to enable live availability and booking on expedition pages.</p>

      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Rezdy Company Code</label>
          <input
            :value="getSettingValue('rezdy_company_code')"
            @input="updateSettingValue('rezdy_company_code', ($event.target as HTMLInputElement).value)"
            class="form-input"
            placeholder="your-company-code"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Sylvia Rezdy Product ID</label>
          <input
            :value="getSettingValue('rezdy_sylvia_product_id')"
            @input="updateSettingValue('rezdy_sylvia_product_id', ($event.target as HTMLInputElement).value)"
            class="form-input"
            placeholder="e.g. 12345"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Millenium Rezdy Product ID</label>
          <input
            :value="getSettingValue('rezdy_millenium_product_id')"
            @input="updateSettingValue('rezdy_millenium_product_id', ($event.target as HTMLInputElement).value)"
            class="form-input"
            placeholder="e.g. 67890"
          />
        </div>
      </div>

      <div class="rezdy-preview">
        <p class="sub-label">Rezdy Widget Preview</p>
        <p class="preview-text">Once configured, booking buttons on expedition pages will link to your Rezdy checkout. The widget URL format is:</p>
        <code class="code-block">https://{{ getSettingValue('rezdy_company_code') || 'your-company' }}.rezdy.com/catalog/{{ getSettingValue('rezdy_sylvia_product_id') || 'PRODUCT_ID' }}</code>
      </div>

      <div class="btn-row">
        <button @click="saveSetting('rezdy_company_code', getSettingValue('rezdy_company_code'))" class="save-btn" :disabled="saving">Save Rezdy Settings</button>
      </div>
    </div>

    <!-- Site Settings -->
    <div class="settings-card">
      <h3 class="card-title">Site Settings</h3>
      <p class="card-desc">General site contact information.</p>

      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input
            :value="getSettingValue('site_phone')"
            @input="updateSettingValue('site_phone', ($event.target as HTMLInputElement).value)"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input
            :value="getSettingValue('site_email')"
            @input="updateSettingValue('site_email', ($event.target as HTMLInputElement).value)"
            class="form-input"
          />
        </div>
      </div>

      <div class="btn-row">
        <button @click="saveSetting('site_phone', getSettingValue('site_phone'))" class="save-btn" :disabled="saving">Save Phone</button>
        <button @click="saveSetting('site_email', getSettingValue('site_email'))" class="save-btn" :disabled="saving">Save Email</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert { padding: 0.75rem 1rem; font-size: 0.8rem; margin-bottom: 1rem; border: 1px solid; }
.alert-success { background: rgba(76,175,80,0.1); border-color: rgba(76,175,80,0.3); color: #4caf50; }
.alert-error { background: rgba(224,123,90,0.1); border-color: rgba(224,123,90,0.3); color: #e07b5a; }

.settings-card {
  background: rgba(10,46,74,0.3);
  border: 1px solid rgba(201,168,76,0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 300;
  color: #f8f5ef;
  margin-bottom: 0.25rem;
}

.card-desc {
  font-size: 0.8rem;
  color: rgba(248,245,239,0.5);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group { display: flex; flex-direction: column; gap: 0.375rem; }
.form-label { font-family: 'Montserrat', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.5); }
.form-input { background: rgba(7,26,43,0.6); border: 1px solid rgba(201,168,76,0.2); color: #f8f5ef; padding: 0.625rem 0.75rem; font-family: 'Inter', sans-serif; font-size: 0.8rem; outline: none; transition: border-color 0.3s; -webkit-appearance: none; }
.form-input:focus { border-color: #c9a84c; }

.save-btn {
  padding: 0.625rem 1.5rem;
  background: #c9a84c;
  border: 1px solid #c9a84c;
  color: #071a2b;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s;
}
.save-btn:hover { background: #e8c05a; }
.save-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-row { display: flex; gap: 0.75rem; }

.rezdy-preview {
  padding: 1rem;
  background: rgba(7,26,43,0.4);
  border: 1px solid rgba(201,168,76,0.08);
  margin-bottom: 1.5rem;
}

.sub-label { font-family: 'Montserrat', sans-serif; font-size: 0.6rem; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(248,245,239,0.4); margin-bottom: 0.5rem; }
.preview-text { font-size: 0.75rem; color: rgba(248,245,239,0.5); margin-bottom: 0.5rem; line-height: 1.5; }
.code-block { display: block; padding: 0.75rem; background: rgba(7,26,43,0.8); border: 1px solid rgba(201,168,76,0.15); font-family: 'SF Mono', monospace; font-size: 0.75rem; color: #c9a84c; word-break: break-all; }

@media (max-width: 768px) {
  .form-grid { grid-template-columns: 1fr; }
}
</style>
