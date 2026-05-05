import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

let app: FirebaseApp | null = null
let storage: FirebaseStorage | null = null

export interface FirebaseConfig {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

export function initFirebase(config: FirebaseConfig) {
  if (!app) {
    app = initializeApp(config)
    storage = getStorage(app)
  }
  return { app, storage }
}

export function getFirebaseStorage(): FirebaseStorage {
  if (!storage) {
    throw new Error('Firebase not initialized. Call initFirebase() first.')
  }
  return storage
}

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    throw new Error('Firebase not initialized. Call initFirebase() first.')
  }
  return app
}
