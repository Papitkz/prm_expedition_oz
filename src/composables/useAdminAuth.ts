import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  getFirebaseAuth,
  getFirebaseDb,
  initFirebase,
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
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

const OWNER_EMAIL = 'johnfritzizar35@gmail.com'

const user = ref<User | null>(null)
const loading = ref(true)
const isAdmin = ref(false)
const userRole = ref<'owner' | 'admin' | 'user' | null>(null)

initFirebase()

export function useAdminAuth() {
  const isLoggedIn = computed(() => !!user.value && isAdmin.value)
  const isOwner = computed(() => user.value?.email === OWNER_EMAIL)

  async function resolveRole(currentUser: User) {
    const email = currentUser.email?.toLowerCase() || ''

    // Owner gets admin access unconditionally
    if (email === OWNER_EMAIL) {
      isAdmin.value = true
      userRole.value = 'owner'
      await ensureUserDoc(currentUser, 'owner')
      return
    }

    // Check Firestore for admin role granted by owner
    try {
      const db = getFirebaseDb()
      const ref = doc(db, 'admin_users', currentUser.uid)
      const snap = await getDoc(ref)

      if (snap.exists()) {
        const data = snap.data()
        if (data.role === 'admin') {
          isAdmin.value = true
          userRole.value = 'admin'
          return
        }
      }
    } catch (e) {
      console.warn('Firestore unavailable, cannot verify admin role:', e)
    }

    // Regular user - no admin access
    isAdmin.value = false
    userRole.value = 'user'
  }

  async function ensureUserDoc(currentUser: User, role: string) {
    try {
      const db = getFirebaseDb()
      const ref = doc(db, 'admin_users', currentUser.uid)
      const snap = await getDoc(ref)

      if (!snap.exists()) {
        await setDoc(ref, {
          email: currentUser.email,
          displayName: currentUser.displayName || currentUser.email?.split('@')[0] || '',
          role,
          createdAt: new Date().toISOString(),
        })
      } else if (snap.data().role !== role) {
        await updateDoc(ref, { role })
      }
    } catch (e) {
      console.warn('Firestore unavailable, skipping user doc:', e)
    }
  }

  async function grantAdminAccess(targetEmail: string): Promise<boolean> {
    if (!isOwner.value) return false

    try {
      const db = getFirebaseDb()
      const snap = await getDoc(doc(db, 'admin_users_by_email', targetEmail))
      if (snap.exists()) {
        const data = snap.data()
        await updateDoc(doc(db, 'admin_users', data.uid), { role: 'admin' })
        return true
      }
      // User hasn't signed in yet, store pending grant
      await setDoc(doc(db, 'admin_grants', targetEmail), {
        grantedBy: user.value?.uid,
        grantedAt: new Date().toISOString(),
        role: 'admin',
      })
      return true
    } catch (e) {
      console.warn('Firestore unavailable, cannot grant admin:', e)
      return false
    }
  }

  async function revokeAdminAccess(targetEmail: string): Promise<boolean> {
    if (!isOwner.value) return false

    try {
      const db = getFirebaseDb()
      const snap = await getDoc(doc(db, 'admin_users_by_email', targetEmail))
      if (snap.exists()) {
        const data = snap.data()
        await updateDoc(doc(db, 'admin_users', data.uid), { role: 'user' })
      }
      return true
    } catch (e) {
      console.warn('Firestore unavailable, cannot revoke admin:', e)
      return false
    }
  }

  async function signInWithEmail(email: string, password: string) {
    const auth = getFirebaseAuth()
    const cred = await signInWithEmailAndPassword(auth, email, password)
    user.value = cred.user
    await resolveRole(cred.user)
    return cred.user
  }

  async function signInWithGoogle() {
    const auth = getFirebaseAuth()
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    user.value = cred.user
    await resolveRole(cred.user)
    return cred.user
  }

  async function signUp(email: string, password: string, displayName: string) {
    const auth = getFirebaseAuth()
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(cred.user, { displayName })

    // New signups are always regular users unless they're the owner
    const isOwnerSignup = cred.user.email?.toLowerCase() === OWNER_EMAIL
    const role = isOwnerSignup ? 'owner' : 'user'

    await ensureUserDoc(cred.user, role)

    // Check for pending admin grants
    if (!isOwnerSignup) {
      try {
        const db = getFirebaseDb()
        const grantSnap = await getDoc(doc(db, 'admin_grants', cred.user.email!))
        if (grantSnap.exists()) {
          await updateDoc(doc(db, 'admin_users', cred.user.uid), { role: 'admin' })
        }
      } catch { /* ignore */ }
    }

    user.value = cred.user
    isAdmin.value = isOwnerSignup
    userRole.value = isOwnerSignup ? 'owner' : 'user'
    return cred.user
  }

  async function signOut() {
    const auth = getFirebaseAuth()
    await firebaseSignOut(auth)
    user.value = null
    isAdmin.value = false
    userRole.value = null
  }

  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    const auth = getFirebaseAuth()
    unsubscribe = onAuthStateChanged(auth, async (u) => {
      user.value = u
      if (u) {
        await resolveRole(u)
      } else {
        isAdmin.value = false
        userRole.value = null
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
    isOwner,
    userRole,
    isLoggedIn,
    signInWithEmail,
    signInWithGoogle,
    signUp,
    signOut,
    grantAdminAccess,
    revokeAdminAccess,
  }
}
