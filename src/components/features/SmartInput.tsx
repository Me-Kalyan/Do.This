import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { parseNaturalLanguage, getSmartInputPlaceholders, ParsedTask } from '@/utils/naturalLanguageParser'
import { Command, Calendar, Clock, Flag, Timer, Hash, Repeat, ArrowUp, X } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

interface SmartInputProps {
    onSubmit: (task: ParsedTask) => void
    placeholder?: string
    autoFocus?: boolean
    className?: string
}

export function SmartInput({
    onSubmit,
    placeholder,
    autoFocus = false,
    className = '',
}: SmartInputProps) {
    const { isDarkMode } = useThemeStore()
    const [value, setValue] = useState('')
    const [preview, setPreview] = useState<ParsedTask | null>(null)
    const [placeholderIndex, setPlaceholderIndex] = useState(0)
    const [showPreview, setShowPreview] = useState(false)
    const [previewDismissed, setPreviewDismissed] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const placeholders = getSmartInputPlaceholders()
    const currentPlaceholder = placeholder || placeholders[placeholderIndex]

    // Rotate placeholders
    useEffect(() => {
        if (placeholder) return
        const interval = setInterval(() => {
            setPlaceholderIndex(i => (i + 1) % placeholders.length)
        }, 4000)
        return () => clearInterval(interval)
    }, [placeholder, placeholders.length])

    // Parse input as user types
    useEffect(() => {
        if (value.length > 3) {
            const result = parseNaturalLanguage(value)
            setPreview(result.task)
            if (!previewDismissed) {
                setShowPreview(true)
            }
        } else {
            setPreview(null)
            setShowPreview(false)
            setPreviewDismissed(false)
        }
    }, [value, previewDismissed])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!value.trim()) return

        const result = parseNaturalLanguage(value)
        if (result.success) {
            onSubmit(result.task)
            setValue('')
            setPreview(null)
            setShowPreview(false)
            setPreviewDismissed(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            if (showPreview) {
                setShowPreview(false)
                setPreviewDismissed(true)
            } else {
                setValue('')
                inputRef.current?.blur()
            }
        }
    }

    const formatDate = (date: Date) => {
        const today = new Date()
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)

        if (date.toDateString() === today.toDateString()) return 'Today'
        if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow'

        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        })
    }

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number)
        const period = hours >= 12 ? 'PM' : 'AM'
        const displayHours = hours % 12 || 12
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
    }

    return (
        <div className={`relative w-full ${className}`}>
            <form onSubmit={handleSubmit} className="relative z-20">
                <div className={`flex items-center gap-3 p-3 border rounded-xl transition-all shadow-sm ${isDarkMode
                    ? 'bg-zinc-700 border-zinc-600 focus-within:ring-2 focus-within:ring-zinc-500/20 focus-within:border-zinc-500'
                    : 'bg-zinc-50 border-zinc-200 focus-within:ring-2 focus-within:ring-zinc-900/5 focus-within:border-zinc-300'
                    }`}>
                    <Command size={18} className={isDarkMode ? 'text-zinc-400 flex-shrink-0' : 'text-zinc-400 flex-shrink-0'} />
                    <input
                        ref={inputRef}
                        type="text"
                        className={`flex-1 bg-transparent text-sm focus:outline-none ${isDarkMode
                            ? 'text-zinc-100 placeholder:text-zinc-500'
                            : 'text-zinc-900 placeholder:text-zinc-400'
                            }`}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={currentPlaceholder}
                        autoFocus={autoFocus}
                    />
                    <AnimatePresence>
                        {value && (
                            <motion.button
                                type="button"
                                onClick={() => {
                                    setValue('')
                                    setPreviewDismissed(false)
                                }}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className={`p-1 rounded-full transition-colors ${isDarkMode
                                    ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-600'
                                    : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-200'
                                    }`}
                            >
                                <X size={14} />
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <button
                        type="submit"
                        disabled={!value.trim()}
                        className={`p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${isDarkMode
                            ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                            : 'bg-zinc-900 text-white hover:bg-zinc-800'
                            }`}
                    >
                        <ArrowUp size={16} />
                    </button>
                </div>
            </form>

            {/* Smart Preview */}
            <AnimatePresence>
                {showPreview && preview && preview.title && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl p-4 z-10 overflow-hidden ${isDarkMode
                            ? 'bg-zinc-800 border-zinc-700'
                            : 'bg-white border-zinc-200'
                            }`}
                    >
                        <div className={`flex items-center justify-between mb-3 pb-3 border-b ${isDarkMode ? 'border-zinc-700' : 'border-zinc-100'
                            }`}>
                            <span className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'
                                }`}>Preview</span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    setShowPreview(false)
                                    setPreviewDismissed(true)
                                }}
                                className={`p-1 -mr-1 rounded-md transition-colors ${isDarkMode
                                    ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700'
                                    : 'text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100'
                                    }`}
                            >
                                <X size={14} />
                            </button>
                        </div>

                        <div className="mb-3">
                            <h4 className="text-base font-medium mb-2">{preview.title}</h4>

                            <div className="flex flex-wrap gap-2">
                                {preview.date && (
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        <Calendar size={12} />
                                        {formatDate(preview.date)}
                                    </span>
                                )}
                                {preview.time && (
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${isDarkMode ? 'bg-teal-900/50 text-teal-300' : 'bg-teal-50 text-teal-600'
                                        }`}>
                                        <Clock size={12} />
                                        {formatTime(preview.time)}
                                    </span>
                                )}
                                {preview.priority && (
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${preview.priority === 'high'
                                        ? isDarkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-50 text-red-600'
                                        : preview.priority === 'medium'
                                            ? isDarkMode ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-50 text-orange-600'
                                            : isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-50 text-green-600'
                                        }`}>
                                        <Flag size={12} />
                                        {preview.priority}
                                    </span>
                                )}
                                {preview.duration && (
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${isDarkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'
                                        }`}>
                                        <Timer size={12} />
                                        {preview.duration}m
                                    </span>
                                )}
                                {preview.project && (
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-50 text-purple-600'
                                        }`}>
                                        <Hash size={12} />
                                        {preview.project}
                                    </span>
                                )}
                                {preview.recurrence && (
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${isDarkMode ? 'bg-orange-900/50 text-orange-300' : 'bg-orange-50 text-orange-600'
                                        }`}>
                                        <Repeat size={12} />
                                        {preview.recurrence}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="pt-2 text-center">
                            <span className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>Press Enter to create</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default SmartInput
