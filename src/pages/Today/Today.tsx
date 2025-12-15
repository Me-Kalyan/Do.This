import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, Plus, ChevronLeft } from 'lucide-react'
import { AddTaskDialog, TaskItem } from '@/components/features'
import { useThemeStore } from '@/store/themeStore'
import { triggerHaptic } from '@/lib/haptic'
import { useTasks } from '@/hooks/useTasks'

function Today() {
    const navigate = useNavigate()
    const { isDarkMode } = useThemeStore()
    const { tasks, addTask, completeTask, deleteTask, completedTasks } = useTasks()

    const [showAddTask, setShowAddTask] = useState(false)

    const currentHour = new Date().getHours()
    const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening'
    const completedCount = completedTasks.length
    const remainingCount = tasks.filter(t => !t.completed).length

    const handleTaskComplete = async (taskId: string) => {
        triggerHaptic('success')
        // Optimistic update or just wait for re-render
        // TaskItem handles visual feedback via swipe, but click needs this
        await completeTask(taskId)
    }

    const handleTaskDelete = async (taskId: string) => {
        triggerHaptic('heavy')
        await deleteTask(taskId)
    }

    const handleAddTask = async (taskData: { title: string }) => {
        await addTask({
            title: taskData.title,
            dueDate: new Date(),
        })
        setShowAddTask(false)
    }

    return (
        <div className={`min-h-screen pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
            }`}>
            {/* Header */}
            <header className="px-6 pt-8 pb-4">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => { triggerHaptic('light'); navigate(-1) }}
                        className={`p-2 -ml-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                            }`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex-1">
                        <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{greeting}</p>
                        <h1 className="text-xl font-semibold">Today</h1>
                    </div>
                    <button
                        onClick={() => { triggerHaptic('light'); navigate('/calendar') }}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                            }`}
                    >
                        <Calendar size={20} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                    </button>
                </div>

                {/* Date */}
                <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </p>
            </header>

            {/* Stats */}
            <section className="px-6 py-4">
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Remaining', value: remainingCount },
                        { label: 'Completed', value: completedCount },
                        { label: 'Total', value: tasks.length },
                    ].map((stat) => (
                        <div key={stat.label} className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'
                            }`}>
                            <p className="text-2xl font-semibold">{stat.value}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className={`mt-4 p-4 rounded-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                    <div className="flex justify-between text-sm mb-2">
                        <span className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}>Progress</span>
                        <span>{Math.round((completedCount / tasks.length) * 100)}%</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
                        <motion.div
                            className={`h-full rounded-full ${isDarkMode ? 'bg-zinc-100' : 'bg-zinc-900'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
                        />
                    </div>
                </div>
            </section>

            {/* Task List */}
            <section className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className={`text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Schedule</h2>
                    <button
                        onClick={() => setShowAddTask(true)}
                        className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-900'
                            }`}
                    >
                        <Plus size={14} /> Add
                    </button>
                </div>

                <div className="space-y-2">
                    <AnimatePresence>
                        {tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                isDarkMode={isDarkMode}
                                onComplete={handleTaskComplete}
                                onDelete={handleTaskDelete}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            {/* FAB */}
            <motion.button
                className={`fixed bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg ${isDarkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'
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

export default Today
