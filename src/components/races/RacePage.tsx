import { useCallback, useState } from "react";
import { Race, emptyRace } from "@/types/Race"; // Исправленный импорт
import { Separator } from "@/components/ui/separator";

import { RaceSidebar } from "./RaceSidebar";
import { RaceDashboard } from "./RaceDashboard";
import { RaceCharcateristics } from "./RaceCharacteristics";
import { FolkList } from "./FolkList";
import { useRaceStore } from "@/stores/useRaceStore";

export function RacePage() {
  const selectedRaceName = useRaceStore((state) => state.selectedRaceName);
  const setSelectedRaceName = useRaceStore(
    (state) => state.setSelectedRaceName,
  );
  const isEdit = useRaceStore((state) => state.isEdit);

  const [races, setRaces] = useState<Race[]>([
    {
      id: "",
      name: "Эльфы",
      numberOfTransfers: 1,
      peculiarity: "Дополнительное начальное очко опыта",
      characteristics: [
        { name: "Сила", grade: 1, values: [3, 6, 9] },
        { name: "Ловкость", grade: 1, values: [8, 15, 23] },
        { name: "Интеллект", grade: 1, values: [6, 12, 18] },
        { name: "Выносливость", grade: 1, values: [2, 5, 8] },
        { name: "Харизма", grade: 1, values: [8, 14, 21] },
        { name: "Восприятие", grade: 1, values: [7, 14, 21] },
        { name: "Сила Воли", grade: 1, values: [8, 15, 23] },
      ],
      folks: [
        {
          name: "Степные эльфы",
          ability: "Стрельба",
          modifierCharacteristics: [
            { characteristic: "Ловкость", number: 2 },
            { characteristic: "Интеллект", number: -2 },
            { characteristic: "Харизма", number: -1 },
            { characteristic: "Восприятие", number: 1 },
          ],
        },
        {
          name: "Эльфы мраморных островов",
          ability: "Манипуляция",
          modifierCharacteristics: [
            { characteristic: "Ловкость", number: -2 },
            { characteristic: "Интеллект", number: 2 },
            { characteristic: "Сила Воли", number: 1 },
            { characteristic: "Восприятие", number: -1 },
          ],
        },
        {
          name: "Эльфы островов",
          ability: "Манипуляция",
          modifierCharacteristics: [
            { characteristic: "Сила Воли", number: 1 },
            { characteristic: "Восприятие", number: -1 },
          ],
        },
      ],
    },
    {
      id: "",
      name: "Люди",
      numberOfTransfers: 3,
      peculiarity: "Бесплатный начальный навык",
      characteristics: [
        { name: "Сила", grade: 1, values: [6, 12, 18] },
        { name: "Ловкость", grade: 1, values: [6, 12, 18] },
        { name: "Интеллект", grade: 1, values: [6, 12, 18] },
        { name: "Выносливость", grade: 1, values: [6, 12, 18] },
        { name: "Харизма", grade: 1, values: [6, 12, 18] },
        { name: "Восприятие", grade: 1, values: [6, 12, 18] },
        { name: "Сила Воли", grade: 1, values: [6, 12, 18] },
      ],
      folks: [],
    },
  ]);

  const sortedRaces = [...races].sort((a, b) =>
    a.name.localeCompare(b.name, "ru"),
  );
  const activeRace = sortedRaces.find((r) => r.name === selectedRaceName);

  // Метод добавления расы
  const onAddRace = useCallback(
    (name: string) => {
      setRaces((prevRaces) => {
        const updated = [...prevRaces, { ...emptyRace, name: name }];
        return updated.sort((a, b) => a.name.localeCompare(b.name, "ru"));
      });
      setSelectedRaceName(name); // Zustand-экшен автоматически сбросит и isEdit в false
    },
    [setSelectedRaceName],
  );

  return (
    <div className="flex flex-row w-full h-screen bg-slate-950 text-slate-200 overflow-hidden select-none">
      <RaceSidebar
        races={sortedRaces}
        selectedRaceName={selectedRaceName}
        onSelectRace={setSelectedRaceName} 
        onAddRace={onAddRace}
      />

      <main className="flex-1 flex flex-col min-w-0 p-6 space-y-6 overflow-hidden">
        {activeRace ? (
          <>
            <RaceDashboard
              name={activeRace.name}
              peculiarity={activeRace.peculiarity}
              numberOfTransfers={Number(activeRace.numberOfTransfers)}
              // Колбэк обновления Особенности
              onUpdatePeculiarity={(newPeculiarity) => {
                setRaces((prev) =>
                  prev.map((r) =>
                    r.name === selectedRaceName
                      ? { ...r, peculiarity: newPeculiarity }
                      : r,
                  ),
                );
              }}
              // Колбэк обновления Переносов
              onUpdateTransfers={(newTransfers) => {
                setRaces((prev) =>
                  prev.map((r) =>
                    r.name === selectedRaceName
                      ? { ...r, numberOfTransfers: newTransfers }
                      : r,
                  ),
                );
              }}
            />

            <RaceCharcateristics characteristics={activeRace.characteristics} />

            <Separator />

            <FolkList folks={activeRace.folks} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-600 italic">
            Выберите расу в левой панели для просмотра информации
          </div>
        )}
      </main>
    </div>
  );
}
