import React, { useCallback, useState } from "react";
import { Handle, Position, NodeProps, Node, NodeToolbar } from "@xyflow/react";
import { SkillInfo } from "@/types/Skill";

export type SkillSelectorNodeData = {
  number: number;
  info: SkillInfo;
};

// Типизация для React Flow
export type SkillNode = Node<SkillSelectorNodeData, "skillNode">;

// Стили для скрытия стандартных кружков Handle (чтобы они были невидимы, но работали)
const handleStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  minWidth: "100%",
  minHeight: "100%",
  position: "absolute",
  top: 0,
  left: 0,
  transform: "none",
  zIndex: 1,
};

export const SkillNode: React.FC<NodeProps<SkillNode>> = ({ data, selected }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = useCallback(() => setIsVisible(true), []);
  const hideTooltip = useCallback(() => setIsVisible(false), []);

  // Цвет берем из специализации, если ее нет — дефолтный серый
  const specColor = data.info.specialization?.color || "var(--g-color-line-generic)";

  return (
    <>
      {/* Всплывающая подсказка при наведении */}
      <NodeToolbar 
        isVisible={isVisible && !!data.info.skill.name} 
        position={Position.Top}
      >
        <div style={{
          background: 'var(--g-color-base-background)',
          padding: '8px 12px',
          borderRadius: '8px',
          border: '1px solid var(--g-color-line-generic)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          fontSize: '13px',
          minWidth: '150px',
          pointerEvents: 'none', // Чтобы тултип не мешал кликам
        }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
            {data.info.skill.name}
          </div>
          {data.info.skill.description && (
            <div style={{ color: 'var(--g-color-text-secondary)', fontSize: '11px' }}>
              {data.info.skill.description}
            </div>
          )}
        </div>
      </NodeToolbar>

      {/* Основное тело узла */}
      <div
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        style={{
          width: "44px",
          height: "44px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          // Если узел выбран, красим рамку в акцентный цвет, иначе в цвет специализации
          border: `3px solid ${selected ? 'var(--g-color-line-info-solid)' : specColor}`,
          background: "var(--g-color-base-background)",
          color: "var(--g-color-text-primary)",
          transition: "all 0.2s ease-in-out",
          boxShadow: selected ? "0 0 12px var(--g-color-line-info-solid)" : "none",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {/* Таргеты (входы) — ID должны быть уникальными */}
        <Handle type="target" position={Position.Top} id="t-top" style={handleStyle} />
        <Handle type="target" position={Position.Bottom} id="t-bottom" style={handleStyle} />
        <Handle type="target" position={Position.Left} id="t-left" style={handleStyle} />
        <Handle type="target" position={Position.Right} id="t-right" style={handleStyle} />
        
        {/* Сорсы (выходы) — ID должны быть уникальными */}
        <Handle type="source" position={Position.Top} id="s-top" style={handleStyle} />
        <Handle type="source" position={Position.Bottom} id="s-bottom" style={handleStyle} />
        <Handle type="source" position={Position.Left} id="s-left" style={handleStyle} />
        <Handle type="source" position={Position.Right} id="s-right" style={handleStyle} />

        {/* Число внутри узла */}
        <span style={{ 
          fontSize: "16px", 
          fontWeight: 700, 
          zIndex: 2, // Чтобы текст был поверх хендлов
          userSelect: "none" 
        }}>
          {data.number}
        </span>
      </div>
    </>
  );
};