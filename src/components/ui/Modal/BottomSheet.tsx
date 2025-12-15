import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

interface BottomSheetProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    size?: 'small' | 'medium' | 'full'
}

function BottomSheet({ isOpen, onClose, children, title, size = 'medium' }: BottomSheetProps) {
    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isOpen])

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
        }
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="sheet-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                    />

                    {/* Sheet */}
                    <motion.div
                        className={`sheet sheet-${size}`}
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{
                            type: 'spring',
                            damping: 28,
                            stiffness: 300,
                        }}
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.1}
                        onDragEnd={(_, info) => {
                            if (info.offset.y > 100 || info.velocity.y > 500) {
                                onClose()
                            }
                        }}
                    >
                        {/* Drag Handle */}
                        <div className="sheet-handle">
                            <div className="sheet-handle-bar" />
                        </div>

                        {/* Header */}
                        {title && (
                            <div className="sheet-header">
                                <h2 className="text-title-sm">{title}</h2>
                            </div>
                        )}

                        {/* Content */}
                        <div className="sheet-content">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    )
}

export default BottomSheet
