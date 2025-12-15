import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft,
    User,
    Bell,
    Shield,
    HelpCircle,
    LogOut,
    ChevronRight,
    Moon,
    Sun,
    Globe,
    Clock,
    Volume2,
    Vibrate,
    Mail,
    Lock,
    Trash2,
    Download,
    Info,
    X,
    Check,
    ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/store/themeStore'
import { useAuth } from '@/hooks/useAuth'
import { useTasks } from '@/hooks/useTasks'

interface SettingItem {
    icon: React.ElementType
    label: string
    description?: string
    action?: () => void
    toggle?: boolean
    value?: boolean
    badge?: string
}

interface SettingSection {
    title: string
    items: SettingItem[]
}

function Settings() {
    const navigate = useNavigate()
    const { isDarkMode, toggleDarkMode } = useThemeStore()
    const { user, signOut, updateProfile, updatePassword: authUpdatePassword } = useAuth()
    const { tasks } = useTasks()
    const [notifications, setNotifications] = useState(true)
    const [sounds, setSounds] = useState(true)
    const [haptics, setHaptics] = useState(true)

    // Modal states
    const [showPrivacyModal, setShowPrivacyModal] = useState(false)
    const [showExportModal, setShowExportModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showHelpModal, setShowHelpModal] = useState(false)
    const [showAboutModal, setShowAboutModal] = useState(false)
    const [showProfileModal, setShowProfileModal] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [isExporting, setIsExporting] = useState(false)
    const [exportComplete, setExportComplete] = useState(false)

    // Profile form state
    const [profileName, setProfileName] = useState(user?.displayName || '')
    const [profileSaving, setProfileSaving] = useState(false)

    // Password form state
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [passwordSaving, setPasswordSaving] = useState(false)

    // Privacy settings state
    const [privacySettings, setPrivacySettings] = useState({
        shareAnalytics: true,
        personalizedAds: false,
        activityTracking: true,
    })

    const handleExportData = async () => {
        setIsExporting(true)
        // Export actual tasks as JSON
        const dataStr = JSON.stringify(tasks, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'dothis-tasks-export.json'
        link.click()
        URL.revokeObjectURL(url)
        setIsExporting(false)
        setExportComplete(true)
        setTimeout(() => {
            setExportComplete(false)
            setShowExportModal(false)
        }, 1500)
    }

    const handleDeleteAccount = async () => {
        // In real app, this would call Firebase to delete user
        alert('Account deletion requested. This feature requires additional confirmation.')
        setShowDeleteModal(false)
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/auth')
    }

    const sections: SettingSection[] = [
        {
            title: 'Account',
            items: [
                { icon: User, label: 'Profile', description: user?.displayName || 'Set up your profile', action: () => setShowProfileModal(true) },
                { icon: Mail, label: 'Email', description: user?.email || 'Not signed in', action: () => { if (!user) navigate('/auth') } },
                { icon: Lock, label: 'Password', description: 'Change password', action: () => setShowPasswordModal(true) },
            ]
        },
        {
            title: 'Preferences',
            items: [
                { icon: isDarkMode ? Moon : Sun, label: 'Dark Mode', toggle: true, value: isDarkMode, action: toggleDarkMode },
                { icon: Globe, label: 'Language', description: 'English (US)' },
                { icon: Clock, label: 'Time Zone', description: 'Auto-detect' },
            ]
        },
        {
            title: 'Notifications',
            items: [
                { icon: Bell, label: 'Push Notifications', toggle: true, value: notifications, action: () => setNotifications(!notifications) },
                { icon: Volume2, label: 'Sounds', toggle: true, value: sounds, action: () => setSounds(!sounds) },
                { icon: Vibrate, label: 'Haptic Feedback', toggle: true, value: haptics, action: () => setHaptics(!haptics) },
            ]
        },
        {
            title: 'Privacy & Security',
            items: [
                { icon: Shield, label: 'Privacy Settings', description: 'Control your data', action: () => setShowPrivacyModal(true) },
                { icon: Download, label: 'Export Data', description: 'Download all your data', action: () => setShowExportModal(true) },
                { icon: Trash2, label: 'Delete Account', description: 'Permanently delete your account', action: () => setShowDeleteModal(true) },
            ]
        },
        {
            title: 'Support',
            items: [
                { icon: HelpCircle, label: 'Help Center', description: 'FAQs and guides', action: () => setShowHelpModal(true) },
                { icon: Info, label: 'About', description: 'Version 1.0.0', action: () => setShowAboutModal(true) },
            ]
        }
    ]

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: { opacity: 1, x: 0 }
    }

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95, y: 20 }
    }

    return (
        <div className={`min-h-screen pb-24 ${isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
            }`}>
            {/* Header */}
            <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-zinc-100'
                }`}>
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className={`p-2 -ml-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-600'
                            }`}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="font-semibold">Settings</h1>
                </div>
            </header>

            {/* Content */}
            <motion.div
                className="max-w-2xl mx-auto px-4 py-6 space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Profile Card */}
                <motion.div
                    className={`rounded-2xl p-6 shadow-sm border transition-colors duration-300 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-zinc-100'
                        }`}
                    variants={itemVariants}
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold ${isDarkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'
                            }`}>
                            {user?.displayName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || 'GU'}
                        </div>
                        <div className="flex-1">
                            <h2 className="font-semibold">{user?.displayName || 'Guest User'}</h2>
                            <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{user?.email || 'Not signed in'}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={handleSignOut}>
                            Sign Out
                        </Button>
                    </div>
                </motion.div>

                {/* Setting Sections */}
                {sections.map((section) => (
                    <motion.div
                        key={section.title}
                        className="space-y-2"
                        variants={itemVariants}
                    >
                        <h3 className={`text-xs font-medium uppercase tracking-wider px-1 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            {section.title}
                        </h3>
                        <div className={`rounded-xl shadow-sm border overflow-hidden divide-y transition-colors duration-300 ${isDarkMode ? 'bg-zinc-800 border-zinc-700 divide-zinc-700' : 'bg-white border-zinc-100 divide-zinc-100'
                            }`}>
                            {section.items.map((item, index) => {
                                const Icon = item.icon
                                return (
                                    <motion.button
                                        key={index}
                                        className={`w-full flex items-center gap-4 p-4 transition-colors text-left ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-50'
                                            }`}
                                        onClick={item.action}
                                        whileTap={{ scale: 0.995 }}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                                            }`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium">{item.label}</p>
                                            {item.description && (
                                                <p className={`text-sm truncate ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{item.description}</p>
                                            )}
                                        </div>
                                        {item.toggle ? (
                                            <div
                                                className={`w-11 h-6 rounded-full transition-colors ${item.value
                                                    ? 'bg-red-500'
                                                    : (isDarkMode ? 'bg-zinc-600' : 'bg-zinc-200')
                                                    }`}
                                            >
                                                <motion.div
                                                    className="w-5 h-5 bg-white rounded-full shadow-sm mt-0.5"
                                                    animate={{ x: item.value ? 22 : 2 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            </div>
                                        ) : (
                                            <ChevronRight size={20} className="text-zinc-400" />
                                        )}
                                    </motion.button>
                                )
                            })}
                        </div>
                    </motion.div>
                ))}

                {/* Sign Out */}
                <motion.div variants={itemVariants}>
                    <Button
                        variant="ghost"
                        fullWidth
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => navigate('/auth')}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                    </Button>
                </motion.div>

                {/* Footer */}
                <motion.div
                    className="text-center pt-4"
                    variants={itemVariants}
                >
                    <p className="text-xs text-zinc-400">Do<span className="text-red-500">.</span>This v1.0.0</p>
                    <p className="text-xs text-zinc-400 mt-1">Made with ❤️ for productivity</p>
                </motion.div>
            </motion.div>

            {/* Privacy Settings Modal */}
            <AnimatePresence>
                {showPrivacyModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPrivacyModal(false)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={`fixed inset-x-4 top-1/4 rounded-2xl p-6 z-50 max-w-md mx-auto shadow-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-white'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">Privacy Settings</h3>
                                <button onClick={() => setShowPrivacyModal(false)} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}>
                                    <X size={20} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { key: 'shareAnalytics', label: 'Share Analytics', desc: 'Help us improve by sharing usage data' },
                                    { key: 'personalizedAds', label: 'Personalized Ads', desc: 'See ads relevant to your interests' },
                                    { key: 'activityTracking', label: 'Activity Tracking', desc: 'Track your productivity patterns' },
                                ].map((item) => (
                                    <div key={item.key} className={`flex items-center justify-between gap-4 p-3 rounded-xl ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-50'
                                        }`}>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium">{item.label}</p>
                                            <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{item.desc}</p>
                                        </div>
                                        <button
                                            onClick={() => setPrivacySettings(p => ({ ...p, [item.key]: !p[item.key as keyof typeof p] }))}
                                            className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors ${privacySettings[item.key as keyof typeof privacySettings]
                                                ? (isDarkMode ? 'bg-zinc-100' : 'bg-zinc-900')
                                                : (isDarkMode ? 'bg-zinc-600' : 'bg-zinc-300')
                                                }`}
                                        >
                                            <motion.div
                                                className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                                                animate={{ left: privacySettings[item.key as keyof typeof privacySettings] ? 22 : 2 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <Button fullWidth className="mt-6" onClick={() => setShowPrivacyModal(false)}>
                                Save Changes
                            </Button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Export Data Modal */}
            <AnimatePresence>
                {showExportModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isExporting && setShowExportModal(false)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={`fixed inset-x-4 top-1/4 rounded-2xl p-6 z-50 max-w-md mx-auto shadow-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-white'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Export Your Data</h3>
                                {!isExporting && (
                                    <button onClick={() => setShowExportModal(false)} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}>
                                        <X size={20} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                                    </button>
                                )}
                            </div>
                            <p className={`mb-6 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                Download all your tasks, notes, and settings in JSON format. This may take a few moments.
                            </p>
                            {exportComplete ? (
                                <div className="flex items-center justify-center gap-2 py-4 text-green-600">
                                    <Check size={24} />
                                    <span className="font-medium">Export Complete!</span>
                                </div>
                            ) : (
                                <Button
                                    fullWidth
                                    onClick={handleExportData}
                                    loading={isExporting}
                                >
                                    <Download className="mr-2 h-4 w-4" />
                                    {isExporting ? 'Exporting...' : 'Download Data'}
                                </Button>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Delete Account Modal */}
            <AnimatePresence>
                {showDeleteModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDeleteModal(false)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={`fixed inset-x-4 top-1/4 rounded-2xl p-6 z-50 max-w-md mx-auto shadow-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-white'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-red-500">Delete Account</h3>
                                <button onClick={() => setShowDeleteModal(false)} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}>
                                    <X size={20} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                                </button>
                            </div>
                            <div className={`border rounded-xl p-4 mb-6 ${isDarkMode ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'
                                }`}>
                                <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                                    <strong>Warning:</strong> This action cannot be undone. All your data, including tasks, notes, and settings will be permanently deleted.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" fullWidth onClick={() => setShowDeleteModal(false)}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="destructive"
                                    fullWidth
                                    onClick={handleDeleteAccount}
                                >
                                    Delete Forever
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Help Center Modal */}
            <AnimatePresence>
                {showHelpModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowHelpModal(false)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={`fixed inset-x-4 top-[15%] rounded-2xl p-6 z-50 max-w-md mx-auto shadow-xl max-h-[70vh] overflow-y-auto ${isDarkMode ? 'bg-zinc-800' : 'bg-white'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">Help Center</h3>
                                <button onClick={() => setShowHelpModal(false)} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}>
                                    <X size={20} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { q: 'How do I create a task?', a: 'Click the + button on the home screen or use the Quick Add feature.' },
                                    { q: 'How do I set reminders?', a: 'When creating or editing a task, tap on "Set time" to add a reminder.' },
                                    { q: 'Can I sync across devices?', a: 'Yes! Sign in with your account to sync tasks across all your devices.' },
                                    { q: 'How do I enable dark mode?', a: 'Go to Settings → Preferences → Dark Mode toggle.' },
                                    { q: 'How do I delete a task?', a: 'Swipe left on a task or open it and tap the delete button.' },
                                ].map((faq, i) => (
                                    <div key={i} className={`border-b pb-4 last:border-0 ${isDarkMode ? 'border-zinc-700' : 'border-zinc-100'}`}>
                                        <p className="font-medium mb-1">{faq.q}</p>
                                        <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>{faq.a}</p>
                                    </div>
                                ))}
                            </div>
                            <a
                                href="mailto:support@dothis.app"
                                className={`flex items-center justify-center gap-2 mt-6 p-3 rounded-xl transition-colors ${isDarkMode ? 'bg-zinc-700 text-zinc-200 hover:bg-zinc-600' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                                    }`}
                            >
                                <ExternalLink size={16} />
                                Contact Support
                            </a>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* About Modal */}
            <AnimatePresence>
                {showAboutModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAboutModal(false)}
                            className="fixed inset-0 bg-black/50 z-50"
                        />
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            className={`fixed inset-x-4 top-1/4 rounded-2xl p-6 z-50 max-w-md mx-auto shadow-xl text-center ${isDarkMode ? 'bg-zinc-800' : 'bg-white'
                                }`}
                        >
                            <button
                                onClick={() => setShowAboutModal(false)}
                                className={`absolute top-4 right-4 p-1 rounded-full ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}
                            >
                                <X size={20} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                            </button>

                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isDarkMode ? 'bg-zinc-100' : 'bg-zinc-900'
                                }`}>
                                <span className={`text-2xl font-bold ${isDarkMode ? 'text-zinc-900' : 'text-white'}`}>D</span>
                            </div>

                            <h3 className="text-xl font-bold mb-1">Do<span className="text-red-500">.</span>This</h3>
                            <p className={`mb-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Version 1.0.0</p>

                            <div className={`rounded-xl p-4 mb-4 text-left ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-50'
                                }`}>
                                <p className={`text-sm ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                    The intelligent life OS for tasks, memory, and daily flow.
                                    Calm productivity for modern minds.
                                </p>
                            </div>

                            <div className={`text-sm space-y-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                <p>© 2024 Do<span className="text-red-500">.</span>This</p>
                                <p>Made with ❤️ for productivity</p>
                            </div>

                            <div className={`flex gap-4 justify-center mt-4 text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                <a href="#" className={isDarkMode ? 'hover:text-zinc-300' : 'hover:text-zinc-600'}>Privacy Policy</a>
                                <a href="#" className={isDarkMode ? 'hover:text-zinc-300' : 'hover:text-zinc-600'}>Terms of Service</a>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Profile Modal */}
                {showProfileModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowProfileModal(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`fixed inset-x-4 top-1/4 z-50 max-w-md mx-auto rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-zinc-800' : 'bg-white'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">Edit Profile</h3>
                                <button onClick={() => setShowProfileModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className={`text-sm font-medium mb-1 block ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        value={profileName}
                                        onChange={(e) => setProfileName(e.target.value)}
                                        placeholder="Enter your name"
                                        className={`w-full px-4 py-3 rounded-xl outline-none transition-colors ${isDarkMode
                                            ? 'bg-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-600'
                                            : 'bg-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-200'
                                            }`}
                                    />
                                </div>

                                <div className={`p-3 rounded-xl text-sm ${isDarkMode ? 'bg-zinc-700/50 text-zinc-400' : 'bg-zinc-50 text-zinc-500'}`}>
                                    Email: {user?.email || 'Not set'}
                                </div>

                                <Button
                                    fullWidth
                                    disabled={profileSaving || !profileName.trim()}
                                    onClick={async () => {
                                        setProfileSaving(true)
                                        const result = await updateProfile(profileName)
                                        setProfileSaving(false)
                                        if (result.error) {
                                            alert('Error updating profile: ' + result.error.message)
                                        } else {
                                            setShowProfileModal(false)
                                        }
                                    }}
                                >
                                    {profileSaving ? 'Saving...' : 'Save Profile'}
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}

                {/* Password Modal */}
                {showPasswordModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowPasswordModal(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`fixed inset-x-4 top-[15%] z-50 max-w-md mx-auto rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-zinc-800' : 'bg-white'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold">Change Password</h3>
                                <button onClick={() => setShowPasswordModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}>
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className={`text-sm font-medium mb-1 block ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                        Current Password
                                    </label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                        className={`w-full px-4 py-3 rounded-xl outline-none transition-colors ${isDarkMode
                                            ? 'bg-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-600'
                                            : 'bg-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-200'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className={`text-sm font-medium mb-1 block ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className={`w-full px-4 py-3 rounded-xl outline-none transition-colors ${isDarkMode
                                            ? 'bg-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-600'
                                            : 'bg-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-200'
                                            }`}
                                    />
                                </div>

                                <div>
                                    <label className={`text-sm font-medium mb-1 block ${isDarkMode ? 'text-zinc-300' : 'text-zinc-700'}`}>
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm new password"
                                        className={`w-full px-4 py-3 rounded-xl outline-none transition-colors ${isDarkMode
                                            ? 'bg-zinc-700 placeholder:text-zinc-500 focus:ring-2 focus:ring-zinc-600'
                                            : 'bg-zinc-100 placeholder:text-zinc-400 focus:ring-2 focus:ring-zinc-200'
                                            }`}
                                    />
                                </div>

                                {passwordError && (
                                    <p className="text-sm text-red-500">{passwordError}</p>
                                )}

                                <Button
                                    fullWidth
                                    disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                                    onClick={async () => {
                                        if (newPassword !== confirmPassword) {
                                            setPasswordError('Passwords do not match')
                                            return
                                        }
                                        if (newPassword.length < 6) {
                                            setPasswordError('Password must be at least 6 characters')
                                            return
                                        }
                                        setPasswordError('')
                                        setPasswordSaving(true)
                                        const result = await authUpdatePassword(currentPassword, newPassword)
                                        setPasswordSaving(false)
                                        if (result.error) {
                                            setPasswordError(result.error.message || 'Failed to update password')
                                        } else {
                                            setShowPasswordModal(false)
                                            setCurrentPassword('')
                                            setNewPassword('')
                                            setConfirmPassword('')
                                        }
                                    }}
                                >
                                    {passwordSaving ? 'Updating...' : 'Update Password'}
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Settings
