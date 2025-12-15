import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useThemeStore } from '@store/themeStore'

const navItems = [
    {
        path: '/',
        label: 'Home',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9,22 9,12 15,12 15,22" />
            </svg>
        ),
    },
    {
        path: '/today',
        label: 'Today',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
            </svg>
        ),
    },
    {
        path: '/calendar',
        label: 'Calendar',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
        ),
    },
    {
        path: '/vault',
        label: 'Memory Vault',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2 2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
    },
    {
        path: '/insights',
        label: 'Insights',
        icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="m19 9-5 5-4-4-3 3" />
            </svg>
        ),
    },
]

function Sidebar() {
    const { isDarkMode, toggleDarkMode } = useThemeStore()

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div className="sidebar-logo">
                <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
                    <circle cx="24" cy="24" r="18" stroke="url(#sidebarGradient)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="70 40" />
                    <circle cx="18" cy="28" r="3.5" fill="url(#sidebarGradient)" />
                    <defs>
                        <linearGradient id="sidebarGradient" x1="0" y1="0" x2="48" y2="48">
                            <stop stopColor="#A79BFF" />
                            <stop offset="1" stopColor="#78D4C2" />
                        </linearGradient>
                    </defs>
                </svg>
                <span className="sidebar-logo-text text-title-sm">Do<span className="text-red-500">.</span>This</span>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `sidebar-nav-item ${isActive ? 'active' : ''}`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                {isActive && (
                                    <motion.span
                                        className="sidebar-indicator"
                                        layoutId="sidebarActive"
                                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <span className="sidebar-nav-icon">{item.icon}</span>
                                <span className="sidebar-nav-label">{item.label}</span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div className="sidebar-footer">
                <button className="sidebar-theme-btn" onClick={toggleDarkMode}>
                    {isDarkMode ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                            <circle cx="12" cy="12" r="5" />
                            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                        </svg>
                    ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    )}
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
