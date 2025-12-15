import { Children, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface BentoGridProps {
    children: ReactNode
    className?: string
    columns?: 2 | 3 | 4
}

function BentoGrid({ children, className = '', columns = 2 }: BentoGridProps) {
    const childArray = Children.toArray(children)

    return (
        <div className={`bento-grid bento-cols-${columns} ${className}`}>
            {childArray.map((child, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        delay: index * 0.05,
                        duration: 0.24,
                        ease: [0.33, 1, 0.68, 1],
                    }}
                >
                    {child}
                </motion.div>
            ))}
        </div>
    )
}

export default BentoGrid
