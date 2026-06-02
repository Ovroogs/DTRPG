import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input"; // Импортируем инпут Shadcn
import { useRaceStore } from "@/stores/useRaceStore";

interface RaceDashboardProps {
  name: string;
  peculiarity: string;
  numberOfTransfers: number;
  onUpdatePeculiarity: (value: string) => void;
  onUpdateTransfers: (value: number) => void;
}

export const RaceDashboard = ({
  name,
  peculiarity,
  numberOfTransfers,
  onUpdatePeculiarity,
  onUpdateTransfers,
}: RaceDashboardProps) => {
  // Читаем глобальное состояние режима редактирования
  const isEdit = useRaceStore((state) => state.isEdit);

  return (
    <div className="flex h-20 gap-3 justify-around items-center bg-slate-900/20 border border-slate-900 p-4 rounded-lg shrink-0 overflow-hidden">
      {/* 1. НАЗВАНИЕ РАСЫ (Всегда статика) */}
      <div className="space-y-1 min-w-30">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
          Раса
        </span>
        <h2 className="text-3xl font-black text-slate-100 font-serif tracking-tight truncate">
          {name}
        </h2>
      </div>

      <Separator orientation="vertical" className="bg-slate-800" />

      {/* 2. ОСОБЕННОСТЬ РАСЫ (Инпут или Текст) */}
      <div className="flex-1 space-y-1 px-2 ">
        <span className="text-[10px] font-bold text-slate-500 uppercase block">
          Особенность расы
        </span>
        {isEdit ? (
          <Input
            className="h-8 bg-slate-950 border-slate-800 text-xs text-amber-500/90 italic focus:ring-amber-500/30 w-full"
            value={peculiarity}
            onChange={(e) => onUpdatePeculiarity(e.target.value)}
            placeholder="Введите особенность расы..."
          />
        ) : (
          <p className="text-xs text-amber-500/90 italic leading-snug line-clamp-2">
            {peculiarity || "Особенность отсутствует"}
          </p>
        )}
      </div>

      <Separator orientation="vertical" className="bg-slate-800" />

      {/* 3. ПЕРЕНОСЫ (Инпут-число или Текст) */}
      <div className="space-y-1 min-w-20 text-center">
        <span className="text-[10px] font-bold text-slate-500 uppercase block">
          Переносы
        </span>
        {isEdit ? (
          <Input
            type="number"
            min={0}
            max={99}
            className="h-8 bg-slate-950 border-slate-800 text-xs font-mono font-bold text-amber-500/90 text-center focus:ring-amber-500/30 w-16 mx-auto"
            value={numberOfTransfers}
            onChange={(e) => onUpdateTransfers(Number(e.target.value) || 0)}
          />
        ) : (
          <p className="text-sm font-mono font-bold text-amber-500/90 tracking-wider">
            {numberOfTransfers}
          </p>
        )}
      </div>
    </div>
  );
};
