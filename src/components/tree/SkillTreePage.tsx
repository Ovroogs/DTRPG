import { ReactFlow, Background } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SkillNode } from "./SkillNode";
import { TreeInfo } from "./TreeInfo";
import { SkillItemInfo } from "./SkillItemInfo";
import FloatingEdge from "./FloatingEdge";
import { useSkillTreeStore } from "@/stores/UseSkillTreeStore";

const nodeTypes = { skillNode: SkillNode };
const edgeTypes = { floating: FloatingEdge };

const defaultEdgeOptions = {
  animated: true,
  style: { stroke: "var(--color-slate-700)", strokeWidth: 2 },
};

export function SkillTreePage() {
  const {
    nodes,
    edges,
    currentTree,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNode,
    addNode,
    deleteSelectedNode,
    saveCurrentTree,
  } = useSkillTreeStore();

  return (
    <div className="flex w-screen h-full bg-slate-950 text-slate-200 overflow-hidden">
      {/* ЛЕВАЯ ПАНЕЛЬ */}
      <aside className="w-80 flex flex-col border-r border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        {/* ВЕРХ: Управление файлами и деревом */}
        <section className="p-4 space-y-4">
          <TreeInfo />
          <Button
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold"
            onClick={saveCurrentTree}
            disabled={!currentTree}
          >
            СОХРАНИТЬ В XML
          </Button>
        </section>

        <Separator className="bg-slate-800" />

        {/* ЦЕНТР: Информация о выбранной ноде */}
        <section className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <SkillItemInfo />
        </section>

        <Separator className="bg-slate-800" />

        {/* НИЗ: Кнопки действий над графом */}
        <section className="p-4 grid gap-2">
          <Button
            variant="secondary"
            className="w-full bg-emerald-900/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/40"
            onClick={addNode}
            disabled={!currentTree}
          >
            + ДОБАВИТЬ НАВЫК
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="border-slate-700 text-slate-300 hover:text-white"
              disabled={!selectedNode}
            >
              ИЗМЕНИТЬ
            </Button>
            <Button
              variant="destructive"
              className="bg-red-900/20 text-red-400 border border-red-500/30 hover:bg-red-900/40"
              onClick={deleteSelectedNode}
              disabled={!selectedNode}
            >
              УДАЛИТЬ
            </Button>
          </div>
        </section>
      </aside>

      {/* ПРАВАЯ ЧАСТЬ: ХОЛСТ */}
      <main className="flex-1 relative bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={(_, node) => setSelectedNode(node)}
          onPaneClick={() => setSelectedNode(null)}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
        >
          <Background color="#0f172a" />
        </ReactFlow>
      </main>
    </div>
  );
}
