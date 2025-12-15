import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Widget Types
export interface Widget {
    id: string
    type: 'weather' | 'quote' | 'calendar' | 'stats' | 'clock' | 'greeting'
    position: { x: number; y: number }
    size: 'small' | 'medium' | 'large'
}

interface WidgetDashboardProps {
    widgets?: Widget[]
    userName?: string
    taskStats?: {
        completed: number
        pending: number
        streak: number
    }
}

// Inspirational quotes
const QUOTES = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
    { text: "Small daily improvements are the key to results.", author: "Unknown" },
    { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Productivity is never an accident.", author: "Paul J. Meyer" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
    { text: "Action is the foundational key to all success.", author: "Pablo Picasso" },
]

export function WidgetDashboard({
    widgets: _initialWidgets, // Reserved for future use
    userName = 'there',
    taskStats = { completed: 0, pending: 0, streak: 0 },
}: WidgetDashboardProps) {
    const [currentTime, setCurrentTime] = useState(new Date())
    const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)])

    // Update time every minute
    useEffect(() => {
        const interval = setInterval(() => setCurrentTime(new Date()), 60000)
        return () => clearInterval(interval)
    }, [])

    // Get greeting based on time
    const getGreeting = () => {
        const hour = currentTime.getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 17) return 'Good afternoon'
        if (hour < 21) return 'Good evening'
        return 'Good night'
    }

    // Format time
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        })
    }

    // Format date
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        })
    }

    // Get mini calendar data
    const getCalendarDays = () => {
        const today = new Date()
        const year = today.getFullYear()
        const month = today.getMonth()
        const firstDay = new Date(year, month, 1).getDay()
        const daysInMonth = new Date(year, month + 1, 0).getDate()

        const days: (number | null)[] = []
        for (let i = 0; i < firstDay; i++) days.push(null)
        for (let i = 1; i <= daysInMonth; i++) days.push(i)

        return { days, today: today.getDate(), month: today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }
    }

    const calendarData = getCalendarDays()

    return (
        <div className="widget-dashboard">
            {/* Greeting Widget */}
            <motion.div
                className="widget greeting-widget"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
            >
                <span className="greeting-time">{formatTime(currentTime)}</span>
                <h1 className="greeting-text">{getGreeting()}, {userName}</h1>
                <p className="greeting-date">{formatDate(currentTime)}</p>
            </motion.div>

            {/* Stats Widget */}
            <motion.div
                className="widget stats-widget"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3 className="widget-title">Today's Progress</h3>
                <div className="stats-grid">
                    <div className="stat-item">
                        <span className="stat-value">{taskStats.completed}</span>
                        <span className="stat-label">Completed</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value">{taskStats.pending}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-item streak">
                        <span className="stat-value">{taskStats.streak}🔥</span>
                        <span className="stat-label">Day Streak</span>
                    </div>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${(taskStats.completed / (taskStats.completed + taskStats.pending || 1)) * 100}%`
                        }}
                    />
                </div>
            </motion.div>

            {/* Quote Widget */}
            <motion.div
                className="widget quote-widget"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <span className="quote-icon">💭</span>
                <blockquote className="quote-text">"{quote.text}"</blockquote>
                <cite className="quote-author">— {quote.author}</cite>
            </motion.div>

            {/* Mini Calendar Widget */}
            <motion.div
                className="widget calendar-widget"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="widget-title">{calendarData.month}</h3>
                <div className="mini-calendar">
                    <div className="calendar-header">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                            <span key={i} className="cal-day-header">{day}</span>
                        ))}
                    </div>
                    <div className="calendar-days">
                        {calendarData.days.map((day, i) => (
                            <span
                                key={i}
                                className={`cal-day ${day === calendarData.today ? 'today' : ''} ${!day ? 'empty' : ''}`}
                            >
                                {day}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Weather Widget (Placeholder) */}
            <motion.div
                className="widget weather-widget"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <div className="weather-main">
                    <span className="weather-icon">☀️</span>
                    <span className="weather-temp">24°</span>
                </div>
                <div className="weather-details">
                    <span className="weather-condition">Sunny</span>
                    <span className="weather-location">Your Location</span>
                </div>
                <div className="weather-forecast">
                    <div className="forecast-day">
                        <span>Mon</span>
                        <span>🌤️</span>
                        <span>22°</span>
                    </div>
                    <div className="forecast-day">
                        <span>Tue</span>
                        <span>☁️</span>
                        <span>20°</span>
                    </div>
                    <div className="forecast-day">
                        <span>Wed</span>
                        <span>🌧️</span>
                        <span>18°</span>
                    </div>
                </div>
            </motion.div>

            {/* Quick Actions Widget */}
            <motion.div
                className="widget actions-widget"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
            >
                <h3 className="widget-title">Quick Actions</h3>
                <div className="quick-actions">
                    <button className="action-btn">
                        <span className="action-icon">➕</span>
                        <span>New Task</span>
                    </button>
                    <button className="action-btn">
                        <span className="action-icon">📝</span>
                        <span>Quick Note</span>
                    </button>
                    <button className="action-btn">
                        <span className="action-icon">📅</span>
                        <span>Schedule</span>
                    </button>
                    <button className="action-btn">
                        <span className="action-icon">🎯</span>
                        <span>Focus</span>
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default WidgetDashboard
