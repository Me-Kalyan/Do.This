import Lottie from 'lottie-react'
import successAnimation from '@/assets/animations/success.json'
import loadingAnimation from '@/assets/animations/loading.json'
import emptyStateAnimation from '@/assets/animations/empty-state.json'
import notificationAnimation from '@/assets/animations/notification.json'

interface AnimatedIconProps {
    size?: number
    loop?: boolean
    autoplay?: boolean
    className?: string
}

export const SuccessAnimation = ({
    size = 80,
    loop = false,
    autoplay = true,
    className = ''
}: AnimatedIconProps) => (
    <div className={`animated-icon success-icon ${className}`} style={{ width: size, height: size }}>
        <Lottie
            animationData={successAnimation}
            loop={loop}
            autoplay={autoplay}
            style={{ width: '100%', height: '100%' }}
        />
    </div>
)

export const LoadingAnimation = ({
    size = 48,
    loop = true,
    autoplay = true,
    className = ''
}: AnimatedIconProps) => (
    <div className={`animated-icon loading-icon ${className}`} style={{ width: size, height: size }}>
        <Lottie
            animationData={loadingAnimation}
            loop={loop}
            autoplay={autoplay}
            style={{ width: '100%', height: '100%' }}
        />
    </div>
)

export const EmptyStateAnimation = ({
    size = 160,
    loop = true,
    autoplay = true,
    className = ''
}: AnimatedIconProps) => (
    <div className={`animated-icon empty-state-icon ${className}`} style={{ width: size, height: size }}>
        <Lottie
            animationData={emptyStateAnimation}
            loop={loop}
            autoplay={autoplay}
            style={{ width: '100%', height: '100%' }}
        />
    </div>
)

export const NotificationAnimation = ({
    size = 48,
    loop = false,
    autoplay = true,
    className = ''
}: AnimatedIconProps) => (
    <div className={`animated-icon notification-icon ${className}`} style={{ width: size, height: size }}>
        <Lottie
            animationData={notificationAnimation}
            loop={loop}
            autoplay={autoplay}
            style={{ width: '100%', height: '100%' }}
        />
    </div>
)

// Re-export for convenience
export { successAnimation, loadingAnimation, emptyStateAnimation, notificationAnimation }
