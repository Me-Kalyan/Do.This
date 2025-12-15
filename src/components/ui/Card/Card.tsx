import { forwardRef } from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

export type CardVariant = 'standard' | 'hero' | 'micro' | 'bento'

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    variant?: CardVariant
    hoverable?: boolean
    children?: React.ReactNode
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ variant = 'standard', hoverable = false, children, className = '', ...props }, ref) => {
        return (
            <motion.div
                ref={ref}
                className={`card card-${variant} ${hoverable ? 'card-hoverable' : ''} ${className}`}
                whileHover={hoverable ? { scale: 1.02 } : undefined}
                whileTap={hoverable ? { scale: 0.98 } : undefined}
                transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)

Card.displayName = 'Card'

export default Card
