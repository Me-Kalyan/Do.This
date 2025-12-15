import { useState, useEffect, useCallback } from 'react'
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    onSnapshot,
    Timestamp,
    serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/lib/firebase'
import { useAuth } from './useAuth'

// Task interface for the app
export interface Task {
    id: string
    title: string
    description?: string | null
    completed: boolean
    dueDate?: Date | null
    dueTime?: string | null
    priority?: 'low' | 'medium' | 'high'
    category?: string | null
    tags?: string[]
    recurrence?: 'none' | 'daily' | 'weekdays' | 'weekly' | 'biweekly' | 'monthly' | null
    createdAt: Date
    updatedAt: Date
    completedAt?: Date | null
    userId: string
}



// Main hook for tasks
export function useTasks() {
    const { user } = useAuth()
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        // Not logged in - no tasks
        if (!user) {
            setTasks([])
            setLoading(false)
            return
        }

        // Firebase not configured - use localStorage
        if (!isFirebaseConfigured) {
            console.log('Firebase not configured, using localStorage')
            const stored = localStorage.getItem('local-tasks')
            if (stored) {
                try {
                    const parsed = JSON.parse(stored)
                    setTasks(parsed.map((t: Task) => ({
                        ...t,
                        dueDate: t.dueDate ? new Date(t.dueDate) : null,
                        createdAt: new Date(t.createdAt),
                        updatedAt: new Date(t.updatedAt),
                        completedAt: t.completedAt ? new Date(t.completedAt) : null,
                    })))
                } catch {
                    setTasks([])
                }
            }
            setLoading(false)
            return
        }

        // Real Firebase - set up real-time listener
        console.log('Setting up Firestore listener for user:', user.uid)
        const tasksRef = collection(db!, 'tasks')

        // Simple query without orderBy to avoid index requirement
        const q = query(
            tasksRef,
            where('userId', '==', user.uid)
        )

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                console.log('Firestore snapshot received:', snapshot.docs.length, 'tasks')
                const taskList: Task[] = snapshot.docs.map((doc) => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        title: data.title,
                        description: data.description,
                        completed: data.completed,
                        dueDate: data.dueDate?.toDate() || null,
                        dueTime: data.dueTime,
                        priority: data.priority,
                        category: data.category,
                        tags: data.tags,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        updatedAt: data.updatedAt?.toDate() || new Date(),
                        completedAt: data.completedAt?.toDate() || null,
                        userId: data.userId,
                    }
                })
                // Sort by createdAt in memory (descending - newest first)
                taskList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                setTasks(taskList)
                setLoading(false)
            },
            (err) => {
                console.error('Firestore error:', err)
                setError(err)
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [user])

    // Save tasks to localStorage (for non-Firebase mode)
    const saveLocalTasks = useCallback((newTasks: Task[]) => {
        localStorage.setItem('local-tasks', JSON.stringify(newTasks))
    }, [])

    // Add a new task
    const addTask = useCallback(async (taskData: Partial<Task>) => {
        if (!user) {
            console.error('Cannot add task: not authenticated')
            throw new Error('Not authenticated')
        }

        const now = new Date()
        const newTask: Omit<Task, 'id'> = {
            title: taskData.title || 'Untitled Task',
            description: taskData.description || null,
            completed: false,
            dueDate: taskData.dueDate || null,
            dueTime: taskData.dueTime || null,
            priority: taskData.priority || 'medium',
            category: taskData.category || null,
            tags: taskData.tags || [],
            recurrence: taskData.recurrence || null,
            createdAt: now,
            updatedAt: now,
            userId: user.uid,
        }

        // Local storage mode
        if (!isFirebaseConfigured) {
            const localTask: Task = {
                ...newTask,
                id: `local-${Date.now()}`,
            }
            const newTasks = [localTask, ...tasks]
            setTasks(newTasks)
            saveLocalTasks(newTasks)
            console.log('Task added to localStorage:', localTask.title)
            return localTask
        }

        // Firebase mode
        try {
            console.log('Adding task to Firestore:', newTask.title)
            const tasksRef = collection(db!, 'tasks')
            const docRef = await addDoc(tasksRef, {
                ...newTask,
                dueDate: newTask.dueDate ? Timestamp.fromDate(newTask.dueDate) : null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
            console.log('Task added successfully with ID:', docRef.id)
            return { ...newTask, id: docRef.id }
        } catch (err) {
            console.error('Error adding task to Firestore:', err)
            throw err
        }
    }, [user, tasks, saveLocalTasks])

    // Update a task
    const updateTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
        if (!user) throw new Error('Not authenticated')

        // Local storage mode
        if (!isFirebaseConfigured) {
            const newTasks = tasks.map((t) =>
                t.id === taskId ? { ...t, ...updates, updatedAt: new Date() } : t
            )
            setTasks(newTasks)
            saveLocalTasks(newTasks)
            return
        }

        // Firebase mode
        try {
            const taskRef = doc(db!, 'tasks', taskId)
            await updateDoc(taskRef, {
                ...updates,
                dueDate: updates.dueDate ? Timestamp.fromDate(updates.dueDate) : null,
                updatedAt: serverTimestamp(),
            })
        } catch (err) {
            console.error('Error updating task:', err)
            throw err
        }
    }, [user, tasks, saveLocalTasks])

    // Complete/uncomplete a task
    const completeTask = useCallback(async (taskId: string) => {
        const task = tasks.find((t) => t.id === taskId)
        if (!task) return

        const isCompleting = !task.completed

        // Update the current task
        await updateTask(taskId, {
            completed: isCompleting,
            completedAt: isCompleting ? new Date() : null,
        })

        // Handle recurrence if we are completing the task
        if (isCompleting && task.recurrence && task.recurrence !== 'none') {
            try {
                let nextDate = task.dueDate ? new Date(task.dueDate) : new Date()

                // If it's overdue, start from today? Or strict schedule?
                // Loose schedule (from today) is often better for "Daily habits"
                // Strict schedule (from due date) is better for "Bills"
                // Let's use strict schedule based on Due Date, but fallback to today if missing

                // However, for consistency with most todo apps:
                // If I missed yesterday's daily task and do it today, I usually want tomorrow's task, not today's (which I just did).
                // So let's base it on TODAY if the due date was in the past?
                // Or safely: strict add. 
                // Let's stick to strict addition from the *current due date* to preserve the cadence. 
                // Except if no due date, use today.

                switch (task.recurrence) {
                    case 'daily':
                        nextDate.setDate(nextDate.getDate() + 1)
                        break
                    case 'weekdays':
                        do {
                            nextDate.setDate(nextDate.getDate() + 1)
                        } while (nextDate.getDay() === 0 || nextDate.getDay() === 6)
                        break
                    case 'weekly':
                        nextDate.setDate(nextDate.getDate() + 7)
                        break
                    case 'biweekly':
                        nextDate.setDate(nextDate.getDate() + 14)
                        break
                    case 'monthly':
                        nextDate.setMonth(nextDate.getMonth() + 1)
                        break
                }

                console.log(`Creating next recurring instance for ${task.title} on ${nextDate}`)

                await addTask({
                    title: task.title,
                    description: task.description,
                    priority: task.priority,
                    category: task.category,
                    tags: task.tags,
                    recurrence: task.recurrence,
                    dueDate: nextDate,
                    dueTime: task.dueTime,
                    // New task starts fresh
                    completed: false,
                })
            } catch (err) {
                console.error('Failed to create recurring task:', err)
                // Don't throw, as the main completion succeeded
            }
        }
    }, [tasks, updateTask, addTask])

    // Delete a task
    const deleteTask = useCallback(async (taskId: string) => {
        if (!user) throw new Error('Not authenticated')

        // Local storage mode
        if (!isFirebaseConfigured) {
            const newTasks = tasks.filter((t) => t.id !== taskId)
            setTasks(newTasks)
            saveLocalTasks(newTasks)
            return
        }

        // Firebase mode
        try {
            const taskRef = doc(db!, 'tasks', taskId)
            await deleteDoc(taskRef)
        } catch (err) {
            console.error('Error deleting task:', err)
            throw err
        }
    }, [user, tasks, saveLocalTasks])

    return {
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        completeTask,
        deleteTask,
        // Computed properties
        todayTasks: tasks.filter((t) => {
            if (!t.dueDate) return false
            const today = new Date()
            return t.dueDate.toDateString() === today.toDateString()
        }),
        completedTasks: tasks.filter((t) => t.completed),
        pendingTasks: tasks.filter((t) => !t.completed),
    }
}

export default useTasks
