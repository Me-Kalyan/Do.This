import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface Suggestion {
    id: string
    type: 'task' | 'schedule' | 'insight' | 'reminder'
    title: string
    description: string
    action?: string
    dismissed?: boolean
}

interface AISuggestionsProps {
    suggestions: Suggestion[]
    onAccept?: (id: string) => void
    onDismiss?: (id: string) => void
}

const typeIcons: Record<string, JSX.Element> = {
    task: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M12 5v14M5 12h14" />
        </svg>
    ),
    schedule: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
        </svg>
    ),
    insight: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.9V17h8v-2.1A7 7 0 0 0 12 2z" />
        </svg>
    ),
    reminder: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
    ),
}

function AISuggestions({ suggestions, onAccept, onDismiss }: AISuggestionsProps) {
    const [localSuggestions, setLocalSuggestions] = useState(suggestions)

    const visibleSuggestions = localSuggestions.filter(s => !s.dismissed)

    const handleDismiss = (id: string) => {
        setLocalSuggestions(prev =>
            prev.map(s => (s.id === id ? { ...s, dismissed: true } : s))
        )
        onDismiss?.(id)
    }

    const handleAccept = (id: string) => {
        setLocalSuggestions(prev =>
            prev.map(s => (s.id === id ? { ...s, dismissed: true } : s))
        )
        onAccept?.(id)
    }

    if (visibleSuggestions.length === 0) return null

    return (
        <div className="ai-suggestions">
            <div className="ai-suggestions-header">
                <div className="ai-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                </div>
                <span className="text-caption">AI Suggestions</span>
            </div>

            <AnimatePresence>
                {visibleSuggestions.map((suggestion) => (
                    <motion.div
                        key={suggestion.id}
                        className={`suggestion-card type-${suggestion.type}`}
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 12 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.24, ease: [0.33, 1, 0.68, 1] }}
                    >
                        <div className="suggestion-content">
                            <span className="suggestion-icon">{typeIcons[suggestion.type]}</span>
                            <div className="suggestion-text">
                                <h4 className="suggestion-title">{suggestion.title}</h4>
                                <p className="suggestion-description text-caption">{suggestion.description}</p>
                            </div>
                        </div>

                        <div className="suggestion-actions">
                            {suggestion.action && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => handleAccept(suggestion.id)}
                                >
                                    {suggestion.action}
                                </Button>
                            )}
                            <button
                                className="dismiss-btn"
                                onClick={() => handleDismiss(suggestion.id)}
                                aria-label="Dismiss"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    )
}

export default AISuggestions
