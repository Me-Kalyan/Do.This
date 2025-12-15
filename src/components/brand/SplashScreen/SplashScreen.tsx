import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SplashScreenProps {
    onComplete?: () => void
    duration?: number
}

function SplashScreen({ onComplete, duration = 2500 }: SplashScreenProps) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(() => onComplete?.(), 400) // Wait for exit animation
        }, duration)

        return () => clearTimeout(timer)
    }, [duration, onComplete])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="splash-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="splash-bg" />

                    {/* Animated S3 Symbol */}
                    <div className="splash-symbol">
                        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                            <defs>
                                <linearGradient id="splash-gradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#A79BFF" />
                                    <stop offset="1" stopColor="#78D4C2" />
                                </linearGradient>
                                <filter id="splash-glow" x="-100%" y="-100%" width="300%" height="300%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Arc - Draw animation */}
                            <motion.circle
                                cx="60"
                                cy="60"
                                r="48"
                                stroke="url(#splash-gradient)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                fill="none"
                                filter="url(#splash-glow)"
                                initial={{ pathLength: 0, rotate: -135 }}
                                animate={{ pathLength: 0.65, rotate: 0 }}
                                transition={{
                                    pathLength: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
                                    rotate: { duration: 1.5, ease: [0.16, 1, 0.3, 1] }
                                }}
                                style={{ transformOrigin: 'center' }}
                            />

                            {/* Dot - Scale in */}
                            <motion.circle
                                cx="36"
                                cy="84"
                                r="10"
                                fill="url(#splash-gradient)"
                                filter="url(#splash-glow)"
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{
                                    delay: 0.6,
                                    duration: 0.5,
                                    ease: [0.34, 1.56, 0.64, 1]
                                }}
                            />
                        </svg>
                    </div>

                    {/* Wordmark - Fade in */}
                    <motion.div
                        className="splash-wordmark"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        <span className="wordmark-do">Do</span>
                        <span className="wordmark-dot">.</span>
                        <span className="wordmark-this">This</span>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default SplashScreen
