import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Plus, Search, Calendar, CalendarDays, Archive, Check, ChevronRight, Settings, LogOut } from 'lucide-react'
import { AddTaskDialog } from '@/components/features'
import { useThemeStore } from '@/store/themeStore'
import { triggerHaptic } from '@/lib/haptic'
import { useTasks } from '@/hooks/useTasks'
import { useAuth } from '@/hooks/useAuth'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Task interface is now imported from useTasks hook

function Home() {
    const navigate = useNavigate()
    const { isDarkMode } = useThemeStore()
    const { user, signOut } = useAuth()
    const { tasks, addTask, completeTask, todayTasks: todayTasksList, completedTasks } = useTasks()
    const [showQuickCapture, setShowQuickCapture] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [greeting, setGreeting] = useState('Good morning')
    const [completedTaskId, setCompletedTaskId] = useState<string | null>(null)

    useEffect(() => {
        const hour = new Date().getHours()
        if (hour < 12) setGreeting('Good morning')
        else if (hour < 17) setGreeting('Good afternoon')
        else if (hour < 21) setGreeting('Good evening')
        else setGreeting('Good night')
    }, [])

    const handleTaskComplete = async (taskId: string) => {
        triggerHaptic('success')
        setCompletedTaskId(taskId)
        setTimeout(async () => {
            await completeTask(taskId)
            setCompletedTaskId(null)
        }, 300)
    }

    const handleAddTask = async (taskData: { title: string; category?: string; date?: Date; recurrence?: string; priority?: 'low' | 'medium' | 'high'; time?: string }) => {
        await addTask({
            title: taskData.title,
            dueDate: taskData.date || new Date(),
            dueTime: taskData.time,
            recurrence: taskData.recurrence as any, // Cast to match Task interface union type
            category: taskData.category,
            priority: taskData.priority,
        })
        setShowQuickCapture(false)
    }

    const handleSignOut = async () => {
        await signOut()
        navigate('/auth')
    }

    const completedCount = completedTasks.length
    const totalCount = tasks.length
    const todayCount = todayTasksList.length

    // Get user initials for avatar
    const userInitials = user?.displayName
        ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
        : user?.email?.slice(0, 2).toUpperCase() || 'GU'

    return (
        <div className={`min-h-screen pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
            }`}>
            {/* Header */}
            <header className={`sticky top-0 z-30 px-6 pt-8 pb-4 backdrop-blur-xl transition-colors border-b ${isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-50/80 border-zinc-200/50'
                }`}>
                {/* Header Row */}
                <div className="relative flex items-center justify-center mb-6">
                    {/* Centered Logo */}
                    <h1 className="text-3xl font-bold tracking-tight">
                        Do<span className="text-red-500">.</span>This
                    </h1>

                    {/* Right Actions - absolute positioned */}
                    <div className="absolute right-0 flex items-center gap-2">
                        {/* Search Button */}
                        <button
                            onClick={() => { triggerHaptic('light'); setShowSearch(!showSearch) }}
                            className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                                }`}
                            aria-label="Search"
                        >
                            <Search size={20} className={isDarkMode ? 'text-zinc-400' : 'text-zinc-500'} />
                        </button>

                        {/* User Menu */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${isDarkMode
                                    ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
                                    : 'bg-zinc-900 text-white hover:bg-zinc-800'
                                    }`}>
                                    {userInitials}
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className={`px-2 py-2 border-b ${isDarkMode ? 'border-zinc-700' : 'border-zinc-100'}`}>
                                    <p className={`font-medium ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'}`}>{user?.displayName || 'Guest User'}</p>
                                    <p className="text-sm text-zinc-500">{user?.email || 'demo@example.com'}</p>
                                </div>
                                <DropdownMenuItem onClick={() => navigate('/settings')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    Settings
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Greeting */}
                <div className="mb-6">
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{greeting}</p>
                    <h2 className="text-2xl font-medium">Welcome back</h2>
                </div>

                {/* Search Bar */}
                <AnimatePresence>
                    {showSearch && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-4"
                        >
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                autoFocus
                                className={`w-full px-4 py-3 rounded-lg border text-sm focus:outline-none focus:ring-2 ${isDarkMode
                                    ? 'bg-zinc-800 border-zinc-700 placeholder:text-zinc-500 focus:ring-zinc-600'
                                    : 'bg-zinc-100 border-zinc-200 placeholder:text-zinc-400 focus:ring-zinc-300'
                                    }`}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Progress */}
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Today's progress</span>
                        <span className="text-sm font-medium">{completedCount}/{totalCount}</span>
                    </div>
                    <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
                        <motion.div
                            className={`h-full rounded-full ${isDarkMode ? 'bg-zinc-100' : 'bg-zinc-900'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </div>
            </header>

            {/* Quick Actions Grid */}
            <section className="px-6 py-4">
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: 'add', icon: Plus, label: 'Quick Add', action: () => setShowQuickCapture(true) },
                        { id: 'today', icon: Calendar, label: 'Today', badge: todayCount, action: () => navigate('/today') },
                        { id: 'calendar', icon: CalendarDays, label: 'Calendar', action: () => navigate('/calendar') },
                        { id: 'vault', icon: Archive, label: 'Vault', action: () => navigate('/vault') },
                    ].map(({ id, icon: Icon, label, badge, action }) => (
                        <motion.button
                            key={id}
                            onClick={() => { triggerHaptic('light'); action() }}
                            whileTap={{ scale: 0.98 }}
                            className={`flex items-center gap-3 p-4 rounded-xl transition-colors text-left ${isDarkMode
                                ? 'bg-zinc-800 hover:bg-zinc-700'
                                : 'bg-zinc-100 hover:bg-zinc-200'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-zinc-700' : 'bg-white'}`}>
                                <Icon size={18} className={isDarkMode ? 'text-zinc-300' : 'text-zinc-600'} />
                            </div>
                            <span className="text-sm font-medium">{label}</span>
                            {badge !== undefined && badge > 0 && (
                                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'
                                    }`}>
                                    {badge}
                                </span>
                            )}
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* Tasks Section */}
            <section className="px-6 py-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-sm font-medium ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Tasks</h3>
                    <button
                        onClick={() => navigate('/today')}
                        className={`text-xs flex items-center gap-1 transition-colors ${isDarkMode ? 'text-zinc-400 hover:text-zinc-200' : 'text-zinc-500 hover:text-zinc-900'
                            }`}
                    >
                        See all <ChevronRight size={14} />
                    </button>
                </div>

                <div className="space-y-2">
                    <AnimatePresence>
                        {tasks.slice(0, 5).map((task) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                onClick={() => navigate(`/task/${task.id}`)}
                                className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-colors ${task.completed ? 'opacity-50' : ''
                                    } ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-100 hover:bg-zinc-200'}`}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleTaskComplete(task.id)
                                    }}
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${task.completed
                                        ? isDarkMode ? 'bg-zinc-100 border-zinc-100' : 'bg-zinc-900 border-zinc-900'
                                        : isDarkMode ? 'border-zinc-600 hover:border-zinc-400' : 'border-zinc-300 hover:border-zinc-500'
                                        }`}
                                    aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
                                >
                                    {(task.completed || completedTaskId === task.id) && (
                                        <Check size={12} className={isDarkMode ? 'text-zinc-900' : 'text-white'} />
                                    )}
                                </button>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${task.completed ? 'line-through' : ''}`}>{task.title}</p>
                                    <p className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
                                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No due date'}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {tasks.filter(t => !t.completed).length === 0 && (
                        <div className={`text-center py-8 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-500'}`}>
                            <Check size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">All done for today!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* FAB */}
            <motion.button
                className={`fixed bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40 ${isDarkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { triggerHaptic('medium'); setShowQuickCapture(true) }}
                aria-label="Add task"
            >
                <Plus size={24} />
            </motion.button>

            {/* Quick Capture Dialog */}
            <AddTaskDialog
                isOpen={showQuickCapture}
                onClose={() => setShowQuickCapture(false)}
                onSubmit={handleAddTask}
            />
        </div>
    )
}

export default Home
