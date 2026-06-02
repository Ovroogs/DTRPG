import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Characteristic, CharacteristicName } from "@/types/Characteristic";

interface RaceCharacteristicsProps {
  characteristics: Characteristic[];
}

const charOrder: CharacteristicName[] = [
  "Сила",
  "Ловкость",
  "Интеллект",
  "Выносливость",
  "Харизма",
  "Восприятие",
  "Сила Воли",
];

const charShorts: Record<CharacteristicName, string> = {
  Сила: "Сил",
  Ловкость: "Лов",
  Интеллект: "Инт",
  Выносливость: "Вын",
  Харизма: "Хар",
  Восприятие: "Вос",
  "Сила Воли": "СВ",
};

const grades = [1, 2, 3];

export const RaceCharcateristics = ({
  characteristics,
}: RaceCharacteristicsProps) => {
  return (
    <div className="border border-slate-800 bg-slate-900/10 rounded-lg overflow-hidden shrink-0">
      <Table className="w-full h-full text-xs text-center table-fixed">
        <TableHeader className="bg-slate-900/60 border-b border-slate-800">
          <TableRow className="border-none hover:bg-transparent h-8">
            <TableHead className="w-16 font-black text-slate-500 uppercase tracking-widest text-center border-r border-slate-800/50 bg-slate-950/10 p-0">
              г/х
            </TableHead>
            {charOrder.map((name) => (
              <TableHead
                key={name}
                className="font-bold text-slate-400 text-center border-r last:border-r-0 border-slate-800/50 p-0 text-[11px]"
              >
                {charShorts[name]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody >
          {grades.map((gradeLevel, gradeIndex) => (
            <TableRow
              key={gradeLevel}
              className={`h-7.5 hover:bg-slate-900/20 text-slate-300 `}
            >
              <td className="font-mono font-black text-slate-400 border-r border-slate-800/50 bg-slate-950/25 p-0">
                {gradeLevel === 1 ? "I" : gradeLevel === 2 ? "II" : "III"}
              </td>
              {charOrder.map((charName) => {
                const char = characteristics.find((c) => c.name === charName);
                const statValue = char?.values[gradeIndex] ?? "—";
                return (
                  <td
                    key={charName}
                    className={`p-0 border-r last:border-none border-slate-900/40 font-mono text-sm ${gradeLevel === 3 ? "text-amber-500/90 font-bold" : "text-slate-300"}`}
                  >
                    {statValue}
                  </td>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
