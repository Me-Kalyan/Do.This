// Push Notification Service for Do.This
// Handles service worker registration, permission requests, and notifications

export interface NotificationOptions {
    title: string
    body: string
    icon?: string
    badge?: string
    tag?: string
    data?: Record<string, unknown>
    requireInteraction?: boolean
    actions?: NotificationAction[]
}

interface NotificationAction {
    action: string
    title: string
    icon?: string
}

class PushNotificationService {
    private registration: ServiceWorkerRegistration | null = null
    private permission: NotificationPermission = 'default'

    constructor() {
        this.init()
    }

    private async init() {
        // Check if notifications are supported
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications')
            return
        }

        // Get current permission status
        this.permission = Notification.permission

        // Register service worker if supported
        if ('serviceWorker' in navigator) {
            try {
                this.registration = await navigator.serviceWorker.register('/sw.js')
                console.log('Service Worker registered:', this.registration)
            } catch (error) {
                console.error('Service Worker registration failed:', error)
            }
        }
    }

    // Check if notifications are supported
    isSupported(): boolean {
        return 'Notification' in window
    }

    // Get current permission status
    getPermission(): NotificationPermission {
        return this.permission
    }

    // Request notification permission
    async requestPermission(): Promise<NotificationPermission> {
        if (!this.isSupported()) {
            return 'denied'
        }

        try {
            this.permission = await Notification.requestPermission()
            return this.permission
        } catch (error) {
            console.error('Error requesting notification permission:', error)
            return 'denied'
        }
    }

    // Show a notification
    async notify(options: NotificationOptions): Promise<boolean> {
        if (!this.isSupported()) {
            console.warn('Notifications not supported')
            return false
        }

        if (this.permission !== 'granted') {
            const newPermission = await this.requestPermission()
            if (newPermission !== 'granted') {
                console.warn('Notification permission not granted')
                return false
            }
        }

        try {
            // Use service worker if available for better reliability
            if (this.registration) {
                await this.registration.showNotification(options.title, {
                    body: options.body,
                    icon: options.icon || '/icon-192.png',
                    badge: options.badge || '/icon-72.png',
                    tag: options.tag,
                    data: options.data,
                    requireInteraction: options.requireInteraction,
                    // Actions are supported by service worker notifications but not in base type
                    ...(options.actions && { actions: options.actions }),
                } as NotificationOptions)
            } else {
                // Fallback to regular Notification API
                new Notification(options.title, {
                    body: options.body,
                    icon: options.icon || '/icon-192.png',
                    tag: options.tag,
                    data: options.data,
                    requireInteraction: options.requireInteraction,
                })
            }
            return true
        } catch (error) {
            console.error('Error showing notification:', error)
            return false
        }
    }

    // Schedule a notification for a specific time
    scheduleNotification(options: NotificationOptions, triggerTime: Date): number {
        const now = new Date()
        const delay = triggerTime.getTime() - now.getTime()

        if (delay <= 0) {
            console.warn('Trigger time is in the past')
            return -1
        }

        const timeoutId = window.setTimeout(() => {
            this.notify(options)
        }, delay)

        return timeoutId
    }

    // Cancel a scheduled notification
    cancelScheduledNotification(timeoutId: number): void {
        window.clearTimeout(timeoutId)
    }

    // Task-specific notification helpers
    async notifyTaskReminder(taskTitle: string, dueTime: string): Promise<boolean> {
        return this.notify({
            title: 'Task Reminder',
            body: `"${taskTitle}" is due at ${dueTime}`,
            icon: '/icon-192.png',
            tag: `task-reminder-${taskTitle}`,
            requireInteraction: true,
            actions: [
                { action: 'complete', title: 'Mark Complete' },
                { action: 'snooze', title: 'Snooze 15m' },
            ],
        })
    }

    async notifyTaskCompleted(taskTitle: string): Promise<boolean> {
        return this.notify({
            title: 'Task Completed! ✓',
            body: `Great job completing "${taskTitle}"`,
            icon: '/icon-192.png',
            tag: 'task-completed',
        })
    }

    async notifyDailyBriefing(taskCount: number): Promise<boolean> {
        return this.notify({
            title: 'Good Morning! ☀️',
            body: `You have ${taskCount} tasks scheduled for today`,
            icon: '/icon-192.png',
            tag: 'daily-briefing',
            requireInteraction: true,
        })
    }

    async notifyStreak(streakDays: number): Promise<boolean> {
        return this.notify({
            title: 'Streak Milestone! 🔥',
            body: `Amazing! You've maintained a ${streakDays}-day streak`,
            icon: '/icon-192.png',
            tag: 'streak-milestone',
        })
    }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService()

// Export class for custom instances
export { PushNotificationService }
