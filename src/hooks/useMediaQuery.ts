import { useState, useEffect } from 'react'

type Breakpoint = 'mobile' | 'tablet' | 'desktop'

const breakpoints = {
    mobile: '(max-width: 767px)',
    tablet: '(min-width: 768px) and (max-width: 1023px)',
    desktop: '(min-width: 1024px)',
}

export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches
        }
        return false
    })

    useEffect(() => {
        const mediaQuery = window.matchMedia(query)
        const handler = (e: MediaQueryListEvent) => setMatches(e.matches)

        // Set initial value
        setMatches(mediaQuery.matches)

        // Listen for changes
        mediaQuery.addEventListener('change', handler)
        return () => mediaQuery.removeEventListener('change', handler)
    }, [query])

    return matches
}

export function useBreakpoint(): Breakpoint {
    // Note: mobile is default fallback, no need to check explicitly
    const isTablet = useMediaQuery(breakpoints.tablet)
    const isDesktop = useMediaQuery(breakpoints.desktop)

    if (isDesktop) return 'desktop'
    if (isTablet) return 'tablet'
    return 'mobile'
}

export function useIsMobile(): boolean {
    return useMediaQuery(breakpoints.mobile)
}

export function useIsDesktop(): boolean {
    return useMediaQuery(breakpoints.desktop)
}
