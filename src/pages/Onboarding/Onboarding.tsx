import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ListTodo, Brain, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const slides = [
    {
        id: 1,
        title: 'Welcome to Do.This',
        subtitle: 'The intelligent life OS for tasks, memory, and daily flow.',
        icon: ListTodo,
    },
    {
        id: 2,
        title: 'Calm Productivity',
        subtitle: 'Focus on what matters. Let everything else fade away.',
        icon: Check,
    },
    {
        id: 3,
        title: 'Your Second Brain',
        subtitle: 'Capture ideas, memories, and bookmarks. Recall them when you need them.',
        icon: Brain,
    },
    {
        id: 4,
        title: 'Intelligence Without Intrusion',
        subtitle: 'Smart suggestions that help, never distract.',
        icon: Zap,
    },
]

function Onboarding() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const navigate = useNavigate()

    const handleNext = () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1)
        } else {
            navigate('/auth')
        }
    }

    const handleSkip = () => {
        navigate('/auth')
    }

    const slide = slides[currentSlide]
    const IconComponent = slide.icon

    return (
        <div className="min-h-screen bg-zinc-50 transition-colors duration-500">
            {/* Subtle Background Pattern */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-200/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-zinc-200/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative min-h-screen flex flex-col">
                {/* Skip Button */}
                {currentSlide < slides.length - 1 && (
                    <motion.div
                        className="absolute top-6 right-6 z-10"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <button
                            onClick={handleSkip}
                            className="text-sm font-medium text-zinc-400 hover:text-zinc-900 transition-colors"
                        >
                            Skip
                        </button>
                    </motion.div>
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={slide.id}
                            className="w-full max-w-md text-center"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -30 }}
                            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
                        >
                            {/* Icon */}
                            <motion.div
                                className="mx-auto mb-8 w-20 h-20 rounded-2xl bg-zinc-900 flex items-center justify-center shadow-xl"
                                initial={{ scale: 0.8, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            >
                                <IconComponent size={36} className="text-white" />
                            </motion.div>

                            {/* Title */}
                            <motion.h1
                                className="text-3xl font-bold text-zinc-900 mb-4"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                            >
                                {slide.title}
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
                                className="text-lg text-zinc-500 leading-relaxed"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                {slide.subtitle}
                            </motion.p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Bottom Section */}
                <div className="px-6 pb-12">
                    <div className="max-w-md mx-auto space-y-6">
                        {/* Progress Dots */}
                        <div className="flex justify-center gap-2">
                            {slides.map((s, index) => (
                                <button
                                    key={s.id}
                                    onClick={() => setCurrentSlide(index)}
                                    className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                                        ? 'w-8 bg-zinc-900'
                                        : 'w-2 bg-zinc-300 hover:bg-zinc-400'
                                        }`}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Continue Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <Button
                                variant="default"
                                size="lg"
                                fullWidth
                                onClick={handleNext}
                                className="bg-zinc-900 hover:bg-zinc-800 text-white"
                            >
                                {currentSlide === slides.length - 1 ? (
                                    <>Get Started</>
                                ) : (
                                    <>
                                        Continue
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </motion.div>

                        {/* Bottom Indicator */}
                        <motion.p
                            className="text-center text-xs text-zinc-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                        >
                            {currentSlide + 1} of {slides.length}
                        </motion.p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Onboarding
