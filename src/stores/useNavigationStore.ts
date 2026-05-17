import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type AppMode = "dm" | "player";

interface NavigationState {
  isSidebarOpen: boolean;
  appMode: AppMode;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setAppMode: (mode: AppMode) => void;
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      appMode: "dm",
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      setAppMode: (mode) => set({ appMode: mode }),
    }),
    {
      name: "rpg-engine-navigation",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
