import { create } from 'zustand';

let toastId = 0;

const useAppStore = create((set, get) => ({
  // ── Sidebar ──────────────────────────────────────────────
  sidebarCollapsed: JSON.parse(localStorage.getItem('carplog_sidebar_collapsed') || 'false'),
  setSidebarCollapsed: (val) => {
    localStorage.setItem('carplog_sidebar_collapsed', JSON.stringify(val));
    set({ sidebarCollapsed: val });
  },

  // ── Command Palette ───────────────────────────────────────
  isCommandPaletteOpen: false,
  openCommandPalette: () => set({ isCommandPaletteOpen: true }),
  closeCommandPalette: () => set({ isCommandPaletteOpen: false }),

  // ── Toasts ───────────────────────────────────────────────
  toasts: [],

  addToast: ({ title, message, type = 'success', duration }) => {
    const id = ++toastId;
    const defaultDuration = type === 'success' ? 3000 : type === 'loading' ? null : null;
    const ms = duration !== undefined ? duration : defaultDuration;

    set((state) => {
      const newToast = { id, title, message, type };
      // Keep max 3
      const toasts = [...state.toasts.slice(-2), newToast];
      return { toasts };
    });

    if (ms !== null) {
      setTimeout(() => get().removeToast(id), ms);
    }

    return id;
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  updateToast: (id, patch) => {
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  },
}));

export default useAppStore;
