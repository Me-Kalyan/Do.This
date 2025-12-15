import { useState } from 'react'
import { Calendar as CalendarIcon, Clock, Tag, Flag, Repeat } from 'lucide-react'
import { SmartInput } from '@/components/features'
import { Calendar } from '@/components/ui/calendar'
import { TimePicker } from '@/components/ui/time-picker'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useThemeStore } from '@/store/themeStore'
import { RecurrencePicker, RecurrenceConfig } from './RecurrencePicker'
import { ResponsiveModal } from '@/components/ui/responsive-modal'

interface AddTaskDialogProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (task: { title: string; category?: string; date?: Date; recurrence?: string }) => void
}

const categories = ['Work', 'Personal', 'Shopping', 'Health']

export function AddTaskDialog({ isOpen, onClose, onSubmit }: AddTaskDialogProps) {
    const { isDarkMode } = useThemeStore()
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(null)
    const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high' | null>(null)
    const [recurrenceConfig, setRecurrenceConfig] = useState<RecurrenceConfig>({ pattern: 'none' })
    const [isRecurrenceOpen, setIsRecurrenceOpen] = useState(false)

    const mapRecurrenceToString = (config: RecurrenceConfig): string => {
        if (config.pattern === 'daily' && (!config.interval || config.interval === 1)) return 'daily'
        if (config.pattern === 'weekly' && (!config.interval || config.interval === 1)) return 'weekly'
        if (config.pattern === 'biweekly') return 'biweekly' // Picker handles interval=2 logic internally for pattern 'biweekly'
        if (config.pattern === 'monthly') return 'monthly'
        if (config.pattern === 'weekdays') return 'weekdays'
        return 'none'
    }

    const handleSubmit = (parsedTask: any) => {
        onSubmit({
            ...parsedTask,
            date: selectedDate || parsedTask.date,
            time: selectedTime || parsedTask.time,
            priority: selectedPriority || parsedTask.priority,
            category: selectedCategory || parsedTask.project || undefined,
            recurrence: mapRecurrenceToString(recurrenceConfig) !== 'none' ? mapRecurrenceToString(recurrenceConfig) : undefined
        })

        setSelectedCategory(null)
        setSelectedDate(null)
        setSelectedTime(null)
        setSelectedPriority(null)
        setRecurrenceConfig({ pattern: 'none' })
        onClose()
    }

    const handleTimeChange = (time: string) => {
        setSelectedTime(time || null)
    }

    const togglePriority = () => {
        if (!selectedPriority) setSelectedPriority('low')
        else if (selectedPriority === 'low') setSelectedPriority('medium')
        else if (selectedPriority === 'medium') setSelectedPriority('high')
        else setSelectedPriority(null)
    }

    const getDateText = () => {
        if (!selectedDate) return 'Today'
        const today = new Date()
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)

        if (selectedDate.toDateString() === today.toDateString()) return 'Today'
        if (selectedDate.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
        return selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }

    const getTimeText = () => {
        if (!selectedTime) return 'Set time'
        const [h, m] = selectedTime.split(':')
        const hour = parseInt(h)
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 || 12
        return `${hour12}:${m} ${ampm}`
    }

    return (
        <ResponsiveModal
            open={isOpen}
            onOpenChange={(open) => !open && onClose()}
            title="New Task"
        >
            <div className={`space-y-6 pb-6 ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>
                {/* Input */}
                <div>
                    <SmartInput
                        onSubmit={handleSubmit}
                        placeholder="What needs to be done?"
                        autoFocus
                        className="text-lg"
                    />
                </div>

                {/* Actions / Metadata */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors whitespace-nowrap ${selectedDate
                                    ? isDarkMode
                                        ? 'bg-zinc-100 border-zinc-100 text-zinc-900'
                                        : 'bg-zinc-900 border-zinc-900 text-white'
                                    : isDarkMode
                                        ? 'border-zinc-600 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-700'
                                        : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                                    }`}
                            >
                                <CalendarIcon size={14} />
                                {getDateText()}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                selected={selectedDate || undefined}
                                onSelect={(date) => setSelectedDate(date || null)}
                            />
                        </PopoverContent>
                    </Popover>

                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors whitespace-nowrap ${selectedTime
                                    ? isDarkMode
                                        ? 'bg-zinc-100 border-zinc-100 text-zinc-900'
                                        : 'bg-zinc-900 border-zinc-900 text-white'
                                    : isDarkMode
                                        ? 'border-zinc-600 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-700'
                                        : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                                    }`}
                            >
                                <Clock size={14} />
                                {getTimeText()}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <TimePicker
                                value={selectedTime || undefined}
                                onChange={handleTimeChange}
                            />
                        </PopoverContent>
                    </Popover>

                    <Popover open={isRecurrenceOpen} onOpenChange={setIsRecurrenceOpen}>
                        <PopoverTrigger asChild>
                            <button
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors whitespace-nowrap ${recurrenceConfig.pattern !== 'none'
                                    ? isDarkMode
                                        ? 'bg-zinc-100 border-zinc-100 text-zinc-900'
                                        : 'bg-zinc-900 border-zinc-900 text-white'
                                    : isDarkMode
                                        ? 'border-zinc-600 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-700'
                                        : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                                    }`}
                            >
                                <Repeat size={14} />
                                {recurrenceConfig.pattern === 'none' ? 'Repeat' : recurrenceConfig.pattern.charAt(0).toUpperCase() + recurrenceConfig.pattern.slice(1)}
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-none bg-transparent shadow-none" align="start">
                            <RecurrencePicker
                                value={recurrenceConfig}
                                onChange={setRecurrenceConfig}
                                onClose={() => setIsRecurrenceOpen(false)}
                            />
                        </PopoverContent>
                    </Popover>

                    <button
                        onClick={togglePriority}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors whitespace-nowrap ${selectedPriority
                            ? isDarkMode
                                ? 'bg-zinc-100 border-zinc-100 text-zinc-900'
                                : 'bg-zinc-900 border-zinc-900 text-white'
                            : isDarkMode
                                ? 'border-zinc-600 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-700'
                                : 'border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50'
                            }`}
                    >
                        <Flag size={14} />
                        {selectedPriority ? selectedPriority.charAt(0).toUpperCase() + selectedPriority.slice(1) : 'Priority'}
                    </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                    <div className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'
                        }`}>
                        <Tag size={12} />
                        Category
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${selectedCategory === cat
                                    ? isDarkMode
                                        ? 'bg-zinc-100 text-zinc-900 shadow-md transform scale-105'
                                        : 'bg-zinc-900 text-white shadow-md transform scale-105'
                                    : isDarkMode
                                        ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Helper Text */}
                <div className={`pt-2 border-t ${isDarkMode ? 'border-zinc-700' : 'border-zinc-100'}`}>
                    <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        Press <kbd className={`font-sans px-1 py-0.5 rounded border ${isDarkMode
                            ? 'bg-zinc-700 border-zinc-600 text-zinc-400'
                            : 'bg-zinc-100 border-zinc-200 text-zinc-500'
                            }`}>Enter</kbd> to save
                    </p>
                </div>
            </div>
        </ResponsiveModal>
    )
}
