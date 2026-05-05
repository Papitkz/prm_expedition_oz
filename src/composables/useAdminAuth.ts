import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

const user = ref<User | null>(null)
const session = ref<Session | null>(null)
const loading = ref(true)
const isAdmin = ref(false)

export function useAdminAuth() {
  const isLoggedIn = computed(() => !!user.value && isAdmin.value)

  async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    await checkAdminStatus(data.user)
    return data
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`,
      },
    })
    if (error) throw error
    return data
  }

  async function signUp(email: string, password: string, displayName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    if (error) throw error

    if (data.user) {
      await supabase.from('admin_users').insert({
        user_id: data.user.id,
        email: data.user.email,
        display_name: displayName,
        role: 'admin',
      })
    }
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    user.value = null
    session.value = null
    isAdmin.value = false
  }

  async function checkAdminStatus(currentUser: User | null) {
    if (!currentUser) {
      isAdmin.value = false
      return
    }
    const { data } = await supabase
      .from('admin_users')
      .select('id')
      .eq('user_id', currentUser.id)
      .maybeSingle()
    isAdmin.value = !!data
  }

  onMounted(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      session.value = s
      user.value = s?.user ?? null
      if (s?.user) checkAdminStatus(s.user)
      loading.value = false
    })

    supabase.auth.onAuthStateChange((_event, s) => {
      session.value = s
      user.value = s?.user ?? null
      if (s?.user) checkAdminStatus(s.user)
      else isAdmin.value = false
      loading.value = false
    })
  })

  return {
    user,
    session,
    loading,
    isAdmin,
    isLoggedIn,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut,
  }
}
