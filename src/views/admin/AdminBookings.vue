<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getFirebaseDb } from '@/lib/firebase'
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'

interface Booking {
  id: string
  fullName: string
  email: string
  phone: string
  tripId: string
  tripName: string
  selectedDate: any
  participants: number
  specialRequirements: string
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: any
  updatedAt: any
}

const bookings = ref<Booking[]>([])
const loading = ref(true)
const message = ref('')
const messageType = ref<'success' | 'error'>('success')
const selectedBooking = ref<Booking | null>(null)
const showModal = ref(false)
const filterStatus = ref('all')
const searchQuery = ref('')

const filteredBookings = computed(() => {
  let result = bookings.value

  if (filterStatus.value !== 'all') {
    result = result.filter(b => b.status === filterStatus.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(b =>
      b.fullName.toLowerCase().includes(q) ||
      b.email.toLowerCase().includes(q) ||
      b.tripName.toLowerCase().includes(q)
    )
  }

  return result
})

const stats = computed(() => ({
  total: bookings.value.length,
  pending: bookings.value.filter(b => b.status === 'pending').length,
  confirmed: bookings.value.filter(b => b.status === 'confirmed').length,
  cancelled: bookings.value.filter(b => b.status === 'cancelled').length,
}))

function showMessage(text: string, type: 'success' | 'error') {
  message.value = text
  messageType.value = type
  setTimeout(() => { message.value = '' }, 3000)
}

async function loadBookings() {
  loading.value = true
  try {
    const db = getFirebaseDb()
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    bookings.value = snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking))
  } catch (e) {
    console.warn('Firebase unavailable, bookings empty:', e)
    bookings.value = []
  }
  loading.value = false
}

function viewBooking(booking: Booking) {
  selectedBooking.value = { ...booking }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  selectedBooking.value = null
}

async function updateStatus(booking: Booking, newStatus: 'pending' | 'confirmed' | 'cancelled') {
  try {
    const db = getFirebaseDb()
    await updateDoc(doc(db, 'bookings', booking.id), {
      status: newStatus,
      updatedAt: serverTimestamp(),
    })
    booking.status = newStatus
    showMessage(`Booking status updated to ${newStatus}`, 'success')
    await loadBookings()
  } catch (e) {
    showMessage('Failed to update status', 'error')
  }
}

async function deleteBooking(booking: Booking) {
  if (!confirm(`Delete booking from ${booking.fullName}? This cannot be undone.`)) return

  try {
    const db = getFirebaseDb()
    await deleteDoc(doc(db, 'bookings', booking.id))
    showMessage('Booking deleted', 'success')
    closeModal()
    await loadBookings()
  } catch (e) {
    showMessage('Failed to delete booking', 'error')
  }
}

function formatDate(timestamp: any): string {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatSimpleDate(timestamp: any): string {
  if (!timestamp) return 'N/A'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  })
}

const statusColors: Record<string, string> = {
  pending: 'status-pending',
  confirmed: 'status-confirmed',
  cancelled: 'status-cancelled',
}

onMounted(loadBookings)
</script>

