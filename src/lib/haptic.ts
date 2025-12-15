/**
 * Haptic Feedback Utility
 * Uses the Vibration API for mobile devices
 */

// Check if vibration is supported
const isVibrationSupported = (): boolean => {
    return 'vibrate' in navigator
}

// Haptic patterns (duration in milliseconds)
export const hapticPatterns = {
    light: [10],           // Light tap
    medium: [20],          // Medium tap
    heavy: [30],           // Heavy tap
    success: [10, 50, 10], // Success pattern
    error: [50, 30, 50],   // Error pattern
    selection: [5],        // Selection change
} as const

export type HapticPattern = keyof typeof hapticPatterns

/**
 * Trigger haptic feedback
 * @param pattern - The haptic pattern to use
 */
export const triggerHaptic = (pattern: HapticPattern = 'light'): void => {
    if (!isVibrationSupported()) {
        return
    }

    try {
        navigator.vibrate(hapticPatterns[pattern])
    } catch (e) {
        // Silently fail if vibration is not available
        console.debug('Haptic feedback not available:', e)
    }
}

/**
 * Custom hook for haptic feedback
 * Returns a function that can be called to trigger haptic feedback
 */
export const useHaptic = (pattern: HapticPattern = 'light') => {
    return () => triggerHaptic(pattern)
}

export default triggerHaptic
