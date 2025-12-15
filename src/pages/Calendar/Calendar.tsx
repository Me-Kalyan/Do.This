import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus, Clock, Check } from 'lucide-react'
import { triggerHaptic } from '@/lib/haptic'
import { useThemeStore } from '@/store/themeStore'
import { useTasks } from '@/hooks/useTasks'
import { AddTaskDialog } from '@/components/features'

const hours = Array.from({ length: 14 }, (_, i) => i + 6) // 6am to 8pm

// Color palette for tasks based on priority
const priorityColors = {
    high: 'bg-red-100 border-red-400 dark:bg-red-900/30 dark:border-red-500',
    medium: 'bg-amber-100 border-amber-400 dark:bg-amber-900/30 dark:border-amber-500',
    low: 'bg-emerald-100 border-emerald-400 dark:bg-emerald-900/30 dark:border-emerald-500',
}

function Calendar() {
    const navigate = useNavigate()
    const { isDarkMode } = useThemeStore()
    const { tasks, addTask, completeTask, loading } = useTasks()
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [showAddTask, setShowAddTask] = useState(false)

    // Get tasks for the selected date
    const tasksForSelectedDate = useMemo(() => {
        return tasks.filter(task => {
            if (!task.dueDate) return false
            return task.dueDate.toDateString() === selectedDate.toDateString()
        })
    }, [tasks, selectedDate])

    // Convert tasks to time blocks (using dueTime to determine start hour)
    const timeBlocks = useMemo(() => {
        return tasksForSelectedDate.map(task => {
            let startHour = 9 // Default to 9am
            if (task.dueTime) {
                const [hours, minutes] = task.dueTime.split(':').map(Number)
                startHour = hours + (minutes / 60)
            }
            return {
                id: task.id,
                title: task.title,
                start: startHour,
                duration: 1, // Default 1 hour
                completed: task.completed,
                priority: task.priority || 'medium',
            }
        })
    }, [tasksForSelectedDate])

    const getWeekDays = () => {
        const startOfWeek = new Date(selectedDate)
        startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay())
        return Array.from({ length: 7 }, (_, i) => {
            const date = new Date(startOfWeek)
            date.setDate(startOfWeek.getDate() + i)
            return date
        })
    }

    const weekDays = getWeekDays()
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const isToday = (date: Date) => date.toDateString() === new Date().toDateString()
    const isSelected = (date: Date) => date.toDateString() === selectedDate.toDateString()

    const formatHour = (hour: number) => {
        if (hour === 0) return '12am'
        if (hour < 12) return `${hour}am`
        if (hour === 12) return '12pm'
        return `${hour - 12}pm`
    }

    const navigateWeek = (direction: number) => {
        triggerHaptic('selection')
        const newDate = new Date(selectedDate)
        newDate.setDate(selectedDate.getDate() + (direction * 7))
        setSelectedDate(newDate)
    }

    const handleAddTask = async (taskData: { title: string }) => {
        await addTask({
            title: taskData.title,
            dueDate: selectedDate,
        })
        setShowAddTask(false)
    }

    const handleCompleteTask = async (taskId: string) => {
        triggerHaptic('success')
        await completeTask(taskId)
    }

    // Count tasks per day for the week
    const getTaskCountForDate = (date: Date) => {
        return tasks.filter(task =>
            task.dueDate && task.dueDate.toDateString() === date.toDateString()
        ).length
    }

    return (
        <div className={`min-h-screen pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
            }`}>
            {/* Header */}
            <header className={`sticky top-0 z-30 px-4 pt-4 pb-2 border-b transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900/95 backdrop-blur-xl border-zinc-800' : 'bg-white/95 backdrop-blur-xl border-zinc-200'
                }`}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => { triggerHaptic('light'); navigate(-1) }}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                                }`}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-lg font-semibold">Calendar</h1>
                            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => navigateWeek(-1)}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                                }`}
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => { triggerHaptic('light'); setSelectedDate(new Date()) }}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-200 hover:bg-zinc-300'
                                }`}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => navigateWeek(1)}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                                }`}
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>

                {/* Week Selector */}
                <div className="grid grid-cols-7 gap-1">
                    {weekDays.map((date, index) => {
                        const taskCount = getTaskCountForDate(date)
                        return (
                            <button
                                key={index}
                                onClick={() => { triggerHaptic('selection'); setSelectedDate(date) }}
                                className={`py-2 rounded-xl text-center transition-all relative ${isSelected(date)
                                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                                    : isToday(date)
                                        ? isDarkMode ? 'bg-zinc-800 ring-1 ring-zinc-600' : 'bg-zinc-200 ring-1 ring-zinc-400'
                                        : isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                                    }`}
                            >
                                <p className={`text-[10px] uppercase tracking-wider mb-0.5 ${isSelected(date) ? 'opacity-70' : isDarkMode ? 'text-zinc-500' : 'text-zinc-400'
                                    }`}>
                                    {dayNames[date.getDay()]}
                                </p>
                                <p className="text-sm font-medium">{date.getDate()}</p>
                                {taskCount > 0 && (
                                    <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isSelected(date) ? 'bg-white dark:bg-zinc-900' : 'bg-zinc-500'
                                        }`} />
                                )}
                            </button>
                        )
                    })}
                </div>
            </header>

            {/* Timeline */}
            <section className="px-2 py-2">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className={`animate-spin w-6 h-6 border-2 border-t-transparent rounded-full ${isDarkMode ? 'border-zinc-400' : 'border-zinc-600'
                            }`} />
                    </div>
                ) : (
                    <div className="relative">
                        {/* Current time indicator */}
                        {isToday(selectedDate) && (
                            <div
                                className="absolute left-14 right-0 z-20 flex items-center pointer-events-none"
                                style={{ top: `${((new Date().getHours() - 6) + new Date().getMinutes() / 60) * 80}px` }}
                            >
                                <div className="w-2.5 h-2.5 -ml-1.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-900" />
                                <div className="flex-1 h-0.5 bg-red-500" />
                            </div>
                        )}

                        {hours.map((hour) => (
                            <div key={hour} className={`flex h-20 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'
                                }`}>
                                {/* Time Label */}
                                <div className={`w-14 -mt-2.5 flex-shrink-0 text-right pr-4 select-none ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'
                                    }`}>
                                    <span className="text-xs font-medium">
                                        {formatHour(hour)}
                                    </span>
                                </div>

                                {/* Time Slot Content */}
                                <div className="flex-1 relative border-l border-dashed border-zinc-200 dark:border-zinc-800">
                                    {timeBlocks
                                        .filter(block => Math.floor(block.start) === hour)
                                        .map(block => (
                                            <motion.div
                                                key={block.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className={`absolute left-0 right-1 rounded-lg p-2 border-l-4 cursor-pointer overflow-hidden transition-all hover:brightness-95 ${block.completed ? 'opacity-60 grayscale' : 'shadow-sm'
                                                    } ${isDarkMode
                                                        ? 'bg-zinc-800/80 border-zinc-600 backdrop-blur-sm'
                                                        : priorityColors[block.priority as keyof typeof priorityColors] || 'bg-white border-zinc-400'
                                                    }`}
                                                style={{
                                                    top: `${(block.start % 1) * 80}px`,
                                                    height: `${Math.max(block.duration * 80 - 4, 40)}px`,
                                                }}
                                                onClick={() => navigate(`/task/${block.id}`)}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <h4 className={`text-sm font-semibold truncate mb-0.5 ${block.completed ? 'line-through opacity-70' : ''
                                                            }`}>
                                                            {block.title}
                                                        </h4>
                                                        <div className={`flex items-center gap-2 text-xs opacity-80 ${isDarkMode ? 'text-zinc-300' : 'text-zinc-600'
                                                            }`}>
                                                            <span className="flex items-center gap-1">
                                                                <Clock size={10} />
                                                                {block.duration >= 1 ? `${block.duration}h` : `${block.duration * 60}m`}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            handleCompleteTask(block.id)
                                                        }}
                                                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${block.completed
                                                            ? 'bg-zinc-900 border-zinc-900 dark:bg-zinc-100 dark:border-zinc-100'
                                                            : 'border-zinc-300 hover:border-zinc-400 dark:border-zinc-600 dark:hover:border-zinc-500'
                                                            }`}
                                                    >
                                                        {block.completed && (
                                                            <Check
                                                                size={12}
                                                                className={isDarkMode ? 'text-zinc-900' : 'text-white'}
                                                                strokeWidth={3}
                                                            />
                                                        )}
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ))}
                                </div>
                            </div>
                        ))}

                        {/* Empty state */}
                        {timeBlocks.length === 0 && (
                            <div className={`text-center py-16 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                <Clock size={32} className="mx-auto mb-3 opacity-50" />
                                <p className="text-sm">No tasks for this day</p>
                                <button
                                    onClick={() => setShowAddTask(true)}
                                    className={`mt-3 px-4 py-2 text-sm rounded-lg transition-colors ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-200 hover:bg-zinc-300'
                                        }`}
                                >
                                    Add a task
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* FAB */}
            <motion.button
                className={`fixed bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40 ${isDarkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { triggerHaptic('medium'); setShowAddTask(true) }}
            >
                <Plus size={24} />
            </motion.button>

            {/* Add Task Dialog */}
            <AddTaskDialog
                isOpen={showAddTask}
                onClose={() => setShowAddTask(false)}
                onSubmit={handleAddTask}
            />
        </div>
    )
}

export default Calendar
