import { useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";
import { useSkillTreeStore } from "@/stores/UseSkillTreeStore";
import {
  Specialization,
  emptySpecialization,
  Specializations,
} from "@/types/Skill";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function SpecializationEditor() {
  const specializations = useSkillTreeStore(
    (state) => state.currentTree?.specializations ?? [],
  );
  const updateSpecializations = useSkillTreeStore(
    (state) => state.updateSpecializations,
  );

  const [formData, setFormData] = useState<Specialization>(emptySpecialization);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleSave = () => {
    if (!formData.name.trim()) return;

    const updated = isEdit
      ? specializations.map((s) => (s.id === formData.id ? formData : s))
      : [...specializations, { ...formData, id: `spec_${Date.now()}` }];

    updateSpecializations(updated);
    cancelEdit();
  };

  const cancelEdit = () => {
    setFormData(emptySpecialization);
    setIsEdit(false);
  };

  return (
    <div className="flex flex-col gap-3 max-h-[80vh]">
      {/* ФОРМА ВВОДА */}
      <Card className="p-3 bg-slate-900 border-slate-800 shadow-xl min-h-60">
        <div className="space-y-3">
          <header className="text-center">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {isEdit ? "Редактирование" : "Новая специализация"}
            </span>
          </header>

          <div className="space-y-1">
            <Label className="text-xs text-slate-400">Название</Label>
            <Input
              className="bg-slate-950 text-slate-200 border-slate-800 h-9"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Напр: Разрушение"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs text-slate-400">Цвет ветки</Label>
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    className="w-10 h-9 rounded border border-slate-800 shrink-0 transition-transform hover:scale-105"
                    style={{ backgroundColor: formData.color || "#ffffff" }}
                  />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-3 bg-slate-900 border-slate-800">
                  <HexAlphaColorPicker
                    color={formData.color || "#ffffff"}
                    onChange={(color) => setFormData({ ...formData, color })}
                  />
                </PopoverContent>
              </Popover>
              <Input
                className="bg-slate-950 text-slate-200 border-slate-800 h-9 font-mono text-xs"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              className="flex-1 bg-amber-600 hover:bg-amber-500 font-bold"
              onClick={handleSave}
              disabled={!formData.name.trim()}
            >
              {isEdit ? "СОХРАНИТЬ" : "ДОБАВИТЬ"}
            </Button>
            {isEdit && (
              <Button
                variant="outline"
                onClick={cancelEdit}
                className="border-slate-700"
              >
                ОТМЕНА
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Separator className="bg-slate-800" />

      {/* СПИСОК */}
      <div className="flex-1 flex flex-col min-h-0">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
          Список ({specializations.length})
        </span>
        <SpecializationList
          specializations={specializations}
          onEdit={(s) => {
            setFormData(s);
            setIsEdit(true);
          }}
          onDelete={(id) =>
            updateSpecializations(specializations.filter((s) => s.id !== id))
          }
        />
      </div>
    </div>
  );
}

interface ListProps {
  specializations: Specializations;
  onEdit: (s: Specialization) => void;
  onDelete: (id: string) => void;
}

function SpecializationList({ specializations, onEdit, onDelete }: ListProps) {
  const [search, setSearch] = useState("");

  const filtered = specializations.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-2 flex-1 min-h-0">
      <Input
        placeholder="Поиск..."
        className="bg-slate-950 border-slate-800 h-8 text-xs mb-1"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-slate-600 text-xs italic">
            Пусто
          </div>
        ) : (
          filtered.map((spec) => (
            <Card
              key={spec.id}
              className="p-2 bg-slate-900/40 border-slate-800 hover:bg-slate-800/40 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 truncate">
                  <div
                    className="w-4 h-4 rounded-full border border-white/10 shrink-0"
                    style={{ backgroundColor: spec.color || "#ffffff" }}
                  />
                  <span className="text-sm font-medium text-slate-200 truncate">
                    {spec.name}
                  </span>
                </div>

                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[10px] text-amber-500 hover:text-amber-400 hover:bg-amber-500/10"
                    onClick={() => onEdit(spec)}
                  >
                    ИЗМ.
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[10px] text-red-500 hover:text-red-400 hover:bg-red-500/10"
                    onClick={() => onDelete(spec.id || "")}
                  >
                    УДЛ.
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
