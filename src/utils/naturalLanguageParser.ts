// Natural Language Parser for Do.This
// Parses phrases like "call mom tomorrow at 3pm" into structured task data

export interface ParsedTask {
    title: string
    date?: Date
    time?: string
    priority?: 'low' | 'medium' | 'high'
    project?: string
    duration?: number // in minutes
    recurrence?: 'daily' | 'weekly' | 'monthly'
}

interface ParseResult {
    success: boolean
    task: ParsedTask
    confidence: number // 0-1
    suggestions?: string[]
}

// Date keywords mapping
const DATE_KEYWORDS: Record<string, () => Date> = {
    'today': () => new Date(),
    'tomorrow': () => {
        const d = new Date()
        d.setDate(d.getDate() + 1)
        return d
    },
    'yesterday': () => {
        const d = new Date()
        d.setDate(d.getDate() - 1)
        return d
    },
    'next week': () => {
        const d = new Date()
        d.setDate(d.getDate() + 7)
        return d
    },
    'next month': () => {
        const d = new Date()
        d.setMonth(d.getMonth() + 1)
        return d
    },
}

// Day names
const DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

// Priority keywords
const PRIORITY_KEYWORDS: Record<string, 'low' | 'medium' | 'high'> = {
    'urgent': 'high',
    'important': 'high',
    'critical': 'high',
    'high priority': 'high',
    'asap': 'high',
    'low priority': 'low',
    'whenever': 'low',
    'eventually': 'low',
    'someday': 'low',
}

// Recurrence patterns
const RECURRENCE_PATTERNS: Record<string, 'daily' | 'weekly' | 'monthly'> = {
    'every day': 'daily',
    'daily': 'daily',
    'everyday': 'daily',
    'each day': 'daily',
    'every week': 'weekly',
    'weekly': 'weekly',
    'each week': 'weekly',
    'every month': 'monthly',
    'monthly': 'monthly',
    'each month': 'monthly',
}

// Duration patterns
const DURATION_PATTERN = /(\d+)\s*(min(?:ute)?s?|hours?|hrs?|h|m)/i

