import { useState, useMemo } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { DraggableTask } from './DraggableTask'
import { DroppableTimeSlot } from './DroppableTimeSlot'

interface Task {
    id: string
    title: string
    priority?: 'low' | 'medium' | 'high'
    duration?: number
    project?: string
}

interface ScheduledTask extends Task {
    scheduledTime: string
}

interface TimeboxingCalendarProps {
    tasks: Task[]
    scheduledTasks?: ScheduledTask[]
    onTaskSchedule?: (taskId: string, time: string) => void
    onTaskUnschedule?: (taskId: string) => void
    startHour?: number
    endHour?: number
}

export function TimeboxingCalendar({
    tasks = [],
    scheduledTasks = [],
    onTaskSchedule,
    onTaskUnschedule,
    startHour = 6,
    endHour = 22,
}: TimeboxingCalendarProps) {
    const [activeTask, setActiveTask] = useState<Task | null>(null)
    const [localScheduled, setLocalScheduled] = useState<Record<string, Task>>({})

    // Generate time slots
    const timeSlots = useMemo(() => {
        const slots = []
        for (let hour = startHour; hour <= endHour; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`
            const displayTime = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`
            slots.push({ id: `slot-${time}`, time, displayTime })
        }
        return slots
    }, [startHour, endHour])

    // Get current hour
    const currentHour = new Date().getHours()

    // Combine scheduled tasks from props and local state
    const allScheduled = useMemo(() => {
        const scheduled: Record<string, Task & { scheduledTime: string }> = {}
        scheduledTasks.forEach(task => {
            scheduled[task.scheduledTime] = task
        })
        Object.entries(localScheduled).forEach(([time, task]) => {
            scheduled[time] = { ...task, scheduledTime: time }
        })
        return scheduled
    }, [scheduledTasks, localScheduled])

    // Unscheduled tasks
    const unscheduledTasks = useMemo(() => {
        const scheduledIds = new Set(Object.values(allScheduled).map(t => t.id))
        return tasks.filter(t => !scheduledIds.has(t.id))
    }, [tasks, allScheduled])

    const handleDragStart = (event: DragStartEvent) => {
        const task = event.active.data.current?.task as Task
        setActiveTask(task)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        setActiveTask(null)

        if (!over) return

        const task = active.data.current?.task as Task
        const time = over.data.current?.time as string

        if (task && time) {
            // Update local state
            setLocalScheduled(prev => {
                // Remove task from any previous slot
                const updated = { ...prev }
                Object.entries(updated).forEach(([t, scheduledTask]) => {
                    if (scheduledTask.id === task.id) {
                        delete updated[t]
                    }
                })
                // Add to new slot
                updated[time] = task
                return updated
            })

            // Notify parent
            onTaskSchedule?.(task.id, time)
        }
    }

    const handleTaskRemove = (taskId: string, time: string) => {
        setLocalScheduled(prev => {
            const updated = { ...prev }
            delete updated[time]
            return updated
        })
        onTaskUnschedule?.(taskId)
    }

    return (
        <DndContext
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="timeboxing-calendar">
                {/* Unscheduled Tasks Pool */}
                <motion.div
                    className="task-pool"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h3 className="pool-title">Tasks</h3>
                    <p className="pool-subtitle">Drag to schedule</p>

                    <div className="task-list">
                        {unscheduledTasks.length > 0 ? (
                            unscheduledTasks.map(task => (
                                <DraggableTask
                                    key={task.id}
                                    id={task.id}
                                    title={task.title}
                                    priority={task.priority}
                                    duration={task.duration}
                                    project={task.project}
                                />
                            ))
                        ) : (
                            <div className="empty-pool">
                                <span>All tasks scheduled!</span>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Calendar Grid */}
                <motion.div
                    className="calendar-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="grid-header">
                        <span>Today's Schedule</span>
                    </div>

                    <div className="time-slots">
                        {timeSlots.map(slot => {
                            const scheduled = allScheduled[slot.time]
                            return (
                                <DroppableTimeSlot
                                    key={slot.id}
                                    id={slot.id}
                                    time={slot.time}
                                    displayTime={slot.displayTime}
                                    scheduledTask={scheduled}
                                    isCurrentHour={parseInt(slot.time) === currentHour}
                                    onTaskRemove={(taskId) => handleTaskRemove(taskId, slot.time)}
                                />
                            )
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Drag Overlay */}
            <DragOverlay>
                {activeTask && (
                    <div className="drag-overlay">
                        <DraggableTask
                            id={activeTask.id}
                            title={activeTask.title}
                            priority={activeTask.priority}
                            duration={activeTask.duration}
                        />
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    )
}

export default TimeboxingCalendar
