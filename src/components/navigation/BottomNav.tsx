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
        <nav className={`fixed bottom-0 left-0 right-0 border-t z-50 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
            <div className="flex items-center justify-around max-w-lg mx-auto py-2 px-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleNavClick}
                        className="flex flex-col items-center gap-1 px-3 py-2"
                    >
                        {({ isActive }) => (
                            <div className="relative flex flex-col items-center">
                                <item.Icon
                                    size={22}
                                    className={isActive
                                        ? (isDarkMode ? 'text-zinc-100' : 'text-zinc-900')
                                        : (isDarkMode ? 'text-zinc-500' : 'text-zinc-400')
                                    }
                                />
                                <span className={`text-xs mt-1 ${isActive
                                    ? (isDarkMode ? 'text-zinc-100 font-medium' : 'text-zinc-900 font-medium')
                                    : (isDarkMode ? 'text-zinc-500' : 'text-zinc-400')
                                    }`}>
                                    {item.label}
                                </span>
                                {isActive && (
                                    <motion.span
                                        layoutId="activeTab"
                                        className={`absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full ${isDarkMode ? 'bg-zinc-100' : 'bg-zinc-900'}`}
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}

export default BottomNav