// Time patterns
const TIME_PATTERNS = [
    /at\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i,
    /(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i,
    /by\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i,
]

// Project/tag patterns
const PROJECT_PATTERN = /#(\w+)/g
// TAG_PATTERN reserved for future use

export function parseNaturalLanguage(input: string): ParseResult {
    const inputLower = input.toLowerCase().trim()
    let title = input.trim()
    let date: Date | undefined
    let time: string | undefined
    let priority: 'low' | 'medium' | 'high' | undefined
    let project: string | undefined
    let duration: number | undefined
    let recurrence: 'daily' | 'weekly' | 'monthly' | undefined
    let confidence = 0.5

    // Extract project tags
    const projectMatch = input.match(PROJECT_PATTERN)
    if (projectMatch) {
        project = projectMatch[0].substring(1)
        title = title.replace(PROJECT_PATTERN, '').trim()
        confidence += 0.1
    }

    // Extract recurrence
    for (const [pattern, rec] of Object.entries(RECURRENCE_PATTERNS)) {
        if (inputLower.includes(pattern)) {
            recurrence = rec
            title = title.replace(new RegExp(pattern, 'gi'), '').trim()
            confidence += 0.1
            break
        }
    }

    // Extract priority
    for (const [keyword, pri] of Object.entries(PRIORITY_KEYWORDS)) {
        if (inputLower.includes(keyword)) {
            priority = pri
            title = title.replace(new RegExp(keyword, 'gi'), '').trim()
            confidence += 0.1
            break
        }
    }

    // Extract duration
    const durationMatch = inputLower.match(DURATION_PATTERN)
    if (durationMatch) {
        const value = parseInt(durationMatch[1])
        const unit = durationMatch[2].toLowerCase()
        if (unit.startsWith('h')) {
            duration = value * 60
        } else {
            duration = value
        }
        title = title.replace(DURATION_PATTERN, '').trim()
        confidence += 0.1
    }

    // Extract time
    for (const pattern of TIME_PATTERNS) {
        const timeMatch = inputLower.match(pattern)
        if (timeMatch) {
            let hours = parseInt(timeMatch[1])
            const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0
            const ampm = timeMatch[3]?.toLowerCase()

            if (ampm === 'pm' && hours < 12) hours += 12
            if (ampm === 'am' && hours === 12) hours = 0

            time = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
            title = title.replace(pattern, '').trim()
            confidence += 0.15
            break
        }
    }

    // Extract date keywords
    for (const [keyword, getDate] of Object.entries(DATE_KEYWORDS)) {
        if (inputLower.includes(keyword)) {
            date = getDate()
            title = title.replace(new RegExp(keyword, 'gi'), '').trim()
            confidence += 0.15
            break
        }
    }

    // Check for day names (next monday, this friday, etc.)
    if (!date) {
        for (let i = 0; i < DAYS.length; i++) {
            const day = DAYS[i]
            const patterns = [
                new RegExp(`next\\s+${day}`, 'i'),
                new RegExp(`this\\s+${day}`, 'i'),
                new RegExp(`on\\s+${day}`, 'i'),
                new RegExp(`${day}`, 'i'),
            ]

            for (const pattern of patterns) {
                if (pattern.test(inputLower)) {
                    const today = new Date()
                    const todayDay = today.getDay()
                    let daysUntil = i - todayDay

                    // If it's in the past this week, go to next week
                    if (daysUntil <= 0) daysUntil += 7

                    // If pattern includes "next", add another week
                    if (pattern.source.includes('next')) daysUntil += 7

                    date = new Date()
                    date.setDate(today.getDate() + daysUntil)
                    title = title.replace(pattern, '').trim()
                    confidence += 0.1
                    break
                }
            }
            if (date) break
        }
    }

    // Check for date patterns like "Dec 25" or "12/25"
    const monthDatePattern = /(?:on\s+)?(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})(?:st|nd|rd|th)?/i
    const numericDatePattern = /(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/

    const monthMatch = inputLower.match(monthDatePattern)
    if (monthMatch && !date) {
        const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
        const monthStr = monthMatch[0].match(/^(?:on\s+)?(\w+)/i)?.[1].toLowerCase().slice(0, 3)
        const monthIndex = months.findIndex(m => monthStr?.startsWith(m))
        const day = parseInt(monthMatch[1])

        if (monthIndex >= 0) {
            date = new Date()
            date.setMonth(monthIndex)
            date.setDate(day)
            // If date is in the past, assume next year
            if (date < new Date()) date.setFullYear(date.getFullYear() + 1)
            title = title.replace(monthDatePattern, '').trim()
            confidence += 0.1
        }
    }

    const numMatch = input.match(numericDatePattern)
    if (numMatch && !date) {
        const month = parseInt(numMatch[1]) - 1
        const day = parseInt(numMatch[2])
        const year = numMatch[3] ? parseInt(numMatch[3]) : new Date().getFullYear()
        date = new Date(year < 100 ? 2000 + year : year, month, day)
        title = title.replace(numericDatePattern, '').trim()
        confidence += 0.1
    }

    // Clean up title
    title = title
        .replace(/\s+/g, ' ')
        .replace(/^(to|and|the|a)\s+/i, '')
        .replace(/\s+(to|and|the|a)$/i, '')
        .trim()

    // Capitalize first letter
    if (title.length > 0) {
        title = title.charAt(0).toUpperCase() + title.slice(1)
    }

    // Cap confidence
    confidence = Math.min(confidence, 1)

    return {
        success: title.length > 0,
        task: {
            title,
            date,
            time,
            priority,
            project,
            duration,
            recurrence,
        },
        confidence,
        suggestions: generateSuggestions(title, date, time),
    }
}

function generateSuggestions(title: string, date?: Date, time?: string): string[] {
    const suggestions: string[] = []

    if (!date) {
        suggestions.push('Add "tomorrow" or "next monday" for scheduling')
    }
    if (!time) {
        suggestions.push('Add "at 3pm" to set a specific time')
    }
    if (title.length < 5) {
        suggestions.push('Consider adding more details to your task')
    }

    return suggestions
}

// Smart input component helper
export function getSmartInputPlaceholders(): string[] {
    return [
        'Call mom tomorrow at 3pm',
        'Finish report by Friday',
        'Team meeting every Monday at 10am',
        'Buy groceries #shopping',
        'Workout for 30 minutes daily',
        'Submit proposal next week urgent',
    ]
}

export default parseNaturalLanguage
