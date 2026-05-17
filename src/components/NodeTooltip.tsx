"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useMemo,
} from "react";
import { NodeToolbar, type NodeToolbarProps } from "@xyflow/react";

/* TOOLTIP CONTEXT ---------------------------------------------------------- */

type TooltipContextType = {
  isVisible: boolean;
  showTooltip: () => void;
  hideTooltip: () => void;
};

const TooltipContext = createContext<TooltipContextType | null>(null);

/* TOOLTIP ROOT ------------------------------------------------------------- */

export function NodeTooltip({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = useCallback(() => setIsVisible(true), []);
  const hideTooltip = useCallback(() => setIsVisible(false), []);

  // Оборачиваем в useMemo, чтобы контекст не рендерился лишний раз
  const value = useMemo(
    () => ({ isVisible, showTooltip, hideTooltip }),
    [isVisible, showTooltip, hideTooltip],
  );

  return (
    <TooltipContext.Provider value={value}>{children}</TooltipContext.Provider>
  );
}

/* TOOLTIP TRIGGER ---------------------------------------------------------- */

export function NodeTooltipTrigger({
  children,
  ...props
}: React.ComponentProps<"div">) {
  const context = useContext(TooltipContext);
  if (!context)
    throw new Error("NodeTooltipTrigger must be used within NodeTooltip");

  return (
    <div
      onMouseEnter={context.showTooltip}
      onMouseLeave={context.hideTooltip}
      {...props}
    >
      {children}
    </div>
  );
}

/* TOOLTIP CONTENT ---------------------------------------------------------- */

export function NodeTooltipContent({
  children,
  position,
  className,
  ...props
}: NodeToolbarProps) {
  const context = useContext(TooltipContext);
  if (!context)
    throw new Error("NodeTooltipContent must be used within NodeTooltip");

  return (
    <NodeToolbar
      isVisible={context.isVisible}
      position={position}
      // Стили Shadcn + Tailwind v4
      className={`
        bg-slate-900 border border-slate-800 text-slate-100 
        p-2 rounded-md shadow-xl text-xs min-w-32
        animate-in fade-in zoom-in duration-150
        ${className || ""}
      `}
      {...props}
    >
      {children}
    </NodeToolbar>
  );
}
