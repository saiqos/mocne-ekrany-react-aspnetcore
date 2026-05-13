import { create } from 'zustand';

export type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning';

interface SnackbarState {
    open: boolean;
    message: string;
    severity: SnackbarSeverity;
    showSnackbar: (msg: string, severity?: SnackbarSeverity) => void;
    closeSnackbar: () => void;
}

export const useSnackbarStore = create<SnackbarState>((set) => ({
    open: false,
    message: '',
    severity: 'info',
    showSnackbar: (msg, severity = 'info') => set({ open: true, message: msg, severity }),
    closeSnackbar: () => set({ open: false, message: '' })
}));