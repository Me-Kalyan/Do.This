import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, LayoutDashboard, Calendar, Command, Target, Repeat, MessageSquare, BarChart3, CalendarDays } from 'lucide-react'
import {
    RecurrencePicker,
    TaskComments,
    HabitTracker,
    WidgetDashboard,
    SmartInput,
    ProductivityCharts,
    CompletionHeatmap
} from '@/components/features'
import { TimeboxingCalendar } from '@/components/calendar'
import type { RecurrenceConfig, Comment, Habit } from '@/components/features'

// Demo data
const demoTasks = [
    { id: '1', title: 'Review design docs', priority: 'high' as const, duration: 45, project: 'Work' },
    { id: '2', title: 'Call with client', priority: 'medium' as const, duration: 30 },
    { id: '3', title: 'Update roadmap', priority: 'low' as const, duration: 60, project: 'Planning' },
]

const demoComments: Comment[] = [
    { id: '1', text: 'Started working on this task', author: 'You', createdAt: new Date(Date.now() - 3600000) },
    { id: '2', text: 'Made good progress today!', author: 'You', createdAt: new Date(), isNote: true },
]

const demoHabits: Habit[] = [
    {
        id: '1',
        name: 'Exercise',
        emoji: '💪',
        color: '#79DCA0',
        frequency: 'daily',
        completedDates: ['2024-12-09', '2024-12-08', '2024-12-07', '2024-12-05'],
        createdAt: new Date('2024-12-01')
    },
    {
        id: '2',
        name: 'Read',
        emoji: '📚',
        color: '#A79BFF',
        frequency: 'daily',
        completedDates: ['2024-12-09', '2024-12-08', '2024-12-06'],
        createdAt: new Date('2024-12-01')
    },
]

export function FeatureShowcase() {
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState<string>('widgets')
    const [recurrence, setRecurrence] = useState<RecurrenceConfig>({ pattern: 'none' })
    const [comments, setComments] = useState<Comment[]>(demoComments)
    const [habits, setHabits] = useState<Habit[]>(demoHabits)

    const sections = [
        { id: 'widgets', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'timeboxing', label: 'Timeboxing', icon: Calendar },
        { id: 'smartinput', label: 'Smart Input', icon: Command },
        { id: 'habits', label: 'Habits', icon: Target },
        { id: 'recurrence', label: 'Recurrence', icon: Repeat },
        { id: 'comments', label: 'Comments', icon: MessageSquare },
        { id: 'charts', label: 'Charts', icon: BarChart3 },
        { id: 'heatmap', label: 'Heatmap', icon: CalendarDays },
    ]

    const handleAddComment = (text: string, isNote?: boolean) => {
        const newComment: Comment = {
            id: Date.now().toString(),
            text,
            author: 'You',
            createdAt: new Date(),
            isNote,
        }
        setComments([...comments, newComment])
    }

    const handleHabitToggle = (habitId: string, date: string) => {
        setHabits(habits.map(h => {
            if (h.id === habitId) {
                const dates = h.completedDates.includes(date)
                    ? h.completedDates.filter(d => d !== date)
                    : [...h.completedDates, date]
                return { ...h, completedDates: dates }
            }
            return h
        }))
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 -ml-2 rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="font-bold text-zinc-900">Feature Showcase</h1>
                            <p className="text-xs text-zinc-500">Test all components</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-400">
                        <Command size={16} />
                        <span className="text-sm font-medium">Interactive Demo</span>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Hero */}
                <motion.div
                    className="mb-8 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-3xl font-bold text-zinc-900 mb-2">
                        ✨ Component Playground
                    </h1>
                    <p className="text-zinc-500">
                        Explore and interact with all the new features
                    </p>
                </motion.div>

                {/* Navigation Grid */}
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mb-8">
                    {sections.map((section) => {
                        const Icon = section.icon
                        const isActive = activeSection === section.id
                        return (
                            <motion.button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${isActive
                                    ? 'bg-zinc-900 text-white shadow-lg'
                                    : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-100'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <Icon size={20} />
                                <span className="text-xs font-medium">{section.label}</span>
                            </motion.button>
                        )
                    })}
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-6"
                    >
                        {activeSection === 'widgets' && (
                            <WidgetDashboard
                                userName="Developer"
                                taskStats={{ completed: 5, pending: 3, streak: 7 }}
                            />
                        )}

                        {activeSection === 'timeboxing' && (
                            <TimeboxingCalendar
                                tasks={demoTasks}
                                onTaskSchedule={(id, time) => console.log(`Scheduled ${id} at ${time}`)}
                            />
                        )}

                        {activeSection === 'smartinput' && (
                            <div className="max-w-xl mx-auto py-8">
                                <div className="text-center mb-6">
                                    <h2 className="text-xl font-semibold text-zinc-900 mb-2">Natural Language Input</h2>
                                    <p className="text-zinc-500">Try: "call mom tomorrow at 3pm #personal"</p>
                                </div>
                                <SmartInput
                                    onSubmit={(task) => {
                                        console.log('Created task:', task)
                                        alert(`Task created: ${task.title}`)
                                    }}
                                    autoFocus
                                />
                            </div>
                        )}

                        {activeSection === 'habits' && (
                            <HabitTracker
                                habits={habits}
                                onToggleCompletion={handleHabitToggle}
                                onAddHabit={(habit) => {
                                    const newHabit: Habit = {
                                        ...habit,
                                        id: Date.now().toString(),
                                        completedDates: [],
                                        createdAt: new Date(),
                                    }
                                    setHabits([...habits, newHabit])
                                }}
                            />
                        )}

                        {activeSection === 'recurrence' && (
                            <div className="max-w-md mx-auto py-8">
                                <div className="text-center mb-6">
                                    <h2 className="text-xl font-semibold text-zinc-900 mb-2">Recurrence Picker</h2>
                                    <p className="text-zinc-500">
                                        Current: <span className="font-medium text-zinc-900">{recurrence.pattern}</span>
                                    </p>
                                </div>
                                <RecurrencePicker
                                    value={recurrence}
                                    onChange={setRecurrence}
                                />
                            </div>
                        )}

                        {activeSection === 'comments' && (
                            <div className="max-w-xl mx-auto py-4">
                                <h2 className="text-xl font-semibold text-zinc-900 mb-6">Task Comments & Notes</h2>
                                <TaskComments
                                    comments={comments}
                                    onAddComment={handleAddComment}
                                    onDeleteComment={(id) => setComments(comments.filter(c => c.id !== id))}
                                />
                            </div>
                        )}

                        {activeSection === 'charts' && (
                            <ProductivityCharts />
                        )}

                        {activeSection === 'heatmap' && (
                            <CompletionHeatmap weeks={12} />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}

export default FeatureShowcase
