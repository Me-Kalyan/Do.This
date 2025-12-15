import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface CompletionData {
    date: string // ISO date string
    count: number
}

interface CompletionHeatmapProps {
    data?: CompletionData[]
    weeks?: number // How many weeks to show
    maxValue?: number // Cap for color intensity
}

export function CompletionHeatmap({
    data,
    weeks = 12,
    maxValue = 10,
}: CompletionHeatmapProps) {
    // Generate sample data if not provided
    const completionData = useMemo(() => {
        if (data) {
            const map: Record<string, number> = {}
            data.forEach(d => {
                map[d.date] = d.count
            })
            return map
        }

        // Generate random sample data
        const map: Record<string, number> = {}
        const today = new Date()
        for (let i = 0; i < weeks * 7; i++) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            // More completions on weekdays, random variation
            const isWeekend = date.getDay() === 0 || date.getDay() === 6
            const base = isWeekend ? 2 : 5
            map[dateStr] = Math.floor(Math.random() * base) + (isWeekend ? 0 : 1)
        }
        return map
    }, [data, weeks])

    // Generate calendar grid
    const calendarGrid = useMemo(() => {
        const grid: { date: string; count: number; dayOfWeek: number }[][] = []
        const today = new Date()
        const startDate = new Date(today)
        startDate.setDate(startDate.getDate() - (weeks * 7) + 1)

        // Align to week start (Sunday)
        startDate.setDate(startDate.getDate() - startDate.getDay())

        let currentWeek: { date: string; count: number; dayOfWeek: number }[] = []
        const current = new Date(startDate)

        while (current <= today) {
            const dateStr = current.toISOString().split('T')[0]
            currentWeek.push({
                date: dateStr,
                count: completionData[dateStr] || 0,
                dayOfWeek: current.getDay(),
            })

            if (current.getDay() === 6) {
                grid.push(currentWeek)
                currentWeek = []
            }

            current.setDate(current.getDate() + 1)
        }

        if (currentWeek.length > 0) {
            grid.push(currentWeek)
        }

        return grid
    }, [completionData, weeks])

    // Get color intensity based on count
    const getIntensity = (count: number) => {
        if (count === 0) return 0
        const normalized = Math.min(count / maxValue, 1)
        return Math.ceil(normalized * 4)
    }

    // Calculate stats
    const stats = useMemo(() => {
        const counts = Object.values(completionData)
        const total = counts.reduce((a, b) => a + b, 0)
        const activeDays = counts.filter(c => c > 0).length
        const currentStreak = calculateStreak(completionData)
        const longestStreak = calculateLongestStreak(completionData)

        return { total, activeDays, currentStreak, longestStreak }
    }, [completionData])

    // Get month labels
    const monthLabels = useMemo(() => {
        const labels: { month: string; position: number }[] = []
        let lastMonth = -1

        calendarGrid.forEach((week, i) => {
            const date = new Date(week[0]?.date || '')
            const month = date.getMonth()
            if (month !== lastMonth) {
                labels.push({
                    month: date.toLocaleDateString('en-US', { month: 'short' }),
                    position: i,
                })
                lastMonth = month
            }
        })

        return labels
    }, [calendarGrid])

    return (
        <div className="completion-heatmap">
            <div className="heatmap-header">
                <h3 className="heatmap-title">Activity</h3>
                <div className="heatmap-legend">
                    <span className="legend-label">Less</span>
                    <div className="legend-cells">
                        {[0, 1, 2, 3, 4].map(level => (
                            <div key={level} className={`legend-cell level-${level}`} />
                        ))}
                    </div>
                    <span className="legend-label">More</span>
                </div>
            </div>

            <div className="heatmap-grid-container">
                {/* Day labels */}
                <div className="day-labels">
                    <span></span>
                    <span>Mon</span>
                    <span></span>
                    <span>Wed</span>
                    <span></span>
                    <span>Fri</span>
                    <span></span>
                </div>

                <div className="heatmap-scroll">
                    {/* Month labels */}
                    <div className="month-labels" style={{ gridTemplateColumns: `repeat(${calendarGrid.length}, 14px)` }}>
                        {monthLabels.map((label, i) => (
                            <span
                                key={i}
                                className="month-label"
                                style={{ gridColumn: label.position + 1 }}
                            >
                                {label.month}
                            </span>
                        ))}
                    </div>

                    {/* Heatmap grid */}
                    <div
                        className="heatmap-grid"
                        style={{ gridTemplateColumns: `repeat(${calendarGrid.length}, 14px)` }}
                    >
                        {calendarGrid.map((week, weekIndex) => (
                            week.map((day, dayIndex) => (
                                <motion.div
                                    key={day.date}
                                    className={`heatmap-cell level-${getIntensity(day.count)}`}
                                    style={{ gridRow: day.dayOfWeek + 1 }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        delay: (weekIndex * 7 + dayIndex) * 0.003,
                                        duration: 0.2,
                                    }}
                                    title={`${day.date}: ${day.count} tasks`}
                                />
                            ))
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="heatmap-stats">
                <div className="stat">
                    <span className="stat-value">{stats.total}</span>
                    <span className="stat-label">Total Tasks</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{stats.activeDays}</span>
                    <span className="stat-label">Active Days</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{stats.currentStreak}🔥</span>
                    <span className="stat-label">Current Streak</span>
                </div>
                <div className="stat">
                    <span className="stat-value">{stats.longestStreak}</span>
                    <span className="stat-label">Longest Streak</span>
                </div>
            </div>
        </div>
    )
}

// Helper function to calculate current streak
function calculateStreak(data: Record<string, number>): number {
    let streak = 0
    const today = new Date()

    for (let i = 0; i <= 365; i++) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split('T')[0]

        if (data[dateStr] && data[dateStr] > 0) {
            streak++
        } else if (i > 0) {
            break
        }
    }

    return streak
}

// Helper function to calculate longest streak
function calculateLongestStreak(data: Record<string, number>): number {
    let longest = 0
    let current = 0

    const dates = Object.keys(data).sort()

    for (let i = 0; i < dates.length; i++) {
        if (data[dates[i]] > 0) {
            current++
            longest = Math.max(longest, current)
        } else {
            current = 0
        }
    }

    return longest
}

export default CompletionHeatmap
