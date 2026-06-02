import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Race } from "@/types/Race";
import { Pencil, PencilOff, Plus } from "lucide-react"; // Добавили иконку Plus
import { useRaceStore } from "@/stores/useRaceStore";

interface RaceSidebarProps {
  races: Race[];
  selectedRaceName: string | undefined;
  onSelectRace: (name: string) => void;
  onAddRace: (name: string) => void;
}

export const RaceSidebar = ({
  races,
  selectedRaceName,
  onSelectRace,
  onAddRace,
}: RaceSidebarProps) => {
  const [search, setSearch] = useState("");

  const toggleMode = useRaceStore((state) => state.toggleMode);
  const isEdit = useRaceStore((state) => state.isEdit);

  const filteredRaces = races.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <aside className="w-64 border-r border-slate-900 bg-slate-900/20 p-4 flex flex-col gap-3 shrink-0 h-full">
      {/* ДЕЙСТВИЯ С ПОИСКОМ / ДОБАВЛЕНИЕМ */}
      <div className="space-y-2">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
          Доступные расы
        </span>
        <div className="flex gap-1">
          <Input
            placeholder="Поиск расы..."
            className="bg-slate-950 border-slate-800 h-8 text-xs text-slate-200 focus:ring-amber-500/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filteredRaces.length === 0 && search.trim() !== "" && (
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10"
              onClick={() => {
                onAddRace(search.trim());
                setSearch("");
              }}
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <Separator className="bg-slate-900 my-1" />

      {/* СПИСОК РАС */}
      <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        {filteredRaces.length === 0 ? (
          <div className="text-center py-6 text-slate-600 text-xs italic">
            Расы не найдены
          </div>
        ) : (
          filteredRaces.map((race) => {
            const isSelected = race.name === selectedRaceName;

            return (
              <div key={race.name} className="w-full flex gap-1 items-center">
                {/* Кнопка выбора расы */}
                <Button
                  variant="ghost"
                  onClick={() => onSelectRace(race.name)}
                  className={`flex-1 justify-start font-bold transition-all text-sm h-10 truncate ${
                    isSelected
                      ? "bg-slate-900 text-amber-500 border border-slate-800/80"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
                  }`}
                >
                  {race.name}
                </Button>

                {/* Карандаш рендерим ТОЛЬКО у выбранной расы */}
                {isSelected && (
                  <Button
                    onClick={toggleMode}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 shrink-0 hover:bg-slate-900/40 text-slate-400 hover:text-slate-200"
                  >
                    {isEdit ? (
                      <PencilOff className="w-4 h-4 text-red-400" />
                    ) : (
                      <Pencil className="w-4 h-4 text-amber-500/80" />
                    )}
                  </Button>
                )}
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
};
