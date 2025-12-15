import { create } from 'zustand'

interface UIState {
    isSheetOpen: boolean
    sheetContent: React.ReactNode | null
    isSearchOpen: boolean
    openSheet: (content: React.ReactNode) => void
    closeSheet: () => void
    toggleSearch: () => void
    closeSearch: () => void
}

export const useUIStore = create<UIState>((set) => ({
    isSheetOpen: false,
    sheetContent: null,
    isSearchOpen: false,

    openSheet: (content) => set({ isSheetOpen: true, sheetContent: content }),
    closeSheet: () => set({ isSheetOpen: false, sheetContent: null }),

    toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
    closeSearch: () => set({ isSearchOpen: false }),
}))
