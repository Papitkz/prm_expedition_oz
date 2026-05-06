<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminAuth } from '@/composables/useAdminAuth'
import { supabase } from '@/lib/supabase'

const { isOwner, user } = useAdminAuth()

interface AdminUser {
  id: string
  uid: string
  email: string
  display_name: string
  role: string
  created_at: string
}

const users = ref<AdminUser[]>([])
const loading = ref(true)
const grantEmail = ref('')
const message = ref('')
const messageType = ref<'success' | 'error'>('success')

function showMessage(text: string, type: 'success' | 'error') {
  message.value = text
  messageType.value = type
  setTimeout(() => { message.value = '' }, 3000)
}

async function loadUsers() {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    users.value = (data || []) as AdminUser[]
  } catch (e) {
    console.warn('Supabase unavailable, cannot load users:', e)
    users.value = []
  }
  loading.value = false
}

async function grantAccess() {
  if (!grantEmail.value.trim()) return
  const email = grantEmail.value.trim().toLowerCase()

  try {
    const existingUser = users.value.find(u => u.email?.toLowerCase() === email)

    if (existingUser) {
      const { error } = await supabase
        .from('admin_users')
        .update({ role: 'admin' })
        .eq('uid', existingUser.uid)
      if (error) throw error
      existingUser.role = 'admin'
      showMessage(`Admin access granted to ${email}`, 'success')
    } else {
      const { error } = await supabase
        .from('admin_grants')
        .upsert({
          email,
          granted_by: user.value?.id,
          role: 'admin',
        })
      if (error) throw error
      showMessage(`Pending grant created for ${email}. They will get admin access when they sign up.`, 'success')
    }

    grantEmail.value = ''
    await loadUsers()
  } catch (e) {
    console.warn('Failed to grant access:', e)
    showMessage('Failed to grant access. Supabase may be unavailable.', 'error')
  }
}

async function revokeAccess(u: AdminUser) {
  if (u.email === 'johnfritzizar35@gmail.com') {
    showMessage('Cannot revoke owner access', 'error')
    return
  }

  try {
    const { error } = await supabase
      .from('admin_users')
      .update({ role: 'user' })
      .eq('uid', u.uid)
    if (error) throw error
    u.role = 'user'
    showMessage(`Admin access revoked for ${u.email}`, 'success')
    await loadUsers()
  } catch (e) {
    console.warn('Failed to revoke access:', e)
    showMessage('Failed to revoke access. Supabase may be unavailable.', 'error')
  }
}

async function promoteAccess(u: AdminUser) {
  try {
    const { error } = await supabase
      .from('admin_users')
      .update({ role: 'admin' })
      .eq('uid', u.uid)
    if (error) throw error
    u.role = 'admin'
    showMessage(`Admin access granted to ${u.email}`, 'success')
    await loadUsers()
  } catch (e) {
    console.warn('Failed to promote:', e)
    showMessage('Failed to grant access. Supabase may be unavailable.', 'error')
  }
}

onMounted(loadUsers)
</script>

<template>
  <div class="users-page">
    <div v-if="!isOwner" class="access-denied">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(224,123,90,0.5)" stroke-width="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
      <h2 class="denied-title">Access Restricted</h2>
      <p class="denied-text">Only the site owner can manage user access.</p>
    </div>

    <template v-else>
      <div v-if="message" class="alert" :class="`alert-${messageType}`">{{ message }}</div>

      <!-- Grant Access -->
      <div class="settings-card">
        <h3 class="card-title">Grant Admin Access</h3>
        <p class="card-desc">Enter an email address to grant admin access. If the user has already signed in, they will be promoted immediately. Otherwise, a pending grant will be applied when they register.</p>

        <div class="grant-row">
          <input
            v-model="grantEmail"
            class="form-input"
            type="email"
            placeholder="user@example.com"
            @keyup.enter="grantAccess"
          />
          <button @click="grantAccess" class="grant-btn">Grant Access</button>
        </div>
      </div>

      <!-- User List -->
      <div class="settings-card">
        <h3 class="card-title">Registered Users</h3>
        <p class="card-desc">Manage admin access for registered users.</p>

        <div v-if="loading" class="loading-state">Loading users...</div>

        <div v-else-if="users.length === 0" class="empty-state">
          No registered users found. Users will appear here after they sign in.
        </div>

        <div v-else class="users-list">
          <div
            v-for="u in users"
            :key="u.uid"
            class="user-row"
            :class="{ 'user-owner': u.email === 'johnfritzizar35@gmail.com' }"
          >
            <div class="user-row-avatar">{{ u.email?.charAt(0).toUpperCase() || '?' }}</div>
            <div class="user-row-info">
              <p class="user-row-email">{{ u.email }}</p>
              <p class="user-row-name">{{ u.display_name || 'No name set' }}</p>
            </div>
            <div class="user-row-role">
              <span class="role-badge" :class="`role-${u.role}`">
                {{ u.email === 'johnfritzizar35@gmail.com' ? 'Owner' : u.role }}
              </span>
            </div>
            <div class="user-row-actions">
              <button
                v-if="u.email !== 'johnfritzizar35@gmail.com' && u.role !== 'admin'"
                @click="promoteAccess(u)"
                class="action-btn promote-btn"
              >
                Make Admin
              </button>
              <button
                v-if="u.email !== 'johnfritzizar35@gmail.com' && u.role === 'admin'"
                @click="revokeAccess(u)"
                class="action-btn revoke-btn"
              >
                Revoke
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.access-denied {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: 1rem;
  text-align: center;
}

