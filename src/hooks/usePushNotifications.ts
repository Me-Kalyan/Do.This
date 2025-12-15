import { useState, useEffect, useCallback } from 'react'
import { pushNotificationService } from '@/services/pushNotifications'

interface UsePushNotificationsReturn {
    isSupported: boolean
    permission: NotificationPermission
    requestPermission: () => Promise<NotificationPermission>
    notifyTaskReminder: (taskTitle: string, dueTime: string) => Promise<boolean>
    notifyTaskCompleted: (taskTitle: string) => Promise<boolean>
    notifyDailyBriefing: (taskCount: number) => Promise<boolean>
    notifyStreak: (streakDays: number) => Promise<boolean>
    scheduleReminder: (taskTitle: string, dueTime: Date) => number
    cancelReminder: (timeoutId: number) => void
}

export function usePushNotifications(): UsePushNotificationsReturn {
    const [permission, setPermission] = useState<NotificationPermission>(
        pushNotificationService.getPermission()
    )
    const [isSupported] = useState(pushNotificationService.isSupported())

    useEffect(() => {
        // Update permission state when it changes
        const checkPermission = () => {
            setPermission(pushNotificationService.getPermission())
        }

        // Check permission on mount
        checkPermission()
    }, [])

    const requestPermission = useCallback(async () => {
        const newPermission = await pushNotificationService.requestPermission()
        setPermission(newPermission)
        return newPermission
    }, [])

    const notifyTaskReminder = useCallback(async (taskTitle: string, dueTime: string) => {
        return pushNotificationService.notifyTaskReminder(taskTitle, dueTime)
    }, [])

    const notifyTaskCompleted = useCallback(async (taskTitle: string) => {
        return pushNotificationService.notifyTaskCompleted(taskTitle)
    }, [])

    const notifyDailyBriefing = useCallback(async (taskCount: number) => {
        return pushNotificationService.notifyDailyBriefing(taskCount)
    }, [])

    const notifyStreak = useCallback(async (streakDays: number) => {
        return pushNotificationService.notifyStreak(streakDays)
    }, [])

    const scheduleReminder = useCallback((taskTitle: string, dueTime: Date) => {
        return pushNotificationService.scheduleNotification(
            {
                title: 'Task Reminder',
                body: `"${taskTitle}" is due now`,
                icon: '/icon-192.png',
                requireInteraction: true,
            },
            dueTime
        )
    }, [])

    const cancelReminder = useCallback((timeoutId: number) => {
        pushNotificationService.cancelScheduledNotification(timeoutId)
    }, [])

    return {
        isSupported,
        permission,
        requestPermission,
        notifyTaskReminder,
        notifyTaskCompleted,
        notifyDailyBriefing,
        notifyStreak,
        scheduleReminder,
        cancelReminder,
    }
}
