import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    icon?: React.ReactNode
    iconRight?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, label, error, icon, iconRight, id, ...props }, ref) => {
        const inputId = id || `input-${React.useId()}`

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                            {icon}
                        </span>
                    )}
                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            'flex h-10 w-full rounded-lg border bg-transparent px-3 py-2 text-sm transition-colors',
                            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                            'placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0',
                            'disabled:cursor-not-allowed disabled:opacity-50',
                            // Light mode
                            'border-zinc-200 bg-white text-zinc-900',
                            'focus-visible:border-zinc-400 focus-visible:ring-zinc-200',
                            // Dark mode
                            'dark:border-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-100',
                            'dark:focus-visible:border-zinc-500 dark:focus-visible:ring-zinc-700',
                            // Icon padding
                            icon && 'pl-10',
                            iconRight && 'pr-10',
                            // Error state
                            error && 'border-red-500 focus-visible:ring-red-200 dark:border-red-500 dark:focus-visible:ring-red-900/50',
                            className
                        )}
                        ref={ref}
                        {...props}
                    />
                    {iconRight && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500">
                            {iconRight}
                        </span>
                    )}
                </div>
                {error && (
                    <span className="text-sm text-red-500">{error}</span>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export { Input }
export default Input
