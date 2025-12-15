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
    serverTimestamp,
} from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/lib/firebase'
import { useAuth } from './useAuth'

// Vault item interface
export interface VaultItem {
    id: string
    title: string
    content?: string | null
    type: 'note' | 'link' | 'file' | 'password'
    url?: string | null
    tags?: string[]
    isFavorite: boolean
    createdAt: Date
    updatedAt: Date
    userId: string
}

// Main hook for vault items
export function useVault() {
    const { user } = useAuth()
    const [items, setItems] = useState<VaultItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<Error | null>(null)

    useEffect(() => {
        if (!user) {
            setItems([])
            setLoading(false)
            return
        }

        // Firebase not configured - use localStorage
        if (!isFirebaseConfigured) {
            console.log('Firebase not configured for Vault, using localStorage')
            const stored = localStorage.getItem('local-vault')
            if (stored) {
                try {
                    const parsed = JSON.parse(stored)
                    setItems(parsed.map((item: VaultItem) => ({
                        ...item,
                        createdAt: new Date(item.createdAt),
                        updatedAt: new Date(item.updatedAt),
                    })))
                } catch {
                    setItems([])
                }
            }
            setLoading(false)
            return
        }

        // Real Firebase - set up real-time listener
        console.log('Setting up Vault listener for user:', user.uid)
        const vaultRef = collection(db, 'vault')
        const q = query(vaultRef, where('userId', '==', user.uid))

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                console.log('Vault snapshot received:', snapshot.docs.length, 'items')
                const itemList: VaultItem[] = snapshot.docs.map((doc) => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        title: data.title,
                        content: data.content,
                        type: data.type || 'note',
                        url: data.url,
                        tags: data.tags || [],
                        isFavorite: data.isFavorite || false,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        updatedAt: data.updatedAt?.toDate() || new Date(),
                        userId: data.userId,
                    }
                })
                // Sort by createdAt descending
                itemList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                setItems(itemList)
                setLoading(false)
            },
            (err) => {
                console.error('Vault error:', err)
                setError(err)
                setLoading(false)
            }
        )

        return () => unsubscribe()
    }, [user])

    // Save to localStorage
    const saveLocalItems = useCallback((newItems: VaultItem[]) => {
        localStorage.setItem('local-vault', JSON.stringify(newItems))
    }, [])

    // Add a new vault item
    const addItem = useCallback(async (itemData: Partial<VaultItem>) => {
        if (!user) throw new Error('Not authenticated')

        const now = new Date()
        const newItem: Omit<VaultItem, 'id'> = {
            title: itemData.title || 'Untitled',
            content: itemData.content || null,
            type: itemData.type || 'note',
            url: itemData.url || null,
            tags: itemData.tags || [],
            isFavorite: itemData.isFavorite || false,
            createdAt: now,
            updatedAt: now,
            userId: user.uid,
        }

        // Local storage mode
        if (!isFirebaseConfigured) {
            const localItem: VaultItem = {
                ...newItem,
                id: `local-${Date.now()}`,
            }
            const newItems = [localItem, ...items]
            setItems(newItems)
            saveLocalItems(newItems)
            return localItem
        }

        // Firebase mode
        try {
            console.log('Adding vault item:', newItem.title)
            const vaultRef = collection(db, 'vault')
            const docRef = await addDoc(vaultRef, {
                ...newItem,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            })
            console.log('Vault item added with ID:', docRef.id)
            return { ...newItem, id: docRef.id }
        } catch (err) {
            console.error('Error adding vault item:', err)
            throw err
        }
    }, [user, items, saveLocalItems])

    // Update an item
    const updateItem = useCallback(async (itemId: string, updates: Partial<VaultItem>) => {
        if (!user) throw new Error('Not authenticated')

        // Local storage mode
        if (!isFirebaseConfigured) {
            const newItems = items.map((item) =>
                item.id === itemId ? { ...item, ...updates, updatedAt: new Date() } : item
            )
            setItems(newItems)
            saveLocalItems(newItems)
            return
        }

        // Firebase mode
        try {
            const itemRef = doc(db, 'vault', itemId)
            await updateDoc(itemRef, {
                ...updates,
                updatedAt: serverTimestamp(),
            })
        } catch (err) {
            console.error('Error updating vault item:', err)
            throw err
        }
    }, [user, items, saveLocalItems])

    // Toggle favorite
    const toggleFavorite = useCallback(async (itemId: string) => {
        const item = items.find((i) => i.id === itemId)
        if (!item) return
        await updateItem(itemId, { isFavorite: !item.isFavorite })
    }, [items, updateItem])

    // Delete an item
    const deleteItem = useCallback(async (itemId: string) => {
        if (!user) throw new Error('Not authenticated')

        // Local storage mode
        if (!isFirebaseConfigured) {
            const newItems = items.filter((item) => item.id !== itemId)
            setItems(newItems)
            saveLocalItems(newItems)
            return
        }

        // Firebase mode
        try {
            const itemRef = doc(db, 'vault', itemId)
            await deleteDoc(itemRef)
        } catch (err) {
            console.error('Error deleting vault item:', err)
            throw err
        }
    }, [user, items, saveLocalItems])

    return {
        items,
        loading,
        error,
        addItem,
        updateItem,
        deleteItem,
        toggleFavorite,
        // Computed properties
        favorites: items.filter((i) => i.isFavorite),
        notes: items.filter((i) => i.type === 'note'),
        links: items.filter((i) => i.type === 'link'),
        passwords: items.filter((i) => i.type === 'password'),
    }
}

export default useVault
