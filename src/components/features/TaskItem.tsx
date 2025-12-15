import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Check, Trash2, Clock, Repeat } from 'lucide-react'
import { Task } from '@/hooks/useTasks'
import { triggerHaptic } from '@/lib/haptic'
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from '@/components/ui/context-menu'

interface TaskItemProps {
    task: Task
    isDarkMode: boolean
    onComplete: (id: string) => void
    onDelete: (id: string) => void
}

export function TaskItem({ task, isDarkMode, onComplete, onDelete }: TaskItemProps) {
    const x = useMotionValue(0)

    // Swipe Right (Complete) - Reveals Green background on Left
    const opacityRight = useTransform(x, [50, 100], [0, 1])

    // Swipe Left (Delete) - Reveals Red background on Right
    const opacityLeft = useTransform(x, [-50, -100], [0, 1])

    const handleDragEnd = (_: any, info: any) => {
        // Threshold for activation (100px)
        if (info.offset.x > 100 && !task.completed) {
            triggerHaptic('success')
            onComplete(task.id)
        } else if (info.offset.x < -100) {
            triggerHaptic('heavy')
            onDelete(task.id)
        }
    }

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            whileHover={{ scale: 1.02 }}
            className="relative mb-3 select-none touch-pan-y"
        >
            <ContextMenu>
                {/* Background Actions */}
                <div className={`absolute inset-0 rounded-xl overflow-hidden`}>
                    {/* Left Side (Complete) */}
                    <motion.div
                        style={{ opacity: opacityRight }}
                        className="absolute inset-y-0 left-0 w-full bg-green-500 flex items-center px-4 justify-start"
                    >
                        <Check className="text-white" />
                    </motion.div>

                    {/* Right Side (Delete) */}
                    <motion.div
                        style={{ opacity: opacityLeft }}
                        className="absolute inset-y-0 right-0 w-full bg-red-500 flex items-center px-4 justify-end"
                    >
                        <Trash2 className="text-white" />
                    </motion.div>
                </div>

                {/* Foreground Task */}
                <ContextMenuTrigger>
                    <motion.div
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }} // Elastic snap back
                        dragElastic={0.2} // Restrict movement slightly
                        onDragEnd={handleDragEnd}
                        style={{ x }}
                        whileTap={{ cursor: 'grabbing' }}
                        className={`relative z-10 flex items-start gap-3 p-4 rounded-xl shadow-sm border backdrop-blur-md transition-all ${isDarkMode ? 'bg-zinc-800/80 border-zinc-700/50' : 'bg-white/80 border-zinc-200/50'
                            } ${task.completed ? 'opacity-50' : ''}`}
                    >
                        {/* Checkbox (Clickable fallback) */}
                        <button
                            onClick={(e) => { e.stopPropagation(); triggerHaptic('success'); onComplete(task.id) }}
                            className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${task.completed
                                ? isDarkMode ? 'bg-green-500 border-green-500' : 'bg-green-500 border-green-500'
                                : isDarkMode ? 'border-zinc-600 hover:border-zinc-400' : 'border-zinc-300 hover:border-zinc-500'
                                }`}
                        >
                            {task.completed && <Check size={12} className="text-white" />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${isDarkMode ? 'text-zinc-100' : 'text-zinc-900'} ${task.completed ? 'line-through text-zinc-500' : ''}`}>
                                {task.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                {task.dueTime && (
                                    <span className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                        <Clock size={12} /> {task.dueTime}
                                    </span>
                                )}
                                {task.dueDate && (
                                    <span className={`text-xs ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                )}
                                {task.recurrence && task.recurrence !== 'none' && (
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full flex items-center gap-1 ${isDarkMode ? 'bg-zinc-700 text-zinc-300' : 'bg-zinc-100 text-zinc-600'}`}>
                                        <Repeat size={10} /> {task.recurrence === 'weekdays' ? 'W' : task.recurrence === 'daily' ? 'D' : 'R'}
                                    </span>
                                )}
                                {task.priority && (
                                    <span className={`w-1.5 h-1.5 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`} />
                                )}
                            </div>
                        </div>
                    </motion.div>
                </ContextMenuTrigger>

                <ContextMenuContent>
                    <div className="p-1">
                        <button
                            onClick={() => onComplete(task.id)}
                            className={`w-full text-left px-2 py-1.5 text-sm rounded-sm flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${isDarkMode ? 'text-zinc-200' : 'text-zinc-800'}`}
                        >
                            <Check size={14} />
                            {task.completed ? 'Mark Uncompleted' : 'Mark Completed'}
                        </button>
                        {/* Additional options could go here if onUpdate was passed */}
                        <div className="h-px bg-zinc-200 dark:bg-zinc-800 my-1" />
                        <button
                            onClick={() => onDelete(task.id)}
                            className="w-full text-left px-2 py-1.5 text-sm rounded-sm flex items-center gap-2 text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                            <Trash2 size={14} />
                            Delete
                        </button>
                    </div>
                </ContextMenuContent>
            </ContextMenu>
        </motion.div>
    )
}

