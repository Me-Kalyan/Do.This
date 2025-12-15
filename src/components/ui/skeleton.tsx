import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'circular' | 'text'
    width?: string | number
    height?: string | number
}

export function Skeleton({
    className,
    variant = 'default',
    width,
    height,
    ...props
}: SkeletonProps) {
    const baseStyles = 'animate-pulse bg-zinc-200 dark:bg-zinc-800'

    const variantStyles = {
        default: 'rounded-lg',
        circular: 'rounded-full',
        text: 'rounded h-4',
    }

    return (
        <div
            className={cn(baseStyles, variantStyles[variant], className)}
            style={{ width, height }}
            {...props}
        />
    )
}

// Pre-built skeleton patterns for common UI elements
export function TaskSkeleton() {
    return (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse">
            <div className="w-5 h-5 rounded-full bg-zinc-300 dark:bg-zinc-700 mt-0.5" />
            <div className="flex-1 space-y-2">
                <div className="h-4 bg-zinc-300 dark:bg-zinc-700 rounded w-3/4" />
                <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-1/2" />
            </div>
        </div>
    )
}

export function TaskListSkeleton({ count = 3 }: { count?: number }) {
    return (
        <div className="space-y-2">
            {Array.from({ length: count }).map((_, i) => (
                <TaskSkeleton key={i} />
            ))}
        </div>
    )
}

export function StatCardSkeleton() {
    return (
        <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse">
            <div className="w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-700 mb-3" />
            <div className="h-6 bg-zinc-300 dark:bg-zinc-700 rounded w-12 mb-2" />
            <div className="h-3 bg-zinc-200 dark:bg-zinc-700 rounded w-20" />
        </div>
    )
}

export function StatsGridSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
                <StatCardSkeleton key={i} />
            ))}
        </div>
    )
}

export function PageHeaderSkeleton() {
    return (
        <div className="px-6 py-4 animate-pulse">
            <div className="h-8 bg-zinc-200 dark:bg-zinc-700 rounded w-32 mb-2" />
            <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded w-48" />
        </div>
    )
}

export default Skeleton
