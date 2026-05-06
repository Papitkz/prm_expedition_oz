import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'

const OWNER_EMAIL = 'johnfritzizar35@gmail.com'

const user = ref<User | null>(null)
const loading = ref(true)
const isAdmin = ref(false)
const userRole = ref<'owner' | 'admin' | 'user' | null>(null)

export interface FirebaseUser {
  uid: string
  email: string
  displayName: string
  role: 'owner' | 'admin' | 'user'
  createdAt: any
  updatedAt: any
}

export function useAdminAuth() {
  const isLoggedIn = computed(() => !!user.value && isAdmin.value)
  const isOwner = computed(() => user.value?.email?.toLowerCase() === OWNER_EMAIL)

  async function resolveRole(currentUser: User) {
    const email = currentUser.email?.toLowerCase() || ''

    if (email === OWNER_EMAIL) {
      isAdmin.value = true
      userRole.value = 'owner'
      await ensureUserDoc(currentUser, 'owner')
      return
    }

    try {
      const db = getFirebaseDb()
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid))

      if (userDoc.exists()) {
        const data = userDoc.data()
        if (data.role === 'admin' || data.role === 'owner') {
          isAdmin.value = true
          userRole.value = data.role as 'owner' | 'admin'
          return
        }
      }
    } catch (e) {
      console.warn('Firebase unavailable, cannot verify admin role:', e)
    }

    isAdmin.value = false
    userRole.value = 'user'
  }

  async function ensureUserDoc(currentUser: User, role: string) {
    try {
      const db = getFirebaseDb()
      const userRef = doc(db, 'users', currentUser.uid)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: currentUser.uid,
          email: currentUser.email?.toLowerCase() || '',
          displayName: currentUser.displayName || '',
          role,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      } else if (userDoc.data().role !== role && role === 'owner') {
        await updateDoc(userRef, { role, updatedAt: serverTimestamp() })
      }
    } catch (e) {
      console.warn('Firebase unavailable, skipping user doc:', e)
    }
  }

  async function grantAdminAccess(targetEmail: string): Promise<boolean> {
    if (!isOwner.value) return false

    try {
      const db = getFirebaseDb()
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('email', '==', targetEmail.toLowerCase()))
      const snap = await getDocs(q)

      if (!snap.empty) {
        const userDoc = snap.docs[0]
        await updateDoc(doc(db, 'users', userDoc.id), {
          role: 'admin',
          updatedAt: serverTimestamp(),
        })
        return true
      }

      // Create pending grant for future signup
      await setDoc(doc(db, 'admin_grants', targetEmail.toLowerCase()), {
        email: targetEmail.toLowerCase(),
        grantedBy: user.value?.uid,
        role: 'admin',
        createdAt: serverTimestamp(),
      })
      return true
    } catch (e) {
      console.warn('Firebase unavailable, cannot grant admin:', e)
      return false
    }
  }

  async function revokeAdminAccess(targetEmail: string): Promise<boolean> {
    if (!isOwner.value) return false

    try {
      const db = getFirebaseDb()
      const usersRef = collection(db, 'users')
      const q = query(usersRef, where('email', '==', targetEmail.toLowerCase()))
      const snap = await getDocs(q)

      if (!snap.empty) {
        const userDoc = snap.docs[0]
        await updateDoc(doc(db, 'users', userDoc.id), {
          role: 'user',
          updatedAt: serverTimestamp(),
        })
      }
      return true
    } catch (e) {
      console.warn('Firebase unavailable, cannot revoke admin:', e)
      return false
    }
  }

  async function signInWithEmail(email: string, password: string) {
    const auth = getFirebaseAuth()
    const result = await signInWithEmailAndPassword(auth, email, password)
    user.value = result.user
    await resolveRole(result.user)
    return result.user
  }

  async function signUp(email: string, password: string, displayName: string) {
    const auth = getFirebaseAuth()
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const newUser = result.user

    const isOwnerSignup = newUser.email?.toLowerCase() === OWNER_EMAIL
    const role = isOwnerSignup ? 'owner' : 'user'

    // Create user doc
    const db = getFirebaseDb()
    await setDoc(doc(db, 'users', newUser.uid), {
      uid: newUser.uid,
      email: newUser.email?.toLowerCase() || '',
      displayName,
      role,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })

    let finalRole: 'owner' | 'admin' | 'user' = role

    // Check for pending admin grant
    if (!isOwnerSignup && newUser.email) {
      try {
        const grantDoc = await getDoc(doc(db, 'admin_grants', newUser.email.toLowerCase()))
        if (grantDoc.exists()) {
          await updateDoc(doc(db, 'users', newUser.uid), {
            role: 'admin',
            updatedAt: serverTimestamp(),
          })
          await deleteDoc(doc(db, 'admin_grants', newUser.email.toLowerCase()))
          finalRole = 'admin'
        }
      } catch {
        /* ignore */
      }
    }

    user.value = newUser
    isAdmin.value = finalRole === 'admin' || finalRole === 'owner'
    userRole.value = finalRole

    return newUser
  }

  async function signOut() {
    const auth = getFirebaseAuth()
    await firebaseSignOut(auth)
    user.value = null
    isAdmin.value = false
    userRole.value = null
  }

  // Get all users for admin management
  async function getAllUsers(): Promise<FirebaseUser[]> {
    try {
      const db = getFirebaseDb()
      const usersRef = collection(db, 'users')
      const q = query(usersRef, orderBy('createdAt', 'asc'))
      const snap = await getDocs(q)
      return snap.docs.map((d) => ({ ...d.data() } as FirebaseUser))
    } catch (e) {
      console.warn('Firebase unavailable, cannot load users:', e)
      return []
    }
  }

  // Update user role
  async function updateUserRole(uid: string, role: 'admin' | 'user'): Promise<boolean> {
    if (!isOwner.value) return false
    try {
      const db = getFirebaseDb()
      await updateDoc(doc(db, 'users', uid), {
        role,
        updatedAt: serverTimestamp(),
      })
      return true
    } catch (e) {
      console.warn('Firebase unavailable, cannot update role:', e)
      return false
    }
  }

  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    const auth = getFirebaseAuth()
    unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      user.value = firebaseUser
      if (firebaseUser) {
        await resolveRole(firebaseUser)
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
    signUp,
    signOut,
    grantAdminAccess,
    revokeAdminAccess,
    getAllUsers,
    updateUserRole,
  }
}
