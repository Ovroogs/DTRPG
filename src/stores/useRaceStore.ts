import { create } from "zustand";

interface RaceState {
  isEdit: boolean;
  selectedRaceName: string | undefined;
  
  toggleMode: () => void;
  setEdit: (isEdit: boolean) => void;
  setSelectedRaceName: (name: string | undefined) => void;
}

export const useRaceStore = create<RaceState>((set) => ({
  isEdit: false,
  selectedRaceName: "Эльфы", // Задаем начальное значение по умолчанию

  // Переключение режима (true/false)
  toggleMode: () => set((state) => ({ isEdit: !state.isEdit })),
  
  // Принудительная установка режима (например, сброс в false при отмене)
  setEdit: (edit) => set({ isEdit: edit }),

  // Экшен для изменения выбранной расы
  setSelectedRaceName: (name) => set({ 
    selectedRaceName: name,
    isEdit: false // 💡 Автоматически закрываем режим редактирования при смене расы!
  }),
}));