.denied-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 300;
  color: #e07b5a;
}

.denied-text {
  font-size: 0.85rem;
  color: rgba(248, 245, 239, 0.5);
}

.alert { padding: 0.75rem 1rem; font-size: 0.8rem; margin-bottom: 1rem; border: 1px solid; }
.alert-success { background: rgba(76,175,80,0.1); border-color: rgba(76,175,80,0.3); color: #4caf50; }
.alert-error { background: rgba(224,123,90,0.1); border-color: rgba(224,123,90,0.3); color: #e07b5a; }

.settings-card { background: rgba(10,46,74,0.3); border: 1px solid rgba(201,168,76,0.1); padding: 1.5rem; margin-bottom: 1.5rem; }
.card-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 300; color: #f8f5ef; margin-bottom: 0.25rem; }
.card-desc { font-size: 0.8rem; color: rgba(248,245,239,0.5); margin-bottom: 1.5rem; line-height: 1.6; }

.grant-row { display: flex; gap: 0.75rem; }
.form-input { flex: 1; background: rgba(7,26,43,0.6); border: 1px solid rgba(201,168,76,0.2); color: #f8f5ef; padding: 0.625rem 0.75rem; font-family: 'Inter', sans-serif; font-size: 0.8rem; outline: none; transition: border-color 0.3s; -webkit-appearance: none; }
.form-input:focus { border-color: #c9a84c; }

.grant-btn { padding: 0.625rem 1.5rem; background: #c9a84c; border: 1px solid #c9a84c; color: #071a2b; font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.grant-btn:hover { background: #e8c05a; }

.loading-state { padding: 2rem; text-align: center; color: rgba(248,245,239,0.4); }
.empty-state { padding: 2rem; text-align: center; color: rgba(248,245,239,0.4); font-size: 0.85rem; border: 1px dashed rgba(201,168,76,0.15); }

.users-list { display: flex; flex-direction: column; gap: 0.5rem; }

.user-row { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(7,26,43,0.4); border: 1px solid rgba(201,168,76,0.08); transition: border-color 0.2s; }
.user-row:hover { border-color: rgba(201,168,76,0.2); }
.user-owner { border-color: rgba(201,168,76,0.3); background: rgba(201,168,76,0.05); }

.user-row-avatar { width: 40px; height: 40px; background: rgba(201,168,76,0.15); border: 1px solid rgba(201,168,76,0.2); display: flex; align-items: center; justify-content: center; font-family: 'Montserrat', sans-serif; font-size: 0.9rem; font-weight: 600; color: #c9a84c; flex-shrink: 0; }
.user-owner .user-row-avatar { background: rgba(201,168,76,0.3); border-color: #c9a84c; box-shadow: 0 0 8px rgba(201,168,76,0.2); }

.user-row-info { flex: 1; min-width: 0; }
.user-row-email { font-size: 0.8rem; color: rgba(248,245,239,0.85); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-row-name { font-size: 0.65rem; color: rgba(248,245,239,0.4); margin-top: 0.125rem; }

.user-row-role { flex-shrink: 0; }

.role-badge { font-family: 'Montserrat', sans-serif; font-size: 0.55rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.25rem 0.625rem; display: inline-block; }
.role-owner { background: rgba(201,168,76,0.25); color: #c9a84c; border: 1px solid rgba(201,168,76,0.4); }
.role-admin { background: rgba(76,175,80,0.15); color: #4caf50; border: 1px solid rgba(76,175,80,0.3); }
.role-user { background: rgba(248,245,239,0.05); color: rgba(248,245,239,0.4); border: 1px solid rgba(248,245,239,0.1); }

.user-row-actions { flex-shrink: 0; }

.action-btn { padding: 0.375rem 0.75rem; font-family: 'Montserrat', sans-serif; font-size: 0.6rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; cursor: pointer; border: 1px solid; transition: all 0.2s; }
.promote-btn { background: rgba(76,175,80,0.1); border-color: rgba(76,175,80,0.3); color: #4caf50; }
.promote-btn:hover { background: rgba(76,175,80,0.2); }
.revoke-btn { background: rgba(224,123,90,0.1); border-color: rgba(224,123,90,0.3); color: #e07b5a; }
.revoke-btn:hover { background: rgba(224,123,90,0.2); }

@media (max-width: 768px) {
  .grant-row { flex-direction: column; }
  .user-row { flex-wrap: wrap; }
  .user-row-actions { width: 100%; display: flex; gap: 0.5rem; margin-top: 0.5rem; }
  .action-btn { flex: 1; text-align: center; }
}
</style>
