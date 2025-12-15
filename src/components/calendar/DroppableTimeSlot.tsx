import { useDroppable } from '@dnd-kit/core'
import { motion, AnimatePresence } from 'framer-motion'

interface ScheduledTask {
    id: string
    title: string
    priority?: 'low' | 'medium' | 'high'
    duration?: number
}

interface DroppableTimeSlotProps {
    id: string
    time: string
    displayTime: string
    scheduledTask?: ScheduledTask | null
    isCurrentHour?: boolean
    children?: React.ReactNode
    onTaskRemove?: (taskId: string) => void
}

export function DroppableTimeSlot({
    id,
    time,
    displayTime,
    scheduledTask,
    isCurrentHour = false,
    children,
    onTaskRemove,
}: DroppableTimeSlotProps) {
    const { isOver, setNodeRef, active } = useDroppable({
        id,
        data: {
            type: 'timeslot',
            time,
        },
    })

    const isReceiving = isOver && active?.data?.current?.type === 'task'

    return (
        <div
            ref={setNodeRef}
            className={`droppable-timeslot ${isCurrentHour ? 'current-hour' : ''} ${isReceiving ? 'receiving' : ''} ${scheduledTask ? 'occupied' : ''}`}
        >
            <div className="timeslot-label">
                <span className="time-text">{displayTime}</span>
            </div>

            <div className="timeslot-content">
                <AnimatePresence mode="wait">
                    {scheduledTask ? (
                        <motion.div
                            key={scheduledTask.id}
                            className={`scheduled-task ${scheduledTask.priority || 'medium'}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                        >
                            <div className="scheduled-task-info">
                                <span className="scheduled-task-title">{scheduledTask.title}</span>
                                {scheduledTask.duration && (
                                    <span className="scheduled-task-duration">{scheduledTask.duration}m</span>
                                )}
                            </div>
                            {onTaskRemove && (
                                <button
                                    className="scheduled-task-remove"
                                    onClick={() => onTaskRemove(scheduledTask.id)}
                                    aria-label="Remove task"
                                >
                                    <svg width="12" height="12" viewBox="0 0 12 12">
                                        <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>
                            )}
                        </motion.div>
                    ) : isReceiving ? (
                        <motion.div
                            key="drop-indicator"
                            className="drop-indicator"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <span>Drop here to schedule</span>
                        </motion.div>
                    ) : (
                        <div className="empty-slot">
                            {children}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default DroppableTimeSlot
