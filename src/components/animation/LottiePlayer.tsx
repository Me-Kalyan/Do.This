import { useRef, useEffect } from 'react'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'

interface LottiePlayerProps {
    animationData?: object
    src?: string
    loop?: boolean
    autoplay?: boolean
    className?: string
    style?: React.CSSProperties
    speed?: number
    direction?: 1 | -1
    mode?: 'idle' | 'hover' | 'active'
    onComplete?: () => void
}

function LottiePlayer({
    animationData,
    src,
    loop = true,
    autoplay = true,
    className = '',
    style,
    speed = 1,
    direction = 1,
    mode = 'idle',
    onComplete,
}: LottiePlayerProps) {
    const lottieRef = useRef<LottieRefCurrentProps>(null)

    useEffect(() => {
        if (lottieRef.current) {
            lottieRef.current.setSpeed(speed)
            lottieRef.current.setDirection(direction)
        }
    }, [speed, direction])

    // Handle different modes
    const getModeClass = () => {
        switch (mode) {
            case 'idle':
                return 'lottie-idle'
            case 'hover':
                return 'lottie-hover'
            case 'active':
                return 'lottie-active'
            default:
                return ''
        }
    }

    if (!animationData && !src) {
        return null
    }

    return (
        <div className={`lottie-player ${getModeClass()} ${className}`} style={style}>
            <Lottie
                lottieRef={lottieRef}
                animationData={animationData}
                loop={loop}
                autoplay={autoplay}
                onComplete={onComplete}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    )
}

export default LottiePlayer
