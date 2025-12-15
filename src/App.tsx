import { lazy, Suspense, useLayoutEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import { BottomNav } from '@components/navigation'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { useThemeStore } from '@/store/themeStore'

// Lazy load pages for code splitting
const Home = lazy(() => import('@pages/Home/Home'))
const Auth = lazy(() => import('@pages/Auth/Auth'))
const Onboarding = lazy(() => import('@pages/Onboarding/Onboarding'))
const Today = lazy(() => import('@pages/Today/Today'))
const TaskDetail = lazy(() => import('@pages/TaskDetail/TaskDetail'))
const Calendar = lazy(() => import('@pages/Calendar/Calendar'))
const Vault = lazy(() => import('@pages/Vault/Vault'))
const Analytics = lazy(() => import('@pages/Analytics/Analytics'))
const DesignSystem = lazy(() => import('@pages/DesignSystem/DesignSystem'))
const FeatureShowcase = lazy(() => import('@pages/FeatureShowcase').then(m => ({ default: m.FeatureShowcase })))
const Settings = lazy(() => import('@pages/Settings/Settings'))

// Loading spinner for Suspense fallback
function PageLoader() {
  const { isDarkMode } = useThemeStore()
  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-zinc-900' : 'bg-zinc-50'}`}>
      <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${isDarkMode ? 'border-zinc-400' : 'border-zinc-600'}`} />
    </div>
  )
}

function App() {
  const location = useLocation()
  const { isDarkMode } = useThemeStore()

  // Apply theme synchronously to prevent flicker matching React render cycle
  useLayoutEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Hide navigation on certain pages
  const hideNavPaths = ['/auth', '/onboarding', '/features', '/settings']
  const showNav = !hideNavPaths.includes(location.pathname)

  return (
    <ErrorBoundary>
      <div className={`theme-transition min-h-screen font-sans antialiased ${isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
        <main className="pb-20">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/today" element={<Today />} />
              <Route path="/task/:id" element={<TaskDetail />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/vault" element={<Vault />} />
              <Route path="/insights" element={<Analytics />} />
              <Route path="/design-system/*" element={<DesignSystem />} />
              <Route path="/features" element={<FeatureShowcase />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Suspense>
        </main>
        {showNav && <BottomNav />}
      </div>
    </ErrorBoundary>
  )
}

export default App
