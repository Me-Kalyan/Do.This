/* ═══════════════════════════════════════════════════════════════════════════
   Database Types for Supabase
   Auto-generate with: npx supabase gen types typescript
   ═══════════════════════════════════════════════════════════════════════════ */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    avatar_url: string | null
                    preferences: Json
                    created_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    avatar_url?: string | null
                    preferences?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    avatar_url?: string | null
                    preferences?: Json
                    created_at?: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    user_id: string
                    title: string
                    description: string | null
                    parent_id: string | null
                    category: string | null
                    tags: string[]
                    priority: 'low' | 'medium' | 'high' | null
                    energy_level: 'low' | 'medium' | 'high' | null
                    time_estimate: number | null
                    due_date: string | null
                    scheduled_at: string | null
                    completed: boolean
                    completed_at: string | null
                    position: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title: string
                    description?: string | null
                    parent_id?: string | null
                    category?: string | null
                    tags?: string[]
                    priority?: 'low' | 'medium' | 'high' | null
                    energy_level?: 'low' | 'medium' | 'high' | null
                    time_estimate?: number | null
                    due_date?: string | null
                    scheduled_at?: string | null
                    completed?: boolean
                    completed_at?: string | null
                    position?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string
                    description?: string | null
                    parent_id?: string | null
                    category?: string | null
                    tags?: string[]
                    priority?: 'low' | 'medium' | 'high' | null
                    energy_level?: 'low' | 'medium' | 'high' | null
                    time_estimate?: number | null
                    due_date?: string | null
                    scheduled_at?: string | null
                    completed?: boolean
                    completed_at?: string | null
                    position?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            notes: {
                Row: {
                    id: string
                    user_id: string
                    title: string | null
                    content: string | null
                    task_id: string | null
                    tags: string[]
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    title?: string | null
                    content?: string | null
                    task_id?: string | null
                    tags?: string[]
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    title?: string | null
                    content?: string | null
                    task_id?: string | null
                    tags?: string[]
                    created_at?: string
                    updated_at?: string
                }
            }
            vault_items: {
                Row: {
                    id: string
                    user_id: string
                    type: 'bookmark' | 'note' | 'image' | 'text'
                    title: string | null
                    content: string | null
                    url: string | null
                    tags: string[]
                    recall_date: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    type: 'bookmark' | 'note' | 'image' | 'text'
                    title?: string | null
                    content?: string | null
                    url?: string | null
                    tags?: string[]
                    recall_date?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    type?: 'bookmark' | 'note' | 'image' | 'text'
                    title?: string | null
                    content?: string | null
                    url?: string | null
                    tags?: string[]
                    recall_date?: string | null
                    created_at?: string
                }
            }
            analytics_events: {
                Row: {
                    id: string
                    user_id: string
                    event_type: string
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    event_type: string
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    event_type?: string
                    metadata?: Json
                    created_at?: string
                }
            }
        }
    }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Update']

// Convenience aliases
export type Task = Tables<'tasks'>
export type Profile = Tables<'profiles'>
export type Note = Tables<'notes'>
export type VaultItem = Tables<'vault_items'>
export type AnalyticsEvent = Tables<'analytics_events'>
