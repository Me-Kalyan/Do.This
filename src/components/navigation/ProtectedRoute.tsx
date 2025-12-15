import { Navigate } from 'react-router-dom'
import { useAuth } from '@hooks/useAuth'

interface ProtectedRouteProps {
    children: React.ReactNode
    fallback?: React.ReactNode
}

function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth()

    // Show loading state
    if (loading) {
        return (
            <div className="protected-loading">
                <div className="protected-spinner" />
            </div>
        )
    }

    // Redirect to auth if not authenticated
    if (!isAuthenticated) {
        // If fallback is provided, show it (for guest mode)
        if (fallback) {
            return <>{fallback}</>
        }
        return <Navigate to="/auth" replace />
    }

    return <>{children}</>
}

export default ProtectedRoute
