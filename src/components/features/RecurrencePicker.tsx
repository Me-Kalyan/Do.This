import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Repeat, Sun, CalendarDays, CalendarRange, Calendar, Settings, ChevronLeft, Check, Clock, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/store/themeStore'

export type RecurrencePattern = 'none' | 'daily' | 'weekdays' | 'weekly' | 'biweekly' | 'monthly' | 'custom'

export interface RecurrenceConfig {
    pattern: RecurrencePattern
    interval?: number
    daysOfWeek?: number[] // 0-6 (Sunday-Saturday)
    dayOfMonth?: number
    endDate?: Date
    occurrences?: number
    time?: string // HH:mm format
}

interface RecurrencePickerProps {
    value: RecurrenceConfig
    onChange: (config: RecurrenceConfig) => void
    onClose?: () => void
    className?: string
}

const PATTERN_OPTIONS: { value: RecurrencePattern; label: string; description?: string; icon: LucideIcon }[] = [
    { value: 'none', label: 'Does not repeat', icon: Repeat },
    { value: 'daily', label: 'Daily', description: 'Every day', icon: Sun },
    { value: 'weekdays', label: 'Weekdays', description: 'Mon - Fri', icon: CalendarDays },
    { value: 'weekly', label: 'Weekly', description: 'Same day each week', icon: CalendarRange },
    { value: 'biweekly', label: 'Biweekly', description: 'Every 2 weeks', icon: Calendar },
    { value: 'monthly', label: 'Monthly', description: 'Same date each month', icon: Calendar },
    { value: 'custom', label: 'Custom...', icon: Settings },
]

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const TIME_PRESETS = ['06:00', '08:00', '09:00', '12:00', '17:00', '20:00']

