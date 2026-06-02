import { Card } from "@/components/ui/card";
import { Folk } from "@/types/Race";
import { CharacteristicName } from "@/types/Characteristic";
import { useNavigationStore } from "@/stores/useNavigationStore";

interface FolkListProps {
  folks?: Folk[];
}

const charShorts: Record<CharacteristicName, string> = {
  Сила: "Сил",
  Ловкость: "Лов",
  Интеллект: "Инт",
  Выносливость: "Вын",
  Харизма: "Хар",
  Восприятие: "Вос",
  "Сила Воли": "СВ",
};

export const FolkList = ({ folks }: FolkListProps) => {
  const platform = useNavigationStore((state) => state.platform);
  const isAndroid = platform === "android";

  if (!folks || folks.length === 0) {
    return (
      <div className="text-center py-10 text-slate-600 text-xs italic border border-dashed border-slate-800 rounded-lg">
        У этой расы нет зарегистрированных народов
      </div>
    );
  }

  return (
    <div className="space-y-4 flex-1 flex flex-col min-h-0">
      <h3 className="text-xl font-black text-slate-300 font-serif tracking-tight px-1">
        Народы этой расы
      </h3>
      <div className="flex custom-scrollbar overflow-y-auto gap-2 p-1">
        <div className="w-full grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] auto-rows-auto gap-x-4 gap-y-6 items-start">
          {folks.map((folk) => (
            <FolkCard key={folk.name} folk={folk} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface FolkCardProps {
  folk: Folk;
}

export const FolkCard = ({ folk }: FolkCardProps) => {
  const activeModifiers =
    folk.modifierCharacteristics?.filter((mod) => mod.number !== 0) || [];
  const hasModifiers = activeModifiers.length > 0;

  const positives = activeModifiers
    .filter((mod) => mod.number > 0)
    .sort((a, b) => b.number - a.number);

  const negatives = activeModifiers
    .filter((mod) => mod.number < 0)
    .sort((a, b) => Math.abs(b.number) - Math.abs(a.number));

  const renderBadge = (mod: (typeof activeModifiers)[number]) => {
    const isPositive = mod.number > 0;
    return (
      <div
        key={mod.characteristic}
        className={`flex items-center justify-between px-2.5 py-1 rounded border text-xs font-mono font-medium h-7 w-24 shrink-0 transition-colors ${
          isPositive
            ? "bg-emerald-950/20 text-emerald-400 border-emerald-500/20"
            : "bg-red-950/20 text-red-400 border-red-500/20"
        }`}
      >
        <span className="opacity-60">
          {charShorts[mod.characteristic as CharacteristicName]}:
        </span>
        <span>{isPositive ? `+${mod.number}` : mod.number}</span>
      </div>
    );
  };

  return (
    /* 
      Карточка теперь всегда находится в режиме grid и занимает 2 строки сабгрида.
      Убрана фиксированная ширина lg:w-110, добавлена адаптивная max-w-[440px].
    */
    <Card className="w-full max-w-[440px] p-4 bg-slate-900/30 border-slate-800/80 transition-all duration-200 grid grid-rows-subgrid row-span-2 gap-y-3 shadow-md justify-self-center lg:justify-self-start">
      <header className="flex justify-between items-start gap-1 border-b border-slate-900 pb-2">
        <h4 className="font-bold text-slate-100 text-base tracking-wide truncate">
          {folk.name}
        </h4>
        <div className="text-right shrink-0">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
            Навык народа
          </span>
          <span className="text-xs font-semibold text-amber-500/95 tracking-wide">
            {folk.ability}
          </span>
        </div>
      </header>

      <div className="space-y-2">
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
          Модификаторы характеристик
        </span>

        {hasModifiers ? (
          /* Контейнер для строк модификаторов тоже переведен на лаконичный grid */
          <div className="grid gap-2 w-full">
            {positives.length > 0 && (
              <div className="flex flex-wrap gap-2 w-full">
                {positives.map(renderBadge)}
              </div>
            )}

            {negatives.length > 0 && (
              <div className="flex flex-wrap gap-2 w-full">
                {negatives.map(renderBadge)}
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">
            Нет расовых модификаторов
          </p>
        )}
      </div>
    </Card>
  );
};
