import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { skillTreeService } from "@/xml/SkillTreeXml";
import { useSkillTreeStore } from "@/stores/UseSkillTreeStore";
import { SpecializationEditor } from "./SpecializationEditor";

export function TreeInfo() {
  const currentTree = useSkillTreeStore((state) => state.currentTree);
  const loadTree = useSkillTreeStore((state) => state.loadTree);
  const createNewTree = useSkillTreeStore((state) => state.createNewTree);

  const [trees, setTrees] = useState<{ id: string; name: string }[]>([]);
  const [newTreeName, setNewTreeName] = useState("");

  const refreshList = async () => {
    const data = await skillTreeService.getAllTreesName();
    setTrees(data);
  };

  useEffect(() => {
    refreshList();
  }, []);

  return (
    <div className="space-y-3">
      {/* СЕЛЕКТ ВЫБОРА ДРЕВА */}
      <div className="space-y-1">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
          Выбор древа
        </label>
        <Select value={currentTree?.id} onValueChange={(val) => loadTree(val)}>
          <SelectTrigger className="w-full bg-slate-950 border-slate-800 text-slate-200">
            {/* 1. ЭТОТ КОМПОНЕНТ ОТВЕЧАЕТ ЗА ОТОБРАЖЕНИЕ ТЕКСТА */}
            <SelectValue placeholder="Выберите файл..." />
          </SelectTrigger>

          <SelectContent className="bg-slate-950 border-slate-800 text-slate-200">
            {trees.map(({ id, name }) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* СОЗДАНИЕ НОВОГО ДРЕВА */}
      <div className="flex gap-2">
        <Input
          className="bg-slate-950 border-slate-800 h-8 text-xs text-slate-200"
          placeholder="Новое древо..."
          value={newTreeName}
          onChange={(e) => setNewTreeName(e.target.value)}
        />
        <Button
          size="sm"
          variant="outline"
          className="h-8 border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10"
          onClick={async () => {
            if (!newTreeName) return;
            await createNewTree(newTreeName);
            setNewTreeName("");
            refreshList();
          }}
        >
          +
        </Button>
      </div>

      {/* ВОТ ЭТА КНОПКА (ТЕПЕРЬ НА SHADCN DIALOG) */}
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="secondary"
            className="w-full h-8 text-[10px] font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-300"
            disabled={!currentTree}
          >
            Настроить специализации
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px] bg-slate-950 border-slate-800 text-slate-200">
          <DialogHeader>
            <DialogTitle className="text-amber-500 font-serif">
              Специализации древа
            </DialogTitle>
            {/* <DialogDescription className="text-slate-400 text-xs">
              Редактирование доступных классов и их цветовых схем.
            </DialogDescription> */}
          </DialogHeader>
          {/* Контент редактора */}
          <div className="py-4">
            <SpecializationEditor />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
