import React, { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { useSkillTreeStore } from "@/stores/UseSkillTreeStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { skillsService } from "@/xml/SkillXml"; // Сервис из вашей страницы SkillPage
import { Skill, emptySkill, Specialization } from "@/types/Skill";

export function SkillItemInfo() {
  const selectedNode = useSkillTreeStore((state) => state.selectedNode);
  const updateSelectedNodeSpecialization = useSkillTreeStore(
    (state) => state.updateSelectedNodeSpecialization,
  );
  const updateSelectedNodeSkill = useSkillTreeStore(
    (state) => state.updateSelectedNodeSkill,
  );

  const specializations = useSkillTreeStore(
    useShallow((state) => state.currentTree?.specializations ?? []),
  );

  // Локальный стейт для хранения списка ВСЕХ глобальных навыков из skills.xml
  const [globalSkills, setGlobalSkills] = useState<Skill[]>([]);

  // Загружаем навыки из skills.xml при открытии панели
  useEffect(() => {
    skillsService.load().then(setGlobalSkills);
  }, [selectedNode]); // Перезагружаем/синхронизируем при смене ноды

  if (!selectedNode) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center text-slate-500 italic">
        Выберите навык на древе для редактирования
      </div>
    );
  }

  const { skill, specialization: currentSpec } = selectedNode.data.info;
  const skillData = skill ?? emptySkill;

  const rowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: "8px",
    marginBottom: "12px",
    alignItems: "center",
  };

  return (
    <div className="flex flex-col gap-3 p-1 animate-in fade-in duration-300">
      <header className="space-y-1">
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="border-amber-500/50 text-amber-500 font-mono"
          >
            Node ID: {selectedNode.id.replace("node_", "")}
          </Badge>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter">
            Порядковый #{selectedNode.data.number}
          </span>
        </div>
      </header>

      <Separator className="bg-slate-800" />

      <div className="grid gap-1">
        {/* СЕЛЕКТ ВЫБОРА НАЗВАНИЯ НАВЫКА ИЗ SKILLS.XML */}
        <div style={rowStyle}>
          <Label className="text-slate-500 text-[10px] uppercase font-black">
            Выбрать Навык
          </Label>
          <Select
            value={skillData.id || undefined}
            onValueChange={(id) => {
              const foundSkill = globalSkills.find((s) => s.id === id);
              if (foundSkill) {
                updateSelectedNodeSkill(foundSkill); // Записываем данные в ноду
              }
            }}
          >
            <SelectTrigger className="h-8 bg-slate-900 border-slate-700 text-xs text-slate-200 focus:ring-amber-500/50">
              <SelectValue placeholder="Выберите навык..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
              {globalSkills.map((s) => (
                <SelectItem key={s.id} value={s.id || ""}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* АВТОПОДСТАНОВКА ОПИСАНИЯ */}
        <div className="grid grid-cols-[120px_1fr] items-baseline gap-1">
          <Label className="text-slate-500 text-[10px] uppercase font-black">
            Описание
          </Label>
          <p className="text-sm text-slate-300 leading-relaxed italic bg-slate-950/40 p-2 rounded border border-slate-900 min-h-12">
            {skillData.description || "Описание отсутствует (выберите навык)"}
          </p>
        </div>

        {/* СЕЛЕКТ СПЕЦИАЛИЗАЦИИ */}
        <div style={rowStyle}>
          <Label className="text-slate-500 text-[10px] uppercase font-black">
            Спец-ция
          </Label>
          <Select
            value={currentSpec?.id || "none"}
            onValueChange={(id) => {
              const found = specializations.find((s) => s.id === id);
              updateSelectedNodeSpecialization(found);
            }}
          >
            <SelectTrigger className="h-8 bg-slate-900 border-slate-700 text-xs text-slate-200 focus:ring-amber-500/50">
              <SelectValue placeholder="Выбрать..." />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-700 text-slate-200">
              <SelectItem value="none">Без специализации</SelectItem>
              {specializations.map((spec) => (
                <SelectItem key={spec.id} value={spec.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: spec.color }}
                    />
                    {spec.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* АВТОПОДСТАНОВКА ТЕГОВ */}
        <div className="grid grid-cols-[120px_1fr] items-baseline gap-2">
          <Label className="text-slate-500 text-[10px] uppercase font-black">
            Теги
          </Label>
          <div className="flex flex-wrap gap-1">
            {skillData.tags ? (
              String(skillData.tags)
                .split(",")
                .map((tag, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className="text-[10px] bg-slate-800 text-slate-300 border-none"
                  >
                    {tag.trim()}
                  </Badge>
                ))
            ) : (
              <span className="text-xs text-slate-600">—</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
