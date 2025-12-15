import { motion } from 'framer-motion'

interface Task {
    id: string
    title: string
    reason: string
    energy: 'low' | 'medium' | 'high'
    time?: string
    confidence: number
}

interface SmartTaskListProps {
    title: string
    tasks: Task[]
    onTaskClick?: (id: string) => void
}

const energyColors = {
    low: 'teal',
    medium: 'blue',
    high: 'violet',
}

function SmartTaskList({ title, tasks, onTaskClick }: SmartTaskListProps) {
    return (
        <div className="smart-task-list">
            <div className="smart-list-header">
                <h3 className="text-title-sm">{title}</h3>
                <span className="smart-badge text-caption">AI</span>
            </div>

            <div className="smart-tasks">
                {tasks.map((task, index) => (
                    <motion.div
                        key={task.id}
                        className={`smart-task energy-${energyColors[task.energy]}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onTaskClick?.(task.id)}
                    >
                        <div className="smart-task-content">
                            <div className="smart-task-main">
                                <span className="smart-task-title">{task.title}</span>
                                {task.time && (
                                    <span className="smart-task-time text-caption">{task.time}</span>
                                )}
                            </div>
                            <span className="smart-task-reason text-caption">{task.reason}</span>
                        </div>

                        <div className="smart-task-confidence">
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                className="confidence-ring"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    opacity="0.2"
                                />
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeDasharray={`${task.confidence * 62.8} 62.8`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 12 12)"
                                />
                            </svg>
                            <span className="confidence-percent text-caption">
                                {Math.round(task.confidence * 100)}%
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default SmartTaskList
