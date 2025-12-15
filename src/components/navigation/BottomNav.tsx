import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Clock, Calendar, Layers, BarChart2 } from 'lucide-react'
import { triggerHaptic } from '@/lib/haptic'
import { useThemeStore } from '@/store/themeStore'

const navItems = [
    { path: '/', label: 'Home', Icon: Home },
    { path: '/today', label: 'Today', Icon: Clock },
    { path: '/calendar', label: 'Calendar', Icon: Calendar },
    { path: '/vault', label: 'Vault', Icon: Layers },
    { path: '/insights', label: 'Insights', Icon: BarChart2 },
]

function BottomNav() {
    const { isDarkMode } = useThemeStore()

    const handleNavClick = () => {
        triggerHaptic('selection')
    }

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div
                className={`
                    flex items-center gap-1 px-4 py-3 rounded-full shadow-2xl backdrop-blur-xl border transition-all duration-300
                    ${isDarkMode
                        ? 'bg-zinc-900/80 border-zinc-800/60 shadow-black/50'
                        : 'bg-white/80 border-white/60 shadow-zinc-200/50'
                    }
                `}
            >
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleNavClick}
                        className="relative px-3 py-2"
                    >
                        {({ isActive }) => (
                            <div className="relative flex flex-col items-center justify-center">
                                {/* Active Indicator (Glow) */}
                                {isActive && (
                                    <motion.div
                                        layoutId="dock-glow"
                                        className={`absolute inset-0 rounded-xl blur-md opacity-40 ${isDarkMode ? 'bg-zinc-100' : 'bg-zinc-900'
                                            }`}
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Active Background (Pill) */}
                                {isActive && (
                                    <motion.div
                                        layoutId="dock-active"
                                        className={`absolute inset-0 rounded-2xl ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'
                                            }`}
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Icon */}
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="relative z-10 p-1"
                                >
                                    <item.Icon
                                        size={22}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className={`transition-colors duration-300 ${isActive
                                            ? (isDarkMode ? 'text-zinc-50' : 'text-zinc-950')
                                            : (isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600')
                                            }`}
                                    />
                                </motion.div>
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}

export default BottomNav
