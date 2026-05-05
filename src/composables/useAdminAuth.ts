import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  getFirebaseAuth,
  initFirebase,
  isFirebaseInitialized,
  type FirebaseConfig,
} from '@/lib/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from 'firebase/auth'
import { getFirebaseDb } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const user = ref<User | null>(null)
const loading = ref(true)
const isAdmin = ref(false)
const firebaseReady = ref(false)

async function ensureFirebaseInit() {
  if (firebaseReady.value) return

  // Try loading config from localStorage (saved by admin settings)
  if (typeof window !== 'undefined' && window.localStorage) {
    const savedConfig = localStorage.getItem('firebase_config')
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig) as FirebaseConfig
        initFirebase(config)
        firebaseReady.value = true
      } catch { /* ignore */ }
    }
  }

  // If still not ready, try env vars
  if (!firebaseReady.value) {
    const envConfig: FirebaseConfig = {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
    }
    if (envConfig.apiKey) {
      initFirebase(envConfig)
      firebaseReady.value = true
    }
  }
}

export function useAdminAuth() {
  const isLoggedIn = computed(() => !!user.value && isAdmin.value)

  async function signInWithEmail(email: string, password: string) {
    await ensureFirebaseInit()
    const auth = getFirebaseAuth()
    const cred = await signInWithEmailAndPassword(auth, email, password)
    user.value = cred.user
    await checkAdminStatus(cred.user)
    return cred.user
  }

  async function signInWithGoogle() {
    await ensureFirebaseInit()
    const auth = getFirebaseAuth()
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    user.value = cred.user
    await checkAdminStatus(cred.user)
    return cred.user
  }

  async function signUp(email: string, password: string, displayName: string) {
    await ensureFirebaseInit()
    const auth = getFirebaseAuth()
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    // Update display name via Firebase Auth
    const { updateProfile } = await import('firebase/auth')
    await updateProfile(cred.user, { displayName })

    // Create admin user doc in Firestore
    const db = getFirebaseDb()
    await setDoc(doc(db, 'admin_users', cred.user.uid), {
      email: cred.user.email,
      displayName,
      role: 'admin',
      createdAt: new Date().toISOString(),
    })

    user.value = cred.user
    isAdmin.value = true
    return cred.user
  }

  async function signOut() {
    if (isFirebaseInitialized()) {
      const auth = getFirebaseAuth()
      await firebaseSignOut(auth)
    }
    user.value = null
    isAdmin.value = false
  }

  async function checkAdminStatus(currentUser: User | null) {
    if (!currentUser) {
      isAdmin.value = false
      return
    }
    try {
      const db = getFirebaseDb()
      const snap = await getDoc(doc(db, 'admin_users', currentUser.uid))
      isAdmin.value = snap.exists()
    } catch {
      isAdmin.value = false
    }
  }

  let unsubscribe: (() => void) | null = null

  onMounted(async () => {
    await ensureFirebaseInit()
    if (!isFirebaseInitialized()) {
      loading.value = false
      return
    }

    const auth = getFirebaseAuth()
    unsubscribe = onAuthStateChanged(auth, async (u) => {
      user.value = u
      if (u) await checkAdminStatus(u)
      else isAdmin.value = false
      loading.value = false
    })
  })

  onUnmounted(() => {
    unsubscribe?.()
  })

  return {
    user,
    loading,
    isAdmin,
    isLoggedIn,
    firebaseReady,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut,
    ensureFirebaseInit,
  }
}