export function RecurrencePicker({ value, onChange, onClose, className }: RecurrencePickerProps) {
    const { isDarkMode } = useThemeStore()
    const [showCustom, setShowCustom] = useState(value.pattern === 'custom')
    const [showTimePicker, setShowTimePicker] = useState(false)
    const [customInterval, setCustomInterval] = useState(value.interval || 1)
    const [customDays, setCustomDays] = useState<number[]>(value.daysOfWeek || [])
    const [selectedTime, setSelectedTime] = useState<string | null>(value.time || null)

    const handlePatternChange = (pattern: RecurrencePattern) => {
        if (pattern === 'custom') {
            setShowCustom(true)
            return
        }

        let config: RecurrenceConfig = { pattern, time: selectedTime || undefined }

        switch (pattern) {
            case 'daily':
                config.interval = 1
                break
            case 'weekdays':
                config.daysOfWeek = [1, 2, 3, 4, 5]
                break
            case 'weekly':
                config.interval = 1
                config.daysOfWeek = [new Date().getDay()]
                break
            case 'biweekly':
                config.interval = 2
                config.daysOfWeek = [new Date().getDay()]
                break
            case 'monthly':
                config.interval = 1
                config.dayOfMonth = new Date().getDate()
                break
        }

        onChange(config)
        onClose?.()
    }

    const handleCustomSave = () => {
        onChange({
            pattern: 'custom',
            interval: customInterval,
            daysOfWeek: customDays.length > 0 ? customDays : undefined,
            time: selectedTime || undefined,
        })
        onClose?.()
    }

    const handleTimeSelect = (time: string | null) => {
        setSelectedTime(time)
        setShowTimePicker(false)
    }

    const toggleDay = (day: number) => {
        setCustomDays(prev =>
            prev.includes(day)
                ? prev.filter(d => d !== day)
                : [...prev, day].sort()
        )
    }

    const formatTime = (time: string) => {
        const [h, m] = time.split(':')
        const hour = parseInt(h)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 || 12
        return `${hour12}:${m} ${ampm}`
    }

    return (
        <motion.div
            className={cn(
                "w-72 rounded-xl shadow-xl overflow-hidden ring-1",
                isDarkMode ? 'bg-zinc-800 ring-zinc-700' : 'bg-white ring-zinc-200',
                className
            )}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
        >
            <AnimatePresence mode="wait">
                {!showCustom && !showTimePicker ? (
                    <motion.div
                        key="patterns"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-2"
                    >
                        {/* Header */}
                        <div className={cn(
                            "px-3 py-2 text-xs font-medium uppercase tracking-wider",
                            isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                        )}>
                            Repeat
                        </div>

                        {/* Pattern Options */}
                        <div className="space-y-1">
                            {PATTERN_OPTIONS.map(option => {
                                const Icon = option.icon
                                const isSelected = value.pattern === option.value
                                return (
                                    <button
                                        key={option.value}
                                        onClick={() => handlePatternChange(option.value)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                                            isSelected
                                                ? isDarkMode
                                                    ? 'bg-zinc-100 text-zinc-900'
                                                    : 'bg-zinc-900 text-white'
                                                : isDarkMode
                                                    ? 'hover:bg-zinc-700 text-zinc-100'
                                                    : 'hover:bg-zinc-100 text-zinc-900'
                                        )}
                                    >
                                        <Icon size={18} className={isSelected ? '' : isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{option.label}</p>
                                            {option.description && (
                                                <p className={cn(
                                                    "text-xs",
                                                    isSelected
                                                        ? isDarkMode ? 'text-zinc-600' : 'text-zinc-400'
                                                        : isDarkMode ? 'text-zinc-500' : 'text-zinc-400'
                                                )}>
                                                    {option.description}
                                                </p>
                                            )}
                                        </div>
                                        {isSelected && <Check size={16} />}
                                    </button>
                                )
                            })}
                        </div>

                        {/* Time Section */}
                        <div className={cn(
                            "mt-2 pt-2 border-t",
                            isDarkMode ? 'border-zinc-700' : 'border-zinc-100'
                        )}>
                            <button
                                onClick={() => setShowTimePicker(true)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                                    isDarkMode ? 'hover:bg-zinc-700 text-zinc-100' : 'hover:bg-zinc-100 text-zinc-900'
                                )}
                            >
                                <Clock size={18} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">Time</p>
                                    <p className={cn("text-xs", isDarkMode ? 'text-zinc-500' : 'text-zinc-400')}>
                                        {selectedTime ? formatTime(selectedTime) : 'Set reminder time'}
                                    </p>
                                </div>
                                {selectedTime && (
                                    <span className={cn(
                                        "text-xs font-medium px-2 py-0.5 rounded-full",
                                        isDarkMode ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-100 text-zinc-600'
                                    )}>
                                        {formatTime(selectedTime)}
                                    </span>
                                )}
                            </button>
                        </div>
                    </motion.div>
                ) : showTimePicker ? (
                    <motion.div
                        key="time"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-2"
                    >
                        {/* Back Button */}
                        <button
                            onClick={() => setShowTimePicker(false)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                                isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-900'
                            )}
                        >
                            <ChevronLeft size={16} />
                            Back
                        </button>

                        {/* Header */}
                        <div className={cn(
                            "px-3 py-2 text-xs font-medium uppercase tracking-wider",
                            isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                        )}>
                            Select Time
                        </div>

                        {/* Time Presets Grid */}
                        <div className="grid grid-cols-3 gap-2 px-2 pb-2">
                            {TIME_PRESETS.map(time => (
                                <Button
                                    key={time}
                                    variant={selectedTime === time ? 'default' : 'outline'}
                                    size="sm"
                                    className="h-10 text-xs"
                                    onClick={() => handleTimeSelect(time)}
                                >
                                    {formatTime(time)}
                                </Button>
                            ))}
                        </div>

                        {/* Clear Time */}
                        <div className={cn("px-2 pt-2 border-t", isDarkMode ? 'border-zinc-700' : 'border-zinc-100')}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="w-full text-zinc-500"
                                onClick={() => handleTimeSelect(null)}
                            >
                                No specific time
                            </Button>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="custom"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="p-2"
                    >
                        {/* Back Button */}
                        <button
                            onClick={() => setShowCustom(false)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                                isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-900'
                            )}
                        >
                            <ChevronLeft size={16} />
                            Back
                        </button>

                        {/* Header */}
                        <div className={cn(
                            "px-3 py-2 text-xs font-medium uppercase tracking-wider",
                            isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                        )}>
                            Custom Recurrence
                        </div>

                        {/* Interval */}
                        <div className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-lg mx-2",
                            isDarkMode ? 'bg-zinc-700' : 'bg-zinc-100'
                        )}>
                            <span className="text-sm">Every</span>
                            <input
                                type="number"
                                min="1"
                                max="365"
                                value={customInterval}
                                onChange={e => setCustomInterval(parseInt(e.target.value) || 1)}
                                className={cn(
                                    "w-16 px-2 py-1 rounded-md text-center text-sm font-medium focus:outline-none focus:ring-2",
                                    isDarkMode
                                        ? 'bg-zinc-800 text-zinc-100 focus:ring-zinc-600'
                                        : 'bg-white text-zinc-900 focus:ring-zinc-300'
                                )}
                            />
                            <span className="text-sm">day(s)</span>
                        </div>

                        {/* Days */}
                        <div className="px-3 py-3">
                            <p className={cn(
                                "text-xs font-medium uppercase tracking-wider mb-2",
                                isDarkMode ? 'text-zinc-400' : 'text-zinc-500'
                            )}>
                                On these days
                            </p>
                            <div className="flex gap-1.5">
                                {DAYS.map((day, index) => (
                                    <button
                                        key={day}
                                        onClick={() => toggleDay(index)}
                                        className={cn(
                                            "flex-1 py-2 rounded-lg text-xs font-medium transition-colors",
                                            customDays.includes(index)
                                                ? isDarkMode
                                                    ? 'bg-zinc-100 text-zinc-900'
                                                    : 'bg-zinc-900 text-white'
                                                : isDarkMode
                                                    ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                                                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                        )}
                                    >
                                        {day.charAt(0)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Save Button */}
                        <div className="px-2 pb-2">
                            <Button
                                className="w-full"
                                onClick={handleCustomSave}
                            >
                                Save Custom
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// Helper to get human-readable recurrence description
export function getRecurrenceDescription(config: RecurrenceConfig): string {
    let desc = ''
    switch (config.pattern) {
        case 'none':
            return 'Does not repeat'
        case 'daily':
            desc = 'Every day'
            break
        case 'weekdays':
            desc = 'Every weekday'
            break
        case 'weekly':
            desc = 'Every week'
            break
        case 'biweekly':
            desc = 'Every 2 weeks'
            break
        case 'monthly':
            desc = `Every month on day ${config.dayOfMonth || 1}`
            break
        case 'custom':
            if (config.interval && config.interval > 1) {
                desc = `Every ${config.interval} days`
            } else if (config.daysOfWeek && config.daysOfWeek.length > 0) {
                desc = `On ${config.daysOfWeek.map(d => DAYS[d]).join(', ')}`
            } else {
                desc = 'Custom schedule'
            }
            break
        default:
            return 'Unknown'
    }

    if (config.time) {
        const [h, m] = config.time.split(':')
        const hour = parseInt(h)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 || 12
        desc += ` at ${hour12}:${m} ${ampm}`
    }

    return desc
}

// Helper to calculate next occurrence
export function getNextOccurrence(config: RecurrenceConfig, from: Date = new Date()): Date | null {
    if (config.pattern === 'none') return null

    const next = new Date(from)
    next.setHours(0, 0, 0, 0)

    switch (config.pattern) {
        case 'daily':
            next.setDate(next.getDate() + (config.interval || 1))
            break
        case 'weekdays':
            do {
                next.setDate(next.getDate() + 1)
            } while (next.getDay() === 0 || next.getDay() === 6)
            break
        case 'weekly':
        case 'biweekly':
            next.setDate(next.getDate() + (config.interval === 2 ? 14 : 7))
            break
        case 'monthly':
            next.setMonth(next.getMonth() + 1)
            if (config.dayOfMonth) {
                next.setDate(config.dayOfMonth)
            }
            break
        case 'custom':
            if (config.interval) {
                next.setDate(next.getDate() + config.interval)
            }
            break
    }

    // Apply time if set
    if (config.time) {
        const [h, m] = config.time.split(':').map(Number)
        next.setHours(h, m, 0, 0)
    }

    // Check end conditions
    if (config.endDate && next > config.endDate) return null

    return next
}

export default RecurrencePicker
