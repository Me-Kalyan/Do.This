import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MoreVertical, Calendar, Clock, Flag, Tag, Plus, Check, Circle, Edit3, Copy, Share2, Trash2, Star, Bell, Timer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/store/themeStore'
import { useTasks } from '@/hooks/useTasks'
import { triggerHaptic } from '@/lib/haptic'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const priorityColors = {
    low: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    high: 'bg-red-100 text-red-700 border-red-200',
}

function TaskDetail() {
    const { id: taskId } = useParams()
    const navigate = useNavigate()
    const { isDarkMode } = useThemeStore()
    const { tasks, deleteTask, completeTask } = useTasks()
    const [newSubtask, setNewSubtask] = useState('')
    const [isStarred, setIsStarred] = useState(false)

    // Find the task from our tasks list
    const task = tasks.find(t => t.id === taskId)

    // Mock subtasks for now (would be stored in task.subtasks in real implementation)
    const [subtasks, setSubtasks] = useState([
        { id: 's1', title: 'Review typography tokens', completed: true },
        { id: 's2', title: 'Check color palette', completed: true },
        { id: 's3', title: 'Verify spacing system', completed: false },
        { id: 's4', title: 'Test component variants', completed: false },
    ])

    const completedCount = subtasks.filter(s => s.completed).length
    const progress = subtasks.length > 0 ? (completedCount / subtasks.length) * 100 : 0

    const toggleSubtask = (subtaskId: string) => {
        triggerHaptic('light')
        setSubtasks(prev => prev.map(s =>
            s.id === subtaskId ? { ...s, completed: !s.completed } : s
        ))
    }

    const addSubtask = () => {
        if (!newSubtask.trim()) return
        triggerHaptic('light')
        setSubtasks(prev => [
            ...prev,
            { id: `s${Date.now()}`, title: newSubtask, completed: false },
        ])
        setNewSubtask('')
    }

    const handleEdit = () => {
        triggerHaptic('light')
        // TODO: Open edit modal
        alert('Edit functionality coming soon!')
    }

    const handleDuplicate = async () => {
        if (!task) return
        triggerHaptic('light')
        // TODO: Implement with addTask
        alert('Task duplicated!')
    }

    const handleShare = async () => {
        if (!task) return
        triggerHaptic('light')
        if (navigator.share) {
            await navigator.share({
                title: task.title,
                text: task.description || '',
            })
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(`${task.title}\n${task.description || ''}`)
            alert('Task copied to clipboard!')
        }
    }

    const handleAddReminder = () => {
        triggerHaptic('light')
        // TODO: Implement with push notifications
        alert('Reminder set!')
    }

    const handleStartTimer = () => {
        triggerHaptic('medium')
        // TODO: Implement timer
        alert('Timer started!')
    }

    const handleStarTask = () => {
        triggerHaptic('light')
        setIsStarred(!isStarred)
    }

    const handleDelete = async () => {
        if (!task) return
        if (confirm('Are you sure you want to delete this task?')) {
            triggerHaptic('heavy')
            await deleteTask(task.id)
            navigate(-1)
        }
    }

    const handleCompleteTask = async () => {
        if (!task) return
        triggerHaptic('success')
        await completeTask(task.id)
    }

    // If task not found, show error
    if (!task) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
                <div className="text-center">
                    <p className="text-lg font-medium">Task not found</p>
                    <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
                </div>
            </div>
        )
    }

    return (
        <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
            {/* Header */}
            <header className={`sticky top-0 z-40 backdrop-blur-xl border-b ${isDarkMode ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white/80 border-zinc-100'}`}>
                <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className={`p-2 -ml-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-zinc-100 text-zinc-600'}`}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="font-semibold">Task Details</h1>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="p-2 -mr-2 rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors">
                                <MoreVertical size={20} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={handleEdit}>
                                <Edit3 className="mr-2 h-4 w-4" />
                                Edit Task
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDuplicate}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleShare}>
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleAddReminder}>
                                <Bell className="mr-2 h-4 w-4" />
                                Add Reminder
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleStartTimer}>
                                <Timer className="mr-2 h-4 w-4" />
                                Start Timer
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleStarTask}>
                                <Star className="mr-2 h-4 w-4" />
                                Add to Favorites
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleDelete} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Task
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            {/* Main Content */}
            <motion.main
                className="max-w-2xl mx-auto px-4 py-6 pb-32 space-y-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* Task Header Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                    <div className="flex items-start gap-4">
                        <button
                            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed
                                ? isDarkMode ? 'bg-zinc-100 border-zinc-100 text-zinc-900' : 'bg-zinc-900 border-zinc-900 text-white'
                                : isDarkMode ? 'border-zinc-600 hover:border-zinc-400' : 'border-zinc-300 hover:border-zinc-400'
                                }`}
                            onClick={handleCompleteTask}
                        >
                            {task.completed && <Check size={14} strokeWidth={3} />}
                        </button>
                        <div className="flex-1">
                            <h2 className={`text-xl font-semibold ${task.completed ? 'line-through text-zinc-400' : 'text-zinc-900'}`}>
                                {task.title}
                            </h2>
                            <p className="mt-2 text-zinc-500 leading-relaxed">
                                {task.description}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Metadata Cards */}
                <div className="grid grid-cols-2 gap-3">
                    {/* Due Date */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-100">
                        <div className="flex items-center gap-2 text-zinc-400 mb-2">
                            <Calendar size={14} />
                            <span className="text-xs font-medium uppercase tracking-wider">Due Date</span>
                        </div>
                        <p className="font-medium text-zinc-900">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
                        </p>
                    </div>

                    {/* Scheduled Time */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-100">
                        <div className="flex items-center gap-2 text-zinc-400 mb-2">
                            <Clock size={14} />
                            <span className="text-xs font-medium uppercase tracking-wider">Time</span>
                        </div>
                        <p className="font-medium text-zinc-900">{task.dueTime || 'No time set'}</p>
                    </div>

                    {/* Priority */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-100">
                        <div className="flex items-center gap-2 text-zinc-400 mb-2">
                            <Flag size={14} />
                            <span className="text-xs font-medium uppercase tracking-wider">Priority</span>
                        </div>
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${priorityColors[(task.priority || 'medium') as keyof typeof priorityColors]}`}>
                            {(task.priority || 'medium').charAt(0).toUpperCase() + (task.priority || 'medium').slice(1)}
                        </span>
                    </div>

                    {/* Category */}
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-100">
                        <div className="flex items-center gap-2 text-zinc-400 mb-2">
                            <Tag size={14} />
                            <span className="text-xs font-medium uppercase tracking-wider">Category</span>
                        </div>
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium border bg-zinc-100 text-zinc-700 border-zinc-200">
                            {task.category || 'Uncategorized'}
                        </span>
                    </div>
                </div>

                {/* Tags */}
                {task.tags && task.tags.length > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-zinc-100">
                        <div className="flex items-center gap-2 text-zinc-400 mb-3">
                            <Tag size={14} />
                            <span className="text-xs font-medium uppercase tracking-wider">Tags</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {task.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-3 py-1.5 bg-zinc-100 text-zinc-600 rounded-full text-sm font-medium"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Subtasks Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 overflow-hidden">
                    {/* Progress Header */}
                    <div className="p-4 border-b border-zinc-100">
                        <div className="flex items-center justify-between mb-3">
                            <span className="font-medium text-zinc-900">Subtasks</span>
                            <span className="text-sm text-zinc-500">{completedCount} of {subtasks.length}</span>
                        </div>
                        <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-zinc-900 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] }}
                            />
                        </div>
                    </div>

                    {/* Subtasks List */}
                    <div className="divide-y divide-zinc-100">
                        {subtasks.map((subtask, index) => (
                            <motion.div
                                key={subtask.id}
                                className="flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 transition-colors cursor-pointer"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => toggleSubtask(subtask.id)}
                            >
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${subtask.completed
                                    ? 'bg-zinc-900 border-zinc-900 text-white'
                                    : 'border-zinc-300'
                                    }`}>
                                    {subtask.completed && <Check size={12} strokeWidth={3} />}
                                </div>
                                <span className={`flex-1 ${subtask.completed ? 'line-through text-zinc-400' : 'text-zinc-700'}`}>
                                    {subtask.title}
                                </span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Add Subtask */}
                    <div className="p-4 border-t border-zinc-100 flex items-center gap-3">
                        <Circle size={20} className="text-zinc-300" />
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-sm placeholder:text-zinc-400 focus:outline-none"
                            placeholder="Add a subtask..."
                            value={newSubtask}
                            onChange={(e) => setNewSubtask(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addSubtask()}
                        />
                        {newSubtask && (
                            <button
                                onClick={addSubtask}
                                className="p-1.5 rounded-full bg-zinc-900 text-white hover:bg-zinc-800 transition-colors"
                            >
                                <Plus size={14} />
                            </button>
                        )}
                    </div>
                </div>
            </motion.main>

            {/* Fixed Bottom Action */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-zinc-100">
                <div className="max-w-2xl mx-auto">
                    <Button
                        variant={task.completed ? "outline" : "default"}
                        size="lg"
                        fullWidth
                        onClick={handleCompleteTask}
                    >
                        {task.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TaskDetail
