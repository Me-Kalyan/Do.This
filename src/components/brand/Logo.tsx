import { cn } from '@/lib/utils'

interface LogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
    showIcon?: boolean
}

const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
    xl: 'text-2xl',
}

export function Logo({ size = 'md', className, showIcon = false }: LogoProps) {
    return (
        <span className={cn('font-bold', sizeClasses[size], className)}>
            {showIcon && (
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 mr-2 text-lg font-bold">
                    D
                </span>
            )}
            Do<span className="text-red-500">.</span>This
        </span>
    )
}

// Text-only version for inline use
export function LogoText({ className }: { className?: string }) {
    return (
        <span className={className}>
            Do<span className="text-red-500">.</span>This
        </span>
    )
}

export default Logo
