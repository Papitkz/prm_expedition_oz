import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  getFirebaseAuth,
  getFirebaseDb,
  initFirebase,
  isFirebaseInitialized,
} from '@/lib/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  type User,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const user = ref<User | null>(null)
const loading = ref(true)
const isAdmin = ref(false)

// Initialize Firebase immediately on import
initFirebase()

export function useAdminAuth() {
  const isLoggedIn = computed(() => !!user.value && isAdmin.value)

  async function ensureAdminDoc(currentUser: User) {
    try {
      const db = getFirebaseDb()
      const ref = doc(db, 'admin_users', currentUser.uid)
      const snap = await getDoc(ref)

      if (!snap.exists()) {
        await setDoc(ref, {
          email: currentUser.email,
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || '',
          role: 'admin',
          createdAt: new Date().toISOString(),
        })
      }
    } catch (e) {
      console.warn('Firestore unavailable, skipping admin doc:', e)
    }
    isAdmin.value = true
  }

  async function signInWithEmail(email: string, password: string) {
    const auth = getFirebaseAuth()
    const cred = await signInWithEmailAndPassword(auth, email, password)
    user.value = cred.user
    await ensureAdminDoc(cred.user)
    return cred.user
  }

  async function signInWithGoogle() {
    const auth = getFirebaseAuth()
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    user.value = cred.user
    await ensureAdminDoc(cred.user)
    return cred.user
  }

  async function signUp(email: string, password: string, displayName: string) {
    const auth = getFirebaseAuth()
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })

    try {
      const db = getFirebaseDb()
      await setDoc(doc(db, 'admin_users', cred.user.uid), {
        email: cred.user.email,
        displayName,
        role: 'admin',
        createdAt: new Date().toISOString(),
      })
    } catch (e) {
      console.warn('Firestore unavailable, skipping admin doc on signup:', e)
    }

    user.value = cred.user
    isAdmin.value = true
    return cred.user
  }

  async function signOut() {
    const auth = getFirebaseAuth()
    await firebaseSignOut(auth)
    user.value = null
    isAdmin.value = false
  }

  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    const auth = getFirebaseAuth()
    unsubscribe = onAuthStateChanged(auth, async (u) => {
      user.value = u
      if (u) {
        await ensureAdminDoc(u)
      } else {
        isAdmin.value = false
      }
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
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut,
  }
}
