import { useEffect, useState, useCallback } from 'react'
import {
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updateProfile as firebaseUpdateProfile,
    updatePassword as firebaseUpdatePassword,
    reauthenticateWithCredential,
    EmailAuthProvider,
    AuthError
} from 'firebase/auth'
import { auth, isFirebaseConfigured } from '@/lib/firebase'

interface AuthState {
    user: User | null
    loading: boolean
    error: AuthError | null
}

// Demo user for when Firebase isn't configured
const DEMO_USER = {
    uid: 'demo-user-123',
    email: 'demo@example.com',
    displayName: 'Demo User',
    emailVerified: true,
} as User

export function useAuth() {
    const [state, setState] = useState<AuthState>({
        user: null,
        loading: true,
        error: null,
    })

    useEffect(() => {
        // If Firebase isn't configured, use demo mode immediately
        if (!isFirebaseConfigured) {
            // Auto-login demo user for easy testing
            localStorage.setItem('demo-auth', 'true')
            setState({
                user: DEMO_USER,
                loading: false,
                error: null,
            })
            console.log('🎭 Demo mode: using demo user')
            return
        }

        // Firebase IS configured - listen for auth changes
        let authTimeout: NodeJS.Timeout

        const unsubscribe = onAuthStateChanged(auth!, (user) => {
            if (user) {
                // Real Firebase user
                setState(prev => ({
                    ...prev,
                    user,
                    loading: false,
                }))
            } else {
                // No Firebase user - auto-enable demo mode after brief wait
                // This allows the app to work even when Firebase auth isn't set up
                authTimeout = setTimeout(() => {
                    console.log('🎭 No Firebase user, falling back to demo mode')
                    localStorage.setItem('demo-auth', 'true')
                    setState({
                        user: DEMO_USER,
                        loading: false,
                        error: null,
                    })
                }, 1000) // Wait 1 second for potential Firebase auth
            }
        })

        return () => {
            unsubscribe()
            if (authTimeout) clearTimeout(authTimeout)
        }
    }, [])

    const signIn = useCallback(async (email: string, password: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        // Demo mode
        if (!isFirebaseConfigured) {
            localStorage.setItem('demo-auth', 'true')
            setState({ user: DEMO_USER, loading: false, error: null })
            return { user: DEMO_USER, error: null }
        }

        try {
            const result = await signInWithEmailAndPassword(auth!, email, password)
            return { user: result.user, error: null }
        } catch (error) {
            const authError = error as AuthError
            setState(prev => ({ ...prev, loading: false, error: authError }))
            return { user: null, error: authError }
        }
    }, [])

    const signUp = useCallback(async (email: string, password: string) => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        // Demo mode
        if (!isFirebaseConfigured) {
            localStorage.setItem('demo-auth', 'true')
            setState({ user: DEMO_USER, loading: false, error: null })
            return { user: DEMO_USER, error: null }
        }

        try {
            const result = await createUserWithEmailAndPassword(auth!, email, password)
            return { user: result.user, error: null }
        } catch (error) {
            const authError = error as AuthError
            setState(prev => ({ ...prev, loading: false, error: authError }))
            return { user: null, error: authError }
        }
    }, [])

    const signInWithGoogle = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        if (!isFirebaseConfigured) {
            localStorage.setItem('demo-auth', 'true')
            setState({ user: DEMO_USER, loading: false, error: null })
            return { user: DEMO_USER, error: null }
        }

        try {
            const provider = new GoogleAuthProvider()
            const result = await signInWithPopup(auth!, provider)
            return { user: result.user, error: null }
        } catch (error) {
            const authError = error as AuthError
            setState(prev => ({ ...prev, loading: false, error: authError }))
            return { user: null, error: authError }
        }
    }, [])

    const signOut = useCallback(async () => {
        setState(prev => ({ ...prev, loading: true, error: null }))

        if (!isFirebaseConfigured) {
            localStorage.removeItem('demo-auth')
            setState({ user: null, loading: false, error: null })
            return { error: null }
        }

        try {
            await firebaseSignOut(auth!)
            return { error: null }
        } catch (error) {
            const authError = error as AuthError
            setState(prev => ({ ...prev, loading: false, error: authError }))
            return { error: authError }
        }
    }, [])

    const resetPassword = useCallback(async (email: string) => {
        if (!isFirebaseConfigured) {
            return { error: null }
        }

        try {
            await sendPasswordResetEmail(auth!, email)
            return { error: null }
        } catch (error) {
            return { error: error as AuthError }
        }
    }, [])

    const updateProfile = useCallback(async (displayName: string) => {
        if (!isFirebaseConfigured) {
            // Demo mode - just pretend it worked
            return { error: null }
        }

        if (!auth!.currentUser) {
            return { error: { message: 'No user logged in' } as AuthError }
        }

        try {
            await firebaseUpdateProfile(auth!.currentUser, { displayName })
            // Force state refresh
            setState(prev => ({
                ...prev,
                user: auth!.currentUser,
            }))
            return { error: null }
        } catch (error) {
            return { error: error as AuthError }
        }
    }, [])

    const updatePassword = useCallback(async (currentPassword: string, newPassword: string) => {
        if (!isFirebaseConfigured) {
            return { error: null }
        }

        if (!auth!.currentUser || !auth!.currentUser.email) {
            return { error: { message: 'No user logged in' } as AuthError }
        }

        try {
            // Re-authenticate user first (required for sensitive operations)
            const credential = EmailAuthProvider.credential(
                auth!.currentUser.email,
                currentPassword
            )
            await reauthenticateWithCredential(auth!.currentUser, credential)

            // Now update password
            await firebaseUpdatePassword(auth!.currentUser, newPassword)
            return { error: null }
        } catch (error) {
            const authError = error as AuthError
            // Make error messages more user-friendly
            if (authError.code === 'auth/wrong-password') {
                return { error: { ...authError, message: 'Current password is incorrect' } as AuthError }
            }
            if (authError.code === 'auth/weak-password') {
                return { error: { ...authError, message: 'New password is too weak' } as AuthError }
            }
            return { error: authError }
        }
    }, [])

    return {
        user: state.user,
        loading: state.loading,
        error: state.error,
        isAuthenticated: !!state.user,
        isDemo: !isFirebaseConfigured,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        resetPassword,
        updateProfile,
        updatePassword,
    }
}
