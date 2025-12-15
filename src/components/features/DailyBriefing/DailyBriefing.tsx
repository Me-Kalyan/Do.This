import { motion } from 'framer-motion'
import { Card } from '@components/ui/Card'

interface BriefingData {
    greeting: string
    date: string
    weather?: {
        temp: number
        condition: string
    }
    tasksToday: number
    topPriority?: {
        title: string
        time?: string
    }
    streak: number
    insight?: string
}

interface DailyBriefingProps {
    data: BriefingData
    onDismiss?: () => void
}

function DailyBriefing({ data, onDismiss }: DailyBriefingProps) {
    return (
        <motion.div
            className="daily-briefing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
            <Card variant="hero" className="briefing-card">
                {/* Dismiss button */}
                {onDismiss && (
                    <button className="briefing-dismiss" onClick={onDismiss} aria-label="Dismiss">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                )}

                {/* Header */}
                <div className="briefing-header">
                    <div className="briefing-greeting">
                        <h2 className="text-display">{data.greeting}</h2>
                        <span className="briefing-date text-body">{data.date}</span>
                    </div>
                    {data.weather && (
                        <div className="briefing-weather">
                            <span className="weather-temp text-title-lg">{data.weather.temp}°</span>
                            <span className="weather-condition text-caption">{data.weather.condition}</span>
                        </div>
                    )}
                </div>

                {/* Stats Row */}
                <div className="briefing-stats">
                    <div className="briefing-stat">
                        <span className="stat-number text-title-md">{data.tasksToday}</span>
                        <span className="stat-label text-caption">Tasks today</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="briefing-stat">
                        <span className="stat-number text-title-md">{data.streak}</span>
                        <span className="stat-label text-caption">Day streak 🔥</span>
                    </div>
                </div>

                {/* Top Priority */}
                {data.topPriority && (
                    <div className="briefing-priority">
                        <span className="priority-label text-caption">Top Priority</span>
                        <div className="priority-task">
                            <span className="priority-title">{data.topPriority.title}</span>
                            {data.topPriority.time && (
                                <span className="priority-time text-caption">{data.topPriority.time}</span>
                            )}
                        </div>
                    </div>
                )}

                {/* Insight */}
                {data.insight && (
                    <div className="briefing-insight">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                            <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.9V17h8v-2.1A7 7 0 0 0 12 2z" />
                        </svg>
                        <span className="text-caption">{data.insight}</span>
                    </div>
                )}
            </Card>
        </motion.div>
    )
}

export default DailyBriefing
