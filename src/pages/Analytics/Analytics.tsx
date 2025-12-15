import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, TrendingUp, Target, Clock, Flame, Circle, Calendar } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { triggerHaptic } from '@/lib/haptic'
import { useTasks } from '@/hooks/useTasks'

const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function Analytics() {
    const navigate = useNavigate()
    const { isDarkMode } = useThemeStore()
    const { tasks, loading } = useTasks()

    // Calculate real statistics
    const stats = useMemo(() => {
        const now = new Date()
        const startOfWeek = new Date(now)
        startOfWeek.setDate(now.getDate() - now.getDay())
        startOfWeek.setHours(0, 0, 0, 0)

        // Tasks completed this week
        const tasksThisWeek = tasks.filter(t => {
            const completedAt = t.completedAt
            return completedAt && completedAt >= startOfWeek
        })

        // Calculate streak (consecutive days with completed tasks)
        let streak = 0
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today)
            checkDate.setDate(today.getDate() - i)
            const hasCompletedTask = tasks.some(t =>
                t.completedAt && t.completedAt.toDateString() === checkDate.toDateString()
            )
            if (hasCompletedTask) {
                streak++
            } else if (i > 0) { // Don't break streak on today if no tasks yet
                break
            }
        }

        // Average tasks per day (last 7 days)
        const last7Days = tasks.filter(t => {
            const created = t.createdAt
            const weekAgo = new Date()
            weekAgo.setDate(weekAgo.getDate() - 7)
            return created >= weekAgo
        })
        const avgPerDay = last7Days.length > 0 ? (last7Days.length / 7).toFixed(1) : '0'

        // Find most productive hour
        const hourCounts: { [key: number]: number } = {}
        tasks.filter(t => t.completed).forEach(t => {
            if (t.completedAt) {
                const hour = t.completedAt.getHours()
                hourCounts[hour] = (hourCounts[hour] || 0) + 1
            }
        })
        const peakHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]
        const productiveHour = peakHour
            ? `${parseInt(peakHour[0]) % 12 || 12} ${parseInt(peakHour[0]) >= 12 ? 'PM' : 'AM'}`
            : 'N/A'

        return {
            tasksCompleted: tasksThisWeek.length,
            streak,
            avgPerDay,
            productiveHour,
            totalTasks: tasks.length,
            completedTasks: tasks.filter(t => t.completed).length,
            pendingTasks: tasks.filter(t => !t.completed).length,
        }
    }, [tasks])

    // Weekly completion data (last 7 days)
    const weeklyData = useMemo(() => {
        const data: number[] = []
        const today = new Date()

        // Start from Monday of current week
        const monday = new Date(today)
        monday.setDate(today.getDate() - ((today.getDay() + 6) % 7))
        monday.setHours(0, 0, 0, 0)

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday)
            date.setDate(monday.getDate() + i)
            const nextDate = new Date(date)
            nextDate.setDate(date.getDate() + 1)

            const completedOnDay = tasks.filter(t =>
                t.completedAt &&
                t.completedAt >= date &&
                t.completedAt < nextDate
            ).length

            data.push(completedOnDay)
        }

        return data
    }, [tasks])

    // Category breakdown
    const categoryBreakdown = useMemo(() => {
        const categories: { [key: string]: { total: number, completed: number } } = {}

        tasks.forEach(task => {
            const category = task.category || 'Uncategorized'
            if (!categories[category]) {
                categories[category] = { total: 0, completed: 0 }
            }
            categories[category].total++
            if (task.completed) {
                categories[category].completed++
            }
        })

        return Object.entries(categories)
            .map(([name, data]) => ({
                name,
                percentage: data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0,
                count: data.total,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4) // Top 4 categories
    }, [tasks])

    const maxValue = Math.max(...weeklyData, 1) // Prevent division by zero

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
                <div className={`animate-spin w-8 h-8 border-2 border-t-transparent rounded-full ${isDarkMode ? 'border-zinc-400' : 'border-zinc-600'
                    }`} />
            </div>
        )
    }

    return (
        <div className={`min-h-screen pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
            }`}>
            {/* Header */}
            <header className="px-6 pt-8 pb-4">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => { triggerHaptic('light'); navigate(-1) }}
                        className={`p-2 -ml-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                            }`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-xl font-semibold">Insights</h1>
                        <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Your productivity at a glance</p>
                    </div>
                </div>
            </header>

            {/* Stats Grid */}
            <section className="px-6 py-4">
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { icon: Target, value: stats.tasksCompleted, label: 'Completed this week' },
                        { icon: Flame, value: stats.streak, label: 'Day streak' },
                        { icon: TrendingUp, value: stats.avgPerDay, label: 'Avg tasks/day' },
                        { icon: Clock, value: stats.productiveHour, label: 'Peak productivity' },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 rounded-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${isDarkMode ? 'bg-zinc-700' : 'bg-white'
                                }`}>
                                <stat.icon size={18} className={isDarkMode ? 'text-zinc-300' : 'text-zinc-600'} />
                            </div>
                            <p className="text-2xl font-semibold">{stat.value}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Overview Stats */}
            <section className="px-6 py-4">
                <h2 className={`text-sm font-medium mb-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Overview</h2>
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-zinc-700' : 'bg-white'}`}>
                                <Calendar size={18} className={isDarkMode ? 'text-zinc-300' : 'text-zinc-600'} />
                            </div>
                            <div>
                                <p className="font-medium">{stats.totalTasks} Total Tasks</p>
                                <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                    {stats.completedTasks} completed · {stats.pendingTasks} pending
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-semibold">
                                {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                            </p>
                            <p className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>completion</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Weekly Chart */}
            <section className="px-6 py-4">
                <h2 className={`text-sm font-medium mb-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>Weekly Progress</h2>
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                    <div className="flex items-end justify-between h-32 gap-2">
                        {weeklyData.map((value, index) => (
                            <div key={index} className="flex-1 flex flex-col items-center">
                                <motion.div
                                    className={`w-full rounded-t ${isDarkMode ? 'bg-zinc-100' : 'bg-zinc-900'}`}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max((value / maxValue) * 100, 4)}%` }}
                                    transition={{ delay: 0.2 + index * 0.05, duration: 0.4 }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2">
                        {dayNames.map((day, i) => (
                            <span key={i} className={`flex-1 text-center text-xs ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                {day}
                            </span>
                        ))}
                    </div>
                    {weeklyData.every(v => v === 0) && (
                        <p className={`text-center text-xs mt-4 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            Complete tasks to see your weekly progress
                        </p>
                    )}
                </div>
            </section>

            {/* Category Distribution */}
            <section className="px-6 py-4">
                <h2 className={`text-sm font-medium mb-4 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>By Category</h2>
                <div className="space-y-3">
                    {categoryBreakdown.length > 0 ? (
                        categoryBreakdown.map((category, index) => (
                            <motion.div
                                key={category.name}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`p-4 rounded-xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{category.name}</span>
                                    <span className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                        {category.count} tasks · {category.percentage}%
                                    </span>
                                </div>
                                <div className={`h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`}>
                                    <motion.div
                                        className={isDarkMode ? 'bg-zinc-100' : 'bg-zinc-900'}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${category.percentage}%` }}
                                        transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                                        style={{ height: '100%' }}
                                    />
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className={`text-center py-8 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                            <Circle size={24} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Add categories to your tasks to see breakdown</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default Analytics
