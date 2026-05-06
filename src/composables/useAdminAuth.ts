import { ref, computed, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'

const OWNER_EMAIL = 'johnfritzizar35@gmail.com'

const user = ref<User | null>(null)
const loading = ref(true)
const isAdmin = ref(false)
const userRole = ref<'owner' | 'admin' | 'user' | null>(null)

export function useAdminAuth() {
  const isLoggedIn = computed(() => !!user.value && isAdmin.value)
  const isOwner = computed(() => user.value?.email === OWNER_EMAIL)

  async function resolveRole(currentUser: User) {
    const email = currentUser.email?.toLowerCase() || ''

    if (email === OWNER_EMAIL) {
      isAdmin.value = true
      userRole.value = 'owner'
      await ensureUserDoc(currentUser, 'owner')
      return
    }

    try {
      const { data } = await supabase
        .from('admin_users')
        .select('role')
        .eq('uid', currentUser.id)
        .maybeSingle()

      if (data && (data.role === 'admin' || data.role === 'owner')) {
        isAdmin.value = true
        userRole.value = data.role as 'owner' | 'admin'
        return
      }
    } catch (e) {
      console.warn('Supabase unavailable, cannot verify admin role:', e)
    }

    isAdmin.value = false
    userRole.value = 'user'
  }

async function ensureUserDoc(currentUser: User, role: string) {
  try {
    const { data: existing } = await supabase
      .from('admin_users')
      .select('id, role')
      .eq('uid', currentUser.id)
      .maybeSingle()

    if (!existing) {
      // Trigger should have created it, but if not (e.g. old user before trigger),
      // we can't insert due to RLS. Log warning.
      console.warn('admin_users row missing for user:', currentUser.id)
      return
    }

    if (existing.role !== role) {
      await supabase
        .from('admin_users')
        .update({ role })
        .eq('uid', currentUser.id)
    }
  } catch (e) {
    console.warn('Supabase unavailable, skipping user doc:', e)
  }
}

  async function grantAdminAccess(targetEmail: string): Promise<boolean> {
    if (!isOwner.value) return false

    try {
      const { data: existingUser } = await supabase
        .from('admin_users')
        .select('uid')
        .eq('email', targetEmail.toLowerCase())
        .maybeSingle()

      if (existingUser) {
        await supabase
          .from('admin_users')
          .update({ role: 'admin' })
          .eq('uid', existingUser.uid)
        return true
      }

      await supabase.from('admin_grants').insert({
        email: targetEmail.toLowerCase(),
        granted_by: user.value?.id,
        role: 'admin',
      })
      return true
    } catch (e) {
      console.warn('Supabase unavailable, cannot grant admin:', e)
      return false
    }
  }

  async function revokeAdminAccess(targetEmail: string): Promise<boolean> {
    if (!isOwner.value) return false

    try {
      const { data: existingUser } = await supabase
        .from('admin_users')
        .select('uid')
        .eq('email', targetEmail.toLowerCase())
        .maybeSingle()

      if (existingUser) {
        await supabase
          .from('admin_users')
          .update({ role: 'user' })
          .eq('uid', existingUser.uid)
      }
      return true
    } catch (e) {
      console.warn('Supabase unavailable, cannot revoke admin:', e)
      return false
    }
  }

  async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    user.value = data.user
    await resolveRole(data.user)
    return data.user
  }

async function signUp(email: string, password: string, displayName: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { display_name: displayName } },
  })
  if (error) throw error

  const newUser = data.user!
  const isOwnerSignup = newUser.email?.toLowerCase() === OWNER_EMAIL
  const role = isOwnerSignup ? 'owner' : 'user'

  // 1. Ensure user doc exists first
  await ensureUserDoc(newUser, role)

  let finalRole: 'owner' | 'admin' | 'user' = role

  // 2. Check if they were pre-approved in admin_grants
  if (!isOwnerSignup && newUser.email) {
    try {
      const { data: grant } = await supabase
        .from('admin_grants')
        .select('role')
        .eq('email', newUser.email.toLowerCase())
        .maybeSingle()

      if (grant) {
        // Upgrade them to admin immediately
        await supabase
          .from('admin_users')
          .update({ role: grant.role })
          .eq('uid', newUser.id)
        
        await supabase
          .from('admin_grants')
          .delete()
          .eq('email', newUser.email.toLowerCase())
        
        finalRole = grant.role as 'admin'
      }
    } catch { /* ignore */ }
  }

  // 3. NOW set reactive state with the CORRECT role
  user.value = newUser
  isAdmin.value = finalRole === 'admin' || finalRole === 'owner'
  userRole.value = finalRole

  return newUser
}

  async function signOut() {
    await supabase.auth.signOut()
    user.value = null
    isAdmin.value = false
    userRole.value = null
  }

  let authSubscription: { subscription: { unsubscribe: () => void } } | null = null

  onMounted(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
      user.value = session?.user ?? null
      if (session?.user) {
        await resolveRole(session.user)
      } else {
        isAdmin.value = false
        userRole.value = null
      }
      loading.value = false
    })
    authSubscription = data
  })

  onUnmounted(() => {
    authSubscription?.subscription.unsubscribe()
  })

  return {
    user,
    loading,
    isAdmin,
    isOwner,
    userRole,
    isLoggedIn,
    signInWithEmail,
    signUp,
    signOut,
    grantAdminAccess,
    revokeAdminAccess,
  }
}
