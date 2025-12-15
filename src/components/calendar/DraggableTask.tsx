import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'

interface DraggableTaskProps {
    id: string
    title: string
    priority?: 'low' | 'medium' | 'high'
    duration?: number // in minutes
    project?: string
    isScheduled?: boolean
    scheduledTime?: string
    onRemove?: () => void
}

export function DraggableTask({
    id,
    title,
    priority = 'medium',
    duration = 30,
    project,
    isScheduled = false,
    scheduledTime,
    onRemove,
}: DraggableTaskProps) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id,
        data: {
            type: 'task',
            task: { id, title, priority, duration, project },
        },
    })

    const style = {
        transform: CSS.Translate.toString(transform),
    }

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            className={`draggable-task ${priority} ${isDragging ? 'dragging' : ''} ${isScheduled ? 'scheduled' : ''}`}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            {...attributes}
            {...listeners}
        >
            <div className="task-drag-handle">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                    <circle cx="3" cy="3" r="1.5" />
                    <circle cx="9" cy="3" r="1.5" />
                    <circle cx="3" cy="9" r="1.5" />
                    <circle cx="9" cy="9" r="1.5" />
                </svg>
            </div>

            <div className="task-content">
                <span className="task-title">{title}</span>
                <div className="task-meta">
                    {duration && <span className="task-duration">{duration}m</span>}
                    {project && <span className="task-project">{project}</span>}
                    {scheduledTime && <span className="task-time">{scheduledTime}</span>}
                </div>
            </div>

            <div className={`priority-indicator ${priority}`} />

            {isScheduled && onRemove && (
                <button
                    className="task-remove"
                    onClick={(e) => {
                        e.stopPropagation()
                        onRemove()
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
                        <path d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </button>
            )}
        </motion.div>
    )
}

export default DraggableTask
