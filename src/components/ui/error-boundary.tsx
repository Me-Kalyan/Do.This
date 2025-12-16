import React, { Component, ReactNode } from 'react'
import { Button } from '@/components/ui/button'

interface Props {
    children: ReactNode
    fallback?: ReactNode
}

interface State {
    hasError: boolean
    error: Error | null
}

// Detect if error is a chunk loading failure (happens after deployments)
function isChunkLoadError(error: Error): boolean {
    return (
        error.message?.includes('Failed to fetch dynamically imported module') ||
        error.message?.includes('Loading chunk') ||
        error.message?.includes('Loading CSS chunk') ||
        error.name === 'ChunkLoadError'
    )
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false, error: null }
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)

        // Auto-refresh on chunk loading errors (new deployment detected)
        if (isChunkLoadError(error)) {
            console.log('🔄 Chunk load error detected, refreshing page...')
            // Clear caches and reload
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => caches.delete(name))
                })
            }
            window.location.reload()
        }
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null })
    }

    handleHardRefresh = () => {
        // Clear service worker and caches, then reload
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => registration.unregister())
            })
        }
        if ('caches' in window) {
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name))
            })
        }
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            const isChunkError = this.state.error && isChunkLoadError(this.state.error)

            return (
                <div className="min-h-screen flex items-center justify-center p-6 bg-zinc-50 dark:bg-zinc-900">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <span className="text-2xl">{isChunkError ? '🔄' : '⚠️'}</span>
                        </div>
                        <h2 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
                            {isChunkError ? 'App Updated' : 'Something went wrong'}
                        </h2>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
                            {isChunkError
                                ? 'A new version is available. Please refresh to continue.'
                                : (this.state.error?.message || 'An unexpected error occurred')
                            }
                        </p>
                        <div className="space-y-2">
                            <Button onClick={this.handleHardRefresh} fullWidth>
                                {isChunkError ? 'Refresh Now' : 'Try Again'}
                            </Button>
                            <Button
                                variant="outline"
                                fullWidth
                                onClick={() => window.location.href = '/'}
                            >
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}

export default ErrorBoundary

