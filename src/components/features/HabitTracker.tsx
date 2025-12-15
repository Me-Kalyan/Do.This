import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface Habit {
    id: string
    name: string
    emoji: string
    color?: string
    frequency: 'daily' | 'weekly' | 'custom'
    targetDays?: number[] // For weekly: 0-6, for custom: list of days
    completedDates: string[] // ISO date strings
    createdAt: Date
    archived?: boolean
}

interface HabitTrackerProps {
    habits: Habit[]
    onToggleCompletion: (habitId: string, date: string) => void
    onAddHabit?: (habit: Omit<Habit, 'id' | 'completedDates' | 'createdAt'>) => void
    onDeleteHabit?: (habitId: string) => void
}

const DAYS_TO_SHOW = 7 // Show last 7 days

export function HabitTracker({
    habits,
    onToggleCompletion,
    onAddHabit,
    onDeleteHabit,
}: HabitTrackerProps) {
    const [showAddModal, setShowAddModal] = useState(false)
    const [newHabit, setNewHabit] = useState({ name: '', emoji: '✨', color: '#A79BFF' })

    // Generate last N days
    const dates = useMemo(() => {
        const result: { date: string; dayName: string; dayNum: number; isToday: boolean }[] = []
        const today = new Date()

        for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
            const date = new Date(today)
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]
            result.push({
                date: dateStr,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNum: date.getDate(),
                isToday: i === 0,
            })
        }
        return result
    }, [])

    // Calculate streak for a habit
    const getStreak = (habit: Habit): number => {
        const sortedDates = [...habit.completedDates].sort().reverse()
        let streak = 0
        const today = new Date()

        for (let i = 0; i <= 365; i++) {
            const checkDate = new Date(today)
            checkDate.setDate(checkDate.getDate() - i)
            const dateStr = checkDate.toISOString().split('T')[0]

            if (sortedDates.includes(dateStr)) {
                streak++
            } else if (i > 0) {
                // Allow missing today, but break on other missing days
                break
            }
        }
        return streak
    }

    // Calculate completion rate
    const getCompletionRate = (habit: Habit): number => {
        const daysSinceCreation = Math.floor(
            (new Date().getTime() - habit.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1
        const expectedDays = Math.min(daysSinceCreation, 30) // Cap at 30 days
        return Math.round((habit.completedDates.length / expectedDays) * 100)
    }

    const handleAddHabit = () => {
        if (newHabit.name.trim() && onAddHabit) {
            onAddHabit({
                name: newHabit.name,
                emoji: newHabit.emoji,
                color: newHabit.color,
                frequency: 'daily',
            })
            setNewHabit({ name: '', emoji: '✨', color: '#A79BFF' })
            setShowAddModal(false)
        }
    }

    // todayStr reserved for future filtering

    return (
        <div className="habit-tracker">
            <div className="habit-header">
                <h2 className="habit-title">Habits</h2>
                {onAddHabit && (
                    <button className="add-habit-btn" onClick={() => setShowAddModal(true)}>
                        <svg width="16" height="16" viewBox="0 0 16 16">
                            <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        Add Habit
                    </button>
                )}
            </div>

            {/* Date Headers */}
            <div className="date-headers">
                <div className="habit-name-col">Habit</div>
                {dates.map(d => (
                    <div key={d.date} className={`date-col ${d.isToday ? 'today' : ''}`}>
                        <span className="day-name">{d.dayName}</span>
                        <span className="day-num">{d.dayNum}</span>
                    </div>
                ))}
                <div className="streak-col">Streak</div>
            </div>

            {/* Habits Grid */}
            <div className="habits-grid">
                <AnimatePresence>
                    {habits.filter(h => !h.archived).map(habit => {
                        const streak = getStreak(habit)
                        const rate = getCompletionRate(habit)

                        return (
                            <motion.div
                                key={habit.id}
                                className="habit-row"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                layout
                            >
                                <div className="habit-info">
                                    <span className="habit-emoji">{habit.emoji}</span>
                                    <div className="habit-details">
                                        <span className="habit-name">{habit.name}</span>
                                        <span className="habit-rate">{rate}% this month</span>
                                    </div>
                                    {onDeleteHabit && (
                                        <button
                                            className="delete-habit"
                                            onClick={() => onDeleteHabit(habit.id)}
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>

                                {dates.map(d => {
                                    const isCompleted = habit.completedDates.includes(d.date)
                                    return (
                                        <motion.button
                                            key={d.date}
                                            className={`day-cell ${isCompleted ? 'completed' : ''} ${d.isToday ? 'today' : ''}`}
                                            onClick={() => onToggleCompletion(habit.id, d.date)}
                                            whileTap={{ scale: 0.9 }}
                                            style={{
                                                borderColor: isCompleted ? habit.color : undefined,
                                                backgroundColor: isCompleted ? `${habit.color}22` : undefined,
                                            }}
                                        >
                                            {isCompleted && (
                                                <motion.svg
                                                    width="16"
                                                    height="16"
                                                    viewBox="0 0 16 16"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    style={{ color: habit.color }}
                                                >
                                                    <path d="M4 8L7 11L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                                </motion.svg>
                                            )}
                                        </motion.button>
                                    )
                                })}

                                <div className={`streak-badge ${streak >= 7 ? 'fire' : streak >= 3 ? 'warm' : ''}`}>
                                    {streak >= 3 && <span className="streak-icon">🔥</span>}
                                    <span className="streak-num">{streak}</span>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>

                {habits.length === 0 && (
                    <div className="empty-habits">
                        <span className="empty-icon">🎯</span>
                        <p>No habits yet</p>
                        <span className="empty-hint">Start building positive routines</span>
                    </div>
                )}
            </div>

            {/* Add Habit Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        className="modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            className="add-habit-modal"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <h3>New Habit</h3>

                            <div className="habit-form">
                                <div className="emoji-picker">
                                    {['✨', '💪', '📚', '🏃', '🧘', '💧', '🥗', '😴', '📝', '🎨'].map(emoji => (
                                        <button
                                            key={emoji}
                                            className={`emoji-btn ${newHabit.emoji === emoji ? 'selected' : ''}`}
                                            onClick={() => setNewHabit(p => ({ ...p, emoji }))}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>

                                <input
                                    type="text"
                                    placeholder="Habit name..."
                                    value={newHabit.name}
                                    onChange={e => setNewHabit(p => ({ ...p, name: e.target.value }))}
                                    autoFocus
                                />

                                <div className="color-picker">
                                    {['#A79BFF', '#78D4C2', '#F0C474', '#E08484', '#84B5E0'].map(color => (
                                        <button
                                            key={color}
                                            className={`color-btn ${newHabit.color === color ? 'selected' : ''}`}
                                            style={{ background: color }}
                                            onClick={() => setNewHabit(p => ({ ...p, color }))}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button className="cancel-btn" onClick={() => setShowAddModal(false)}>
                                    Cancel
                                </button>
                                <button className="save-btn" onClick={handleAddHabit}>
                                    Add Habit
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default HabitTracker
