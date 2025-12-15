import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager, Firestore } from 'firebase/firestore'

// Firebase configuration
// Replace these with your Firebase project credentials from:
// Firebase Console > Project Settings > Your Apps > Web App
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
}

// Check if Firebase is configured
const hasEnvVars = !!import.meta.env.VITE_FIREBASE_API_KEY &&
    !!import.meta.env.VITE_FIREBASE_PROJECT_ID

let app: FirebaseApp
let auth: Auth
let db: Firestore
let isConfigured = false

if (hasEnvVars) {
    try {
        app = initializeApp(firebaseConfig)
        auth = getAuth(app)
        db = initializeFirestore(app, {
            localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
        })
        isConfigured = true
    } catch (error) {
        console.warn('Firebase initialization failed (probably invalid config). Falling back to demo mode.', error)
        isConfigured = false
    }
} else {
    console.warn('⚠️ Firebase not configured. Running in demo mode.')
    console.warn('To configure Firebase:')
    console.warn('1. Create a project at https://console.firebase.google.com')
    console.warn('2. Add a web app and copy the config')
    console.warn('3. Create .env file with VITE_FIREBASE_* variables')
}

export { app, auth, db }
export const isFirebaseConfigured = isConfigured
