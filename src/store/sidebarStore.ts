import { create } from 'zustand';

interface SidebarState {
    open: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
    open: true,
    toggleSidebar: () => set((state) => ({ open: !state.open })),
    closeSidebar: () => set({ open: false }),
}));