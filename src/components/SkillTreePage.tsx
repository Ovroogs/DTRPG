import { ReactFlow, Background } from "@xyflow/react";
import { SkillNode } from "./SkillNode";
import FloatingEdge from "./FloatingEdge";
import { Button, Flex } from "@gravity-ui/uikit";
import { useSkillTreeStore } from "@/stores/UseSkillTreeStore";
import { SkillItemInfo } from "./SkillItemInfo";
import { TreeInfo } from "./TreeInfo";

const nodeTypes = {
  skillNode: SkillNode,
};

const edgeTypes = {
  floating: FloatingEdge,
};

const defaultEdgeOptions = {
  type: "floating",
  animated: true,
  style: { stroke: "var(--g-color-line-generic)", strokeWidth: 2 },
};

export const SkillTreePage = () => {
  // Подключаем необходимые данные и методы из Zustand-стора
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
    <Flex width="100%" height="100%">
      {/* ЛЕВАЯ ПАНЕЛЬ УПРАВЛЕНИЯ */}
      <Flex
        direction="column"
        width="30%"
        minWidth="320px"
        style={{
          borderRight: "1px solid var(--g-color-line-generic)",
          padding: "16px",
          backgroundColor: "var(--g-color-base-background)",
        }}
      >
        {/* Блок 1: Выбор древа, создание и общая кнопка сохранения в XML */}
        <Flex direction="column" gap={4} style={{ marginBottom: "20px" }}>
          <TreeInfo />
          <Button
            width="max"
            view="action"
            onClick={saveCurrentTree}
            disabled={!currentTree}
          >
            СОХРАНИТЬ ВСЁ
          </Button>
        </Flex>

        {/* Блок 2: Карточка просмотра выбранного навыка */}
        <Flex
          direction="column"
          grow={1}
          style={{
            border: "1px solid var(--g-color-line-generic)",
            borderRadius: "8px",
            padding: "12px",
            overflowY: "auto",
            marginBottom: "16px",
          }}
        >
          <SkillItemInfo />
        </Flex>

        {/* Блок 3: Кнопки манипуляции с нодами на холсте */}
        <Flex direction="column" gap={2}>
          <Button
            width="max"
            view="flat-success"
            size="l"
            onClick={addNode}
            disabled={!currentTree}
          >
            ДОБАВИТЬ НАВЫК
          </Button>
          <Button
            width="max"
            view="flat-info"
            size="l"
            disabled={!selectedNode}
          >
            ИЗМЕНИТЬ
          </Button>
          <Button
            width="max"
            view="flat-danger"
            size="l"
            onClick={deleteSelectedNode}
            disabled={!selectedNode}
          >
            УДАЛИТЬ
          </Button>
        </Flex>
      </Flex>

      {/* ПРАВАЯ ЧАСТЬ: ИНТЕРАКТИВНЫЙ ХОЛСТ ГРАФА */}
      <div style={{ flexGrow: 1, height: "100%" }}>
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
          <Background color="#333" gap={20} />
        </ReactFlow>
      </div>
    </Flex>
  );
};
