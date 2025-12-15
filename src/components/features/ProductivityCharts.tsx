import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface DailyData {
    date: string
    completed: number
    total: number
}

interface CategoryData {
    name: string
    value: number
    color: string
}

interface ProductivityChartsProps {
    weeklyData?: DailyData[]
    categoryBreakdown?: CategoryData[]
    monthlyTrend?: number[] // Last 30 days completion rate
}

// Generate sample data if not provided
const generateSampleData = (): { weekly: DailyData[]; categories: CategoryData[]; trend: number[] } => {
    const today = new Date()
    const weekly: DailyData[] = []
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today)
        date.setDate(date.getDate() - i)
        weekly.push({
            date: date.toLocaleDateString('en-US', { weekday: 'short' }),
            completed: Math.floor(Math.random() * 8) + 2,
            total: Math.floor(Math.random() * 4) + 8,
        })
    }

    const categories: CategoryData[] = [
        { name: 'Work', value: 45, color: '#A79BFF' },
        { name: 'Personal', value: 25, color: '#78D4C2' },
        { name: 'Health', value: 15, color: '#79DCA0' },
        { name: 'Learning', value: 15, color: '#F0C474' },
    ]

    const trend = Array.from({ length: 30 }, () => Math.floor(Math.random() * 40) + 60)

    return { weekly, categories, trend }
}

export function ProductivityCharts({
    weeklyData,
    categoryBreakdown,
    monthlyTrend,
}: ProductivityChartsProps) {
    const sampleData = useMemo(() => generateSampleData(), [])
    const weekly = weeklyData || sampleData.weekly
    const categories = categoryBreakdown || sampleData.categories
    const trend = monthlyTrend || sampleData.trend

    // Calculate max for scaling
    const maxCompleted = Math.max(...weekly.map(d => d.completed))

    // Calculate pie chart segments
    const total = categories.reduce((sum, c) => sum + c.value, 0)
    let cumulativePercent = 0
    const pieSegments = categories.map(cat => {
        const percent = (cat.value / total) * 100
        const startPercent = cumulativePercent
        cumulativePercent += percent
        return { ...cat, startPercent, percent }
    })

    // Calculate trend stats
    const avgTrend = Math.round(trend.reduce((a, b) => a + b, 0) / trend.length)
    const trendChange = trend[trend.length - 1] - trend[0]

    return (
        <div className="productivity-charts">
            {/* Weekly Bar Chart */}
            <div className="chart-card">
                <h3 className="chart-title">Weekly Progress</h3>
                <div className="bar-chart">
                    {weekly.map((day, i) => (
                        <div key={day.date} className="bar-column">
                            <div className="bar-container">
                                <motion.div
                                    className="bar-fill"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(day.completed / maxCompleted) * 100}%` }}
                                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                />
                                <motion.div
                                    className="bar-target"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(day.total / 12) * 100}%` }}
                                    transition={{ delay: i * 0.1 + 0.1, duration: 0.5 }}
                                />
                            </div>
                            <span className="bar-value">{day.completed}</span>
                            <span className="bar-label">{day.date}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Pie Chart */}
            <div className="chart-card">
                <h3 className="chart-title">Tasks by Category</h3>
                <div className="pie-chart-container">
                    <svg className="pie-chart" viewBox="0 0 100 100">
                        {pieSegments.map((seg, i) => {
                            const radius = 40
                            const circumference = 2 * Math.PI * radius
                            const strokeDasharray = `${(seg.percent / 100) * circumference} ${circumference}`
                            const strokeDashoffset = -(seg.startPercent / 100) * circumference

                            return (
                                <motion.circle
                                    key={seg.name}
                                    cx="50"
                                    cy="50"
                                    r={radius}
                                    fill="none"
                                    stroke={seg.color}
                                    strokeWidth="20"
                                    strokeDasharray={strokeDasharray}
                                    strokeDashoffset={strokeDashoffset}
                                    transform="rotate(-90 50 50)"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.15 }}
                                />
                            )
                        })}
                        <text x="50" y="48" textAnchor="middle" className="pie-center-value">
                            {total}
                        </text>
                        <text x="50" y="58" textAnchor="middle" className="pie-center-label">
                            tasks
                        </text>
                    </svg>

                    <div className="pie-legend">
                        {categories.map(cat => (
                            <div key={cat.name} className="legend-item">
                                <span className="legend-dot" style={{ background: cat.color }} />
                                <span className="legend-name">{cat.name}</span>
                                <span className="legend-value">{cat.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Monthly Trend Line */}
            <div className="chart-card wide">
                <div className="chart-header">
                    <h3 className="chart-title">30-Day Completion Rate</h3>
                    <div className="trend-stats">
                        <span className="trend-avg">{avgTrend}% avg</span>
                        <span className={`trend-change ${trendChange >= 0 ? 'up' : 'down'}`}>
                            {trendChange >= 0 ? '↑' : '↓'} {Math.abs(trendChange)}%
                        </span>
                    </div>
                </div>
                <div className="line-chart">
                    <svg className="trend-svg" viewBox="0 0 300 80" preserveAspectRatio="none">
                        {/* Grid Lines */}
                        {[0, 25, 50, 75, 100].map(y => (
                            <line
                                key={y}
                                x1="0"
                                y1={80 - (y / 100) * 80}
                                x2="300"
                                y2={80 - (y / 100) * 80}
                                stroke="var(--border-default)"
                                strokeWidth="0.5"
                            />
                        ))}

                        {/* Area Fill */}
                        <motion.path
                            d={`M0,80 ${trend.map((val, i) => `L${(i / (trend.length - 1)) * 300},${80 - (val / 100) * 70}`).join(' ')} L300,80 Z`}
                            fill="url(#trendGradient)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1 }}
                        />

                        {/* Line */}
                        <motion.path
                            d={`M${trend.map((val, i) => `${(i / (trend.length - 1)) * 300},${80 - (val / 100) * 70}`).join(' L')}`}
                            fill="none"
                            stroke="var(--accent-primary)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        />

                        {/* Gradient Definition */}
                        <defs>
                            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Current Value Indicator */}
                    <div
                        className="current-indicator"
                        style={{ left: `${100}%` }}
                    >
                        <div className="indicator-dot" />
                        <span className="indicator-value">{trend[trend.length - 1]}%</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductivityCharts
