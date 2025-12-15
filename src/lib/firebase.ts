import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

// Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
}

// Check if real Firebase keys are configured
const hasEnvVars = !!import.meta.env.VITE_FIREBASE_API_KEY &&
    !!import.meta.env.VITE_FIREBASE_PROJECT_ID

let app: FirebaseApp | undefined
let auth: Auth | undefined
let db: Firestore | undefined
let isConfigured = false

if (hasEnvVars) {
    try {
        app = initializeApp(firebaseConfig)
        auth = getAuth(app)
        db = getFirestore(app) // Simpler init without persistence for now
        isConfigured = true
        console.log('✅ Firebase initialized successfully')
    } catch (error) {
        console.error('❌ Firebase initialization failed:', error)
        isConfigured = false
    }
} else {
    console.warn('⚠️ Firebase not configured. Running in demo mode.')
}

export { app, auth, db }
export const isFirebaseConfigured = isConfigured
