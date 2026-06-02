import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { invoke } from "@tauri-apps/api/core"; // Используем invoke из ядра Tauri v2

type AppMode = "dm" | "player";

interface NavigationState {
  isSidebarOpen: boolean;
  appMode: AppMode;
  platform: string; // "windows", "android", "macos", "linux"
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setAppMode: (mode: AppMode) => void;
  initPlatform: () => Promise<void>; // Метод для вызова из Rust при старте
}

export const useNavigationStore = create<NavigationState>()(
  persist(
    (set) => ({
      isSidebarOpen: true,
      appMode: "dm",
      platform: "windows", // Дефолтное значение до вызова Rust-команды

      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      setAppMode: (mode) => set({ appMode: mode }),

      // Асинхронный запрос текущей ОС из бэкенда Rust
      initPlatform: async () => {
        try {
          const currentPlatform = await invoke<string>("get_platform");
          set({ platform: currentPlatform });
        } catch (error) {
          console.error("Не удалось запросить ОС из Rust:", error);
        }
      },
    }),
    {
      name: "rpg-engine-navigation",
      storage: createJSONStorage(() => localStorage),

      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
        appMode: state.appMode,
      }),
    },
  ),
);
