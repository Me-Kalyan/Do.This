import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { NotificationAnimation } from '@/components/animation'
import { Button } from '@/components/ui/button'

interface NotificationPromptProps {
    onClose?: () => void
}

export function NotificationPrompt({ onClose }: NotificationPromptProps) {
    const { isSupported, permission, requestPermission } = usePushNotifications()
    const [isVisible, setIsVisible] = useState(true)
    const [isLoading, setIsLoading] = useState(false)

    // Don't show if not supported or already granted/denied
    if (!isSupported || permission !== 'default' || !isVisible) {
        return null
    }

    const handleEnable = async () => {
        setIsLoading(true)
        await requestPermission()
        setIsLoading(false)
        setIsVisible(false)
        onClose?.()
    }

    const handleDismiss = () => {
        setIsVisible(false)
        onClose?.()
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="notification-prompt"
                    initial={{ opacity: 0, y: 50, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                >
                    <div className="notification-prompt-content">
                        <div className="notification-prompt-icon">
                            <NotificationAnimation size={48} />
                        </div>

                        <div className="notification-prompt-text">
                            <h3 className="text-title-sm">Enable Notifications</h3>
                            <p className="text-body-sm">
                                Get reminders for your tasks and stay on track with your goals.
                            </p>
                        </div>
                    </div>

                    <div className="notification-prompt-actions">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDismiss}
                        >
                            Not now
                        </Button>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleEnable}
                            loading={isLoading}
                        >
                            Enable
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default NotificationPrompt