<template>
  <div class="bookings-page">
    <div v-if="message" class="alert" :class="`alert-${messageType}`">{{ message }}</div>

    <!-- Stats Cards -->
    <div class="stats-row">
      <div class="stat-card" @click="filterStatus = 'all'" :class="{ 'stat-active': filterStatus === 'all' }">
        <p class="stat-value">{{ stats.total }}</p>
        <p class="stat-label">Total</p>
      </div>
      <div class="stat-card stat-pending" @click="filterStatus = 'pending'" :class="{ 'stat-active': filterStatus === 'pending' }">
        <p class="stat-value">{{ stats.pending }}</p>
        <p class="stat-label">Pending</p>
      </div>
      <div class="stat-card stat-confirmed" @click="filterStatus = 'confirmed'" :class="{ 'stat-active': filterStatus === 'confirmed' }">
        <p class="stat-value">{{ stats.confirmed }}</p>
        <p class="stat-label">Confirmed</p>
      </div>
      <div class="stat-card stat-cancelled" @click="filterStatus = 'cancelled'" :class="{ 'stat-active': filterStatus === 'cancelled' }">
        <p class="stat-value">{{ stats.cancelled }}</p>
        <p class="stat-label">Cancelled</p>
      </div>
    </div>

    <!-- Search -->
    <div class="search-bar">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by name, email, or trip..."
        class="search-input"
      />
    </div>

    <!-- Bookings List -->
    <div class="bookings-section">
      <div v-if="loading" class="loading-state">Loading bookings...</div>

      <div v-else-if="filteredBookings.length === 0" class="empty-state">
        {{ searchQuery || filterStatus !== 'all' ? 'No bookings match your search.' : 'No bookings yet. Bookings will appear here when customers submit requests.' }}
      </div>

      <div v-else class="bookings-list">
        <div
          v-for="booking in filteredBookings"
          :key="booking.id"
          class="booking-card"
          @click="viewBooking(booking)"
        >
          <div class="booking-main">
            <div class="booking-avatar">{{ booking.fullName.charAt(0).toUpperCase() }}</div>
            <div class="booking-info">
              <p class="booking-name">{{ booking.fullName }}</p>
              <p class="booking-email">{{ booking.email }}</p>
              <p class="booking-trip">{{ booking.tripName }}</p>
            </div>
          </div>
          <div class="booking-meta">
            <span class="booking-participants">{{ booking.participants }} {{ booking.participants === 1 ? 'person' : 'people' }}</span>
            <span class="booking-status" :class="statusColors[booking.status]">{{ booking.status }}</span>
            <span class="booking-date">{{ formatSimpleDate(booking.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Booking Detail Modal -->
    <div v-if="showModal && selectedBooking" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button @click="closeModal" class="modal-close" aria-label="Close modal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <h2 class="modal-title">Booking Details</h2>

        <div class="modal-section">
          <h3 class="section-label">Contact Information</h3>
          <div class="detail-row">
            <span class="detail-label">Full Name</span>
            <span class="detail-value">{{ selectedBooking.fullName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email</span>
            <a :href="`mailto:${selectedBooking.email}`" class="detail-link">{{ selectedBooking.email }}</a>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone</span>
            <a :href="`tel:${selectedBooking.phone}`" class="detail-link">{{ selectedBooking.phone }}</a>
          </div>
        </div>

        <div class="modal-section">
          <h3 class="section-label">Trip Details</h3>
          <div class="detail-row">
            <span class="detail-label">Trip</span>
            <span class="detail-value">{{ selectedBooking.tripName }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Preferred Date</span>
            <span class="detail-value">{{ formatSimpleDate(selectedBooking.selectedDate) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Participants</span>
            <span class="detail-value">{{ selectedBooking.participants }} {{ selectedBooking.participants === 1 ? 'person' : 'people' }}</span>
          </div>
        </div>

        <div v-if="selectedBooking.specialRequirements" class="modal-section">
          <h3 class="section-label">Special Requirements</h3>
          <p class="detail-text">{{ selectedBooking.specialRequirements }}</p>
        </div>

        <div class="modal-section">
          <h3 class="section-label">Status</h3>
          <div class="status-row">
            <span class="booking-status large" :class="statusColors[selectedBooking.status]">{{ selectedBooking.status }}</span>
            <span class="detail-date">Submitted {{ formatDate(selectedBooking.createdAt) }}</span>
          </div>
        </div>

        <div class="modal-actions">
          <button
            v-if="selectedBooking.status !== 'confirmed'"
            @click="updateStatus(selectedBooking, 'confirmed')"
            class="action-btn confirm-btn"
          >
            Confirm Booking
          </button>
          <button
            v-if="selectedBooking.status !== 'pending'"
            @click="updateStatus(selectedBooking, 'pending')"
            class="action-btn pending-btn"
          >
            Mark Pending
          </button>
          <button
            v-if="selectedBooking.status !== 'cancelled'"
            @click="updateStatus(selectedBooking, 'cancelled')"
            class="action-btn cancel-btn"
          >
            Cancel Booking
          </button>
          <button
            @click="deleteBooking(selectedBooking)"
            class="action-btn delete-btn"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.alert { padding: 0.75rem 1rem; font-size: 0.8rem; margin-bottom: 1rem; border: 1px solid; }
.alert-success { background: rgba(76,175,80,0.1); border-color: rgba(76,175,80,0.3); color: #4caf50; }
.alert-error { background: rgba(224,123,90,0.1); border-color: rgba(224,123,90,0.3); color: #e07b5a; }

/* Stats Row */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  padding: 1rem;
  background: rgba(10, 46, 74, 0.4);
  border: 1px solid rgba(201, 168, 76, 0.12);
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.stat-card:hover {
  border-color: rgba(201, 168, 76, 0.3);
}

.stat-active {
  border-color: #c9a84c !important;
  background: rgba(201, 168, 76, 0.1);
}

.stat-pending { border-left: 3px solid #ffc107; }
.stat-confirmed { border-left: 3px solid #4caf50; }
.stat-cancelled { border-left: 3px solid #e07b5a; }

.stat-value {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.75rem;
  font-weight: 300;
  color: #c9a84c;
}

.stat-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.55rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(248, 245, 239, 0.5);
  margin-top: 0.25rem;
}

/* Search Bar */
.search-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(7, 26, 43, 0.6);
  border: 1px solid rgba(201, 168, 76, 0.2);
  padding: 0.75rem 1rem;
  margin-bottom: 1.5rem;
  color: rgba(248, 245, 239, 0.5);
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #f8f5ef;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  outline: none;
}

.search-input::placeholder {
  color: rgba(248, 245, 239, 0.35);
}

/* Bookings Section */
.bookings-section {
  background: rgba(10, 46, 74, 0.3);
  border: 1px solid rgba(201, 168, 76, 0.1);
  padding: 1.5rem;
}

.loading-state, .empty-state {
  padding: 3rem;
  text-align: center;
  color: rgba(248, 245, 239, 0.4);
  font-size: 0.85rem;
}

.empty-state {
  border: 1px dashed rgba(201, 168, 76, 0.15);
}

.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.booking-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(7, 26, 43, 0.4);
  border: 1px solid rgba(201, 168, 76, 0.08);
  cursor: pointer;
  transition: all 0.2s;
}

.booking-card:hover {
  border-color: rgba(201, 168, 76, 0.25);
  background: rgba(201, 168, 76, 0.03);
}

.booking-main {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.booking-avatar {
  width: 42px;
  height: 42px;
  background: rgba(201, 168, 76, 0.15);
  border: 1px solid rgba(201, 168, 76, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #c9a84c;
  flex-shrink: 0;
}

.booking-name {
  font-size: 0.9rem;
  color: rgba(248, 245, 239, 0.9);
  font-weight: 500;
}

.booking-email {
  font-size: 0.7rem;
  color: rgba(248, 245, 239, 0.5);
  margin-top: 0.125rem;
}

.booking-trip {
  font-size: 0.7rem;
  color: #c9a84c;
  margin-top: 0.25rem;
}

.booking-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.booking-participants {
  font-size: 0.7rem;
  color: rgba(248, 245, 239, 0.5);
}

.booking-status {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.55rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.25rem 0.5rem;
  border: 1px solid;
}

.booking-status.large {
  font-size: 0.65rem;
  padding: 0.375rem 0.75rem;
}

.status-pending { background: rgba(255,193,7,0.15); border-color: rgba(255,193,7,0.3); color: #ffc107; }
.status-confirmed { background: rgba(76,175,80,0.15); border-color: rgba(76,175,80,0.3); color: #4caf50; }
.status-cancelled { background: rgba(224,123,90,0.15); border-color: rgba(224,123,90,0.3); color: #e07b5a; }

.booking-date {
  font-size: 0.65rem;
  color: rgba(248, 245, 239, 0.35);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 1rem;
}

.modal-content {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  background: #0a2e4a;
  border: 1px solid rgba(201, 168, 76, 0.2);
  padding: 2rem;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: rgba(248, 245, 239, 0.5);
  cursor: pointer;
  padding: 0.5rem;
}

.modal-close:hover {
  color: #c9a84c;
}

.modal-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.75rem;
  font-weight: 300;
  color: #f8f5ef;
  margin-bottom: 1.5rem;
}

.modal-section {
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(201, 168, 76, 0.1);
}

.modal-section:last-of-type {
  border-bottom: none;
  padding-bottom: 0;
}

.section-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(248, 245, 239, 0.4);
  margin-bottom: 0.75rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.detail-label {
  font-size: 0.8rem;
  color: rgba(248, 245, 239, 0.5);
}

.detail-value {
  font-size: 0.85rem;
  color: rgba(248, 245, 239, 0.9);
}

.detail-link {
  font-size: 0.85rem;
  color: #c9a84c;
  text-decoration: none;
}

.detail-link:hover {
  text-decoration: underline;
}

.detail-text {
  font-size: 0.85rem;
  color: rgba(248, 245, 239, 0.7);
  line-height: 1.6;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.detail-date {
  font-size: 0.7rem;
  color: rgba(248, 245, 239, 0.35);
}

.modal-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(201, 168, 76, 0.1);
}

.action-btn {
  flex: 1;
  min-width: 120px;
  padding: 0.625rem 1rem;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.2s;
}

.confirm-btn {
  background: rgba(76,175,80,0.1);
  border-color: rgba(76,175,80,0.3);
  color: #4caf50;
}

.confirm-btn:hover {
  background: rgba(76,175,80,0.2);
}

.pending-btn {
  background: rgba(255,193,7,0.1);
  border-color: rgba(255,193,7,0.3);
  color: #ffc107;
}

.pending-btn:hover {
  background: rgba(255,193,7,0.2);
}

.cancel-btn {
  background: rgba(224,123,90,0.1);
  border-color: rgba(224,123,90,0.3);
  color: #e07b5a;
}

.cancel-btn:hover {
  background: rgba(224,123,90,0.2);
}

.delete-btn {
  background: rgba(220,53,69,0.1);
  border-color: rgba(220,53,69,0.3);
  color: #dc3545;
}

.delete-btn:hover {
  background: rgba(220,53,69,0.2);
}

@media (max-width: 768px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .booking-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .booking-meta {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
