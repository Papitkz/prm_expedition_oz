import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyC7jSYOGy5_ZbeZCVkPC1rCZ_Z8abZuhy0',
  authDomain: 'expeditionoz.firebaseapp.com',
  projectId: 'expeditionoz',
  storageBucket: 'expeditionoz.firebasestorage.app',
  messagingSenderId: '161777857257',
  appId: '1:161777857257:web:526470afc6e3cf5b4cb678',
  measurementId: 'G-6SRTR4NTKD',
}

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null
let storage: FirebaseStorage | null = null

export function initFirebase() {
  if (!app) {
    app = initializeApp(FIREBASE_CONFIG)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)
  }
  return { app, auth, db, storage }
}

export function getFirebaseAuth(): Auth {
  if (!auth) initFirebase()
  return auth!
}

export function getFirebaseDb(): Firestore {
  if (!db) initFirebase()
  return db!
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) initFirebase()
  return storage!
}

export function getFirebaseApp(): FirebaseApp {
  if (!app) initFirebase()
  return app!
}

export function isFirebaseInitialized(): boolean {
  return app !== null
}
