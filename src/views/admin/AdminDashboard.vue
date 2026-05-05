<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getFirebaseDb, initFirebase } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'

const stats = ref([
  { label: 'Sections', value: 0, icon: 'images' },
  { label: 'Trips', value: 0, icon: 'trips' },
  { label: 'Blog Posts', value: 0, icon: 'blog' },
  { label: 'Uploaded Images', value: 0, icon: 'uploads' },
])

const recentActivity = ref<any[]>([])

onMounted(async () => {
  initFirebase()

  try {
    const db = getFirebaseDb()

    const [sectionsSnap, tripsSnap, blogsSnap, imagesSnap] = await Promise.all([
      getDocs(collection(db, 'cms_sections')),
      getDocs(collection(db, 'cms_trips')),
      getDocs(query(collection(db, 'cms_blogs'), where('isPublished', '==', true))),
      getDocs(collection(db, 'cms_section_images')),
    ])

    stats.value[0].value = sectionsSnap.size
    stats.value[1].value = tripsSnap.size
    stats.value[2].value = blogsSnap.size
    stats.value[3].value = imagesSnap.size

    const recentSnap = await getDocs(query(collection(db, 'cms_section_images'), orderBy('createdAt', 'desc'), limit(5)))
    recentActivity.value = recentSnap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch (e) {
    console.warn('Firestore unavailable, dashboard stats will show 0:', e)
  }
})

import { where } from 'firebase/firestore'

const iconPaths: Record<string, string> = {
  images: 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
  trips: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  blog: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
  uploads: 'M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z',
}
</script>

<template>
  <div class="dashboard">
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.label" class="stat-card">
        <div class="stat-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#c9a84c">
            <path :d="iconPaths[stat.icon]"/>
          </svg>
        </div>
        <div class="stat-info">
          <p class="stat-value">{{ stat.value }}</p>
          <p class="stat-label">{{ stat.label }}</p>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h2 class="section-title">Quick Actions</h2>
      <div class="actions-grid">
        <router-link to="/admin/sections" class="action-card">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>
          </svg>
          <span>Manage Images</span>
        </router-link>
        <router-link to="/admin/trips" class="action-card">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span>Edit Trips</span>
        </router-link>
        <router-link to="/admin/blogs" class="action-card">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.5">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
          <span>Write Blog Post</span>
        </router-link>
        <router-link to="/admin/settings" class="action-card">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" stroke-width="1.5">
            <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
          <span>Settings & Rezdy</span>
        </router-link>
      </div>
    </div>

    <div class="recent-section">
      <h2 class="section-title">Recent Uploads</h2>
      <div v-if="recentActivity.length === 0" class="empty-state">
        <p>No images uploaded yet. Go to Section Images to start.</p>
      </div>
      <div v-else class="recent-grid">
        <div v-for="item in recentActivity" :key="item.id" class="recent-item">
          <img :src="item.imageUrl" :alt="item.altText" class="recent-thumb" />
          <div class="recent-info">
            <p class="recent-label">{{ item.sectionLabel || 'Unknown' }}</p>
            <p class="recent-date">{{ item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(10, 46, 74, 0.4);
  border: 1px solid rgba(201, 168, 76, 0.12);
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(201, 168, 76, 0.1);
  border: 1px solid rgba(201, 168, 76, 0.2);
  flex-shrink: 0;
}

.stat-value {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.75rem;
  font-weight: 300;
  color: #c9a84c;
}

.stat-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.6rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(248, 245, 239, 0.5);
}

.section-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 300;
  color: #f8f5ef;
  margin-bottom: 1rem;
}

.quick-actions { margin-bottom: 2rem; }

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.75rem;
}

.action-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(10, 46, 74, 0.3);
  border: 1px solid rgba(201, 168, 76, 0.1);
  color: rgba(248, 245, 239, 0.7);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s;
}

.action-card:hover {
  border-color: rgba(201, 168, 76, 0.3);
  background: rgba(201, 168, 76, 0.05);
  color: #c9a84c;
}

.recent-section { margin-bottom: 2rem; }

.empty-state {
  padding: 2rem;
  text-align: center;
  color: rgba(248, 245, 239, 0.4);
  font-size: 0.85rem;
  border: 1px dashed rgba(201, 168, 76, 0.15);
}

.recent-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: rgba(10, 46, 74, 0.3);
  border: 1px solid rgba(201, 168, 76, 0.08);
}

.recent-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  flex-shrink: 0;
}

.recent-label { font-size: 0.75rem; color: rgba(248, 245, 239, 0.8); }
.recent-date { font-size: 0.6rem; color: rgba(248, 245, 239, 0.35); }
</style>
