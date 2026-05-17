import { useEffect, useState } from "react";
import { emptySkill, Skill, Skills } from "../types/Skill";
import { skillsService } from "@/xml/SkillXml";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export const SkillPage = () => {
  return (
    <div className="flex gap-4 h-screen bg-slate-950 p-4 overflow-hidden">
      <SkillsEditor />
    </div>
  );
};

const SkillsEditor = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [formData, setFormData] = useState<Skill>(emptySkill);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    skillsService.load().then(setSkills);
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    let updated: Skill[];
    if (isEdit) {
      updated = skills.map((s) => (s.id === formData.id ? formData : s));
    } else {
      const newSkill = { ...formData, id: crypto.randomUUID() };
      updated = [...skills, newSkill];
    }

    setSkills(updated);
    await skillsService.save(updated);
    setFormData(emptySkill);
    setIsEdit(false);
  };

  const startEdit = (skill: Skill) => {
    setFormData(skill);
    setIsEdit(true);
  };

  const deleteSkill = async (id: string) => {
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    await skillsService.save(updated);
  };

  return (
    <div className="flex flex-col gap-4 w-80 h-full">
      {/* ФОРМА СОЗДАНИЯ/РЕДАКТИРОВАНИЯ */}
      <Card className="p-4 bg-slate-900 border-slate-800 shadow-xl shrink-0">
        <div className="space-y-4">
          <header className="text-center">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {isEdit ? "Редактирование" : "Новый навык"}
            </span>
          </header>

          <div className="space-y-3">
            <Input
              className="bg-slate-950 border-slate-800 text-slate-400"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Название..."
            />
            <Textarea
              className="bg-slate-950 border-slate-800 resize-none text-slate-400"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Описание..."
              rows={4}
            />
            <Input
              className="bg-slate-950 border-slate-800 text-slate-400"
              value={formData.tags as string}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
              placeholder="Теги (через запятую)..."
            />
          </div>

          <div className="flex gap-2">
            <Button
              className="flex-1 bg-amber-600 hover:bg-amber-500 font-bold"
              onClick={handleSave}
            >
              {isEdit ? "СОХРАНИТЬ" : "ДОБАВИТЬ"}
            </Button>
            {isEdit && (
              <Button
                variant="outline"
                onClick={() => {
                  setIsEdit(false);
                  setFormData(emptySkill);
                }}
              >
                ОТМЕНА
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Separator className="bg-slate-800" />

      {/* СПИСОК С ПОИСКОМ */}
      <div className="flex-1 flex flex-col min-h-0">
        <SkillList skills={skills} onEdit={startEdit} onDelete={deleteSkill} />
      </div>
    </div>
  );
};

interface SkillListProps {
  skills: Skills;
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
}

const SkillList = ({ skills, onEdit, onDelete }: SkillListProps) => {
  const [search, setSearch] = useState<string>("");

  const filtered = skills.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      <Input
        placeholder="Поиск навыка..."
        className="bg-slate-900 border-slate-800 h-9"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        {filtered.length === 0 ? (
          <div className="text-center py-10 text-slate-600 text-xs italic">
            Список пуст
          </div>
        ) : (
          filtered.map((skill) => (
            <Card
              key={skill.id}
              className="p-3 bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-bold text-slate-100 text-sm">
                    {skill.name}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[10px] text-amber-500"
                      onClick={() => onEdit(skill)}
                    >
                      ИЗМ.
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-[10px] text-red-500"
                      onClick={() => onDelete(skill.id || "")}
                    >
                      УДЛ.
                    </Button>
                  </div>
                </div>

                {skill.description && (
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {skill.description}
                  </p>
                )}

                {skill.tags && (
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant="secondary"
                      className="text-[9px] py-0 bg-slate-800 text-slate-400 border-none"
                    >
                      {skill.tags}
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
