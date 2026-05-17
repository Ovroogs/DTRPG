import { useState } from "react";
import { Handle, Position, NodeProps, Node, NodeToolbar } from "@xyflow/react";
import { SkillInfo } from "@/types/Skill";

export type SkillSelectorNodeData = {
  number: number;
  info: SkillInfo;
};

export type SkillNode = Node<SkillSelectorNodeData, "skillNode">;

/**
 * Прозрачные невидимые области для коннектов.
 * Каждая занимает свою четверть круга для точного позиционирования.
 */
const baseHandleClass = "absolute !bg-transparent !border-none z-10";

export function SkillNode({ data, selected }: NodeProps<SkillNode>) {
  const [isVisible, setIsVisible] = useState(false);

  // Цвет из специализации или дефолтный Slate из Tailwind
  const specColor = data.info.specialization?.color || "#fff";
  // console.log(specColor)
  return (
    <>
      <NodeToolbar
        isVisible={isVisible && !!data.info.skill.name}
        position={Position.Top}
        className="z-50"
      >
        <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg shadow-2xl min-w-40 animate-in fade-in zoom-in duration-200">
          <div className="font-bold text-slate-100 text-sm">
            {data.info.skill.name}
          </div>
          {data.info.skill.description && (
            <div className="text-slate-400 text-[11px] leading-tight mt-1">
              {data.info.skill.description}
            </div>
          )}
        </div>
      </NodeToolbar>

      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className={`
          relative w-11 h-11 flex items-center justify-center rounded-full
          bg-slate-950 transition-all duration-300 cursor-pointer
          border-[3px] 
        `}
        style={{
          borderColor: selected ? "var(--color-amber-500)" : specColor,
          boxShadow: selected
            ? "0 0 15px var(--color-amber-500)"
            : `0 0 10px ${specColor}40`, // Легкое свечение в цвет ветки
        }}
      >
        {/* Хендлы разделены на зоны: верх, низ, лево, право */}
        <Handle
          type="target"
          position={Position.Top}
          id="t-t"
          className={`${baseHandleClass} w-full h-1/2 top-0`}
        />
        <Handle
          type="target"
          position={Position.Bottom}
          id="t-b"
          className={`${baseHandleClass} w-full h-1/2 bottom-0`}
        />
        <Handle
          type="target"
          position={Position.Left}
          id="t-l"
          className={`${baseHandleClass} w-1/2 h-full left-0`}
        />
        <Handle
          type="target"
          position={Position.Right}
          id="t-r"
          className={`${baseHandleClass} w-1/2 h-full right-0`}
        />

        <Handle
          type="source"
          position={Position.Top}
          id="s-t"
          className={`${baseHandleClass} w-full h-1/2 top-0`}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="s-b"
          className={`${baseHandleClass} w-full h-1/2 bottom-0`}
        />
        <Handle
          type="source"
          position={Position.Left}
          id="s-l"
          className={`${baseHandleClass} w-1/2 h-full left-0`}
        />
        <Handle
          type="source"
          position={Position.Right}
          id="s-r"
          className={`${baseHandleClass} w-1/2 h-full right-0`}
        />

        <span className="text-base font-black text-slate-100 z-20 select-none">
          {data.number}
        </span>
      </div>
    </>
  );
}
