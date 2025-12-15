import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useThemeStore } from '@/store/themeStore'
import { Mail, Lock, Chrome } from 'lucide-react'

function Auth() {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const { signIn, signUp, signInWithGoogle, loading, isDemo } = useAuth()
    const { isDarkMode } = useThemeStore()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Please fill in all fields')
            return
        }

        const result = mode === 'signin'
            ? await signIn(email, password)
            : await signUp(email, password)

        if (result.error) {
            setError(result.error.message || 'An error occurred')
        } else {
            navigate('/')
        }
    }

    const handleGoogleSignIn = async () => {
        setError('')
        const result = await signInWithGoogle()
        if (result.error) {
            setError(result.error.message || 'Google sign-in failed')
        } else {
            navigate('/')
        }
    }

    return (
        <div className={`min-h-screen flex items-center justify-center px-6 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
            }`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                {/* Logo */}
                <h1 className="text-3xl font-bold tracking-tight text-center mb-2">
                    Do<span className="text-red-500">.</span>This
                </h1>
                <p className={`text-sm text-center mb-8 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {mode === 'signin' ? 'Sign in to continue' : 'Create your account'}
                </p>

                {/* Demo Mode Banner */}
                {isDemo && (
                    <div className={`mb-6 p-3 rounded-lg text-sm text-center ${isDarkMode ? 'bg-amber-900/30 text-amber-300' : 'bg-amber-50 text-amber-700'
                        }`}>
                        🎮 Demo Mode - No Firebase configured
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <Mail size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'
                            }`} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 ${isDarkMode
                                ? 'bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 focus:ring-zinc-600'
                                : 'bg-zinc-100 border-zinc-200 placeholder:text-zinc-400 focus:ring-zinc-300'
                                }`}
                        />
                    </div>

                    <div className="relative">
                        <Lock size={18} className={`absolute left-4 top-1/2 -translate-y-1/2 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'
                            }`} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full pl-11 pr-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 ${isDarkMode
                                ? 'bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 focus:ring-zinc-600'
                                : 'bg-zinc-100 border-zinc-200 placeholder:text-zinc-400 focus:ring-zinc-300'
                                }`}
                        />
                    </div>

                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-500 text-center"
                        >
                            {error}
                        </motion.p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors ${isDarkMode
                            ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                            : 'bg-zinc-900 text-white hover:bg-zinc-800'
                            }`}
                    >
                        {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center gap-4 my-6">
                    <div className={`flex-1 h-px ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`} />
                    <span className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>or</span>
                    <div className={`flex-1 h-px ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`} />
                </div>

                {/* Google Sign In */}
                <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors ${isDarkMode
                        ? 'bg-zinc-800 hover:bg-zinc-700 border border-zinc-700'
                        : 'bg-white hover:bg-zinc-50 border border-zinc-200'
                        }`}
                >
                    <Chrome size={18} />
                    Continue with Google
                </button>

                <div className="mt-6 text-center">
                    <span className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
                    </span>
                    <button
                        onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                        className={`text-sm font-medium hover:underline ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}
                    >
                        {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                    </button>
                </div>

                <button
                    onClick={() => navigate('/')}
                    className={`w-full mt-4 py-3 text-sm transition-colors ${isDarkMode ? 'text-zinc-400 hover:text-zinc-100' : 'text-zinc-500 hover:text-zinc-900'
                        }`}
                >
                    Continue as Guest
                </button>
            </motion.div>
        </div>
    )
}

export default Auth
