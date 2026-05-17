import { SkillNode } from "@/components/tree/SkillNode";
import { emptySkill, Skill, SkillTree, Specialization } from "@/types/Skill";
import { skillTreeService } from "@/xml/SkillTreeXml";
import {
  Edge,
  Connection,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  NodeChange,
  EdgeChange,
} from "@xyflow/react";
import { create } from "zustand";

interface SkillTreeState {
  // Состояние графа и метаданные
  nodes: SkillNode[];
  edges: Edge[];
  currentTree: SkillTree | null;
  selectedNode: SkillNode | null;
  isLoading: boolean;

  // Экшены для XYFlow (Реакция на интерактив в браузере)
  onNodesChange: (changes: NodeChange<SkillNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  setSelectedNode: (node: SkillNode | null) => void;
  updateSelectedNodeSpecialization: (spec: Specialization | undefined) => void;

  // Операции над узлами (Бизнес-логика панели)
  addNode: () => void;
  deleteSelectedNode: () => void;

  // Экшены для синхронизации с Tauri (XML на диске)
  loadTree: (id: string) => Promise<void>;
  saveCurrentTree: () => Promise<void>;
  createNewTree: (name: string) => Promise<void>;
  updateSpecializations: (specs: Specialization[]) => void;
  // 1. Добавьте в интерфейс SkillTreeState:
  updateSelectedNodeSkill: (skill: Skill) => void;
}

export const useSkillTreeStore = create<SkillTreeState>((set, get) => ({
  nodes: [],
  edges: [],
  currentTree: null,
  selectedNode: null,
  isLoading: false,

  // Интеграция со стандартными механизмами изменения XYFlow
  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as SkillNode[],
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  onConnect: (connection) =>
    set((state) => ({
      edges: addEdge({ ...connection, type: "floating" }, state.edges),
    })),

  setSelectedNode: (node) => set({ selectedNode: node }),

  // Добавление новой ноды со случайными координатами
  addNode: () =>
    set((state) => {
      if (!state.currentTree) return {}; // Не даем создавать ноды без активного древа

      const newNodeId = `node_${Date.now()}`;
      const nextNumber = state.nodes.length + 1;

      const newNode: SkillNode = {
        id: newNodeId,
        type: "skillNode",
        position: { x: Math.random() * 200, y: Math.random() * 200 },
        data: {
          number: nextNumber,
          info: {
            skill: { ...emptySkill, name: `Навык ${nextNumber}` },
          },
        },
      };

      return { nodes: state.nodes.concat(newNode) };
    }),

  // Удаление выделенной ноды и связанных с ней линий
  deleteSelectedNode: () =>
    set((state) => {
      const { selectedNode } = state;
      if (!selectedNode) return {};

      return {
        nodes: state.nodes.filter((n) => n.id !== selectedNode.id),
        edges: state.edges.filter(
          (e) => e.source !== selectedNode.id && e.target !== selectedNode.id,
        ),
        selectedNode: null, // Сбрасываем фокус
      };
    }),

  // Загрузка XML файла через Tauri
  loadTree: async (id) => {
    set({ isLoading: true, selectedNode: null });
    try {
      const data = await skillTreeService.loadById(id);
      console.log(data);
      if (data) {
        set({
          currentTree: {
            id: data.id,
            name: data.name,
            specializations: data.specializations,
          },
          nodes: data.nodes,
          edges: data.edges,
        });
      }
    } catch (error) {
      console.error("Ошибка загрузки файла древа:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Запись XML файла на диск в документы Tauri
  saveCurrentTree: async () => {
    const { currentTree, nodes, edges } = get();
    if (!currentTree) return;

    try {
      await skillTreeService.save({
        ...currentTree,
        nodes,
        edges,
      });
      alert("Древо успешно сохранено на диск!");
    } catch (error) {
      console.error("Ошибка при сохранении XML:", error);
    }
  },

  // 2. Добавьте реализацию внутрь create:
  updateSelectedNodeSkill: (skill) =>
    set((state) => {
      const { selectedNode, nodes } = state;
      if (!selectedNode) return {};

      const updatedNode = {
        ...selectedNode,
        data: {
          ...selectedNode.data,
          info: {
            ...selectedNode.data.info,
            // Подставляем полностью объект навыка (id, name, description, tags)
            skill: skill,
          },
        },
      };

      return {
        nodes: nodes.map((n) => (n.id === selectedNode.id ? updatedNode : n)),
        selectedNode: updatedNode,
      };
    }),

  // Создание нового файла древа
  createNewTree: async (name) => {
    set({ isLoading: true, selectedNode: null });
    try {
      const newData = await skillTreeService.createNew(name);
      set({
        currentTree: {
          id: newData.id,
          name: newData.name,
          specializations: newData.specializations,
        },
        nodes: newData.nodes,
        edges: newData.edges,
      });
    } catch (error) {
      console.error("Ошибка при создании нового древа:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  // Обновление специализаций из модалки редактора
  updateSpecializations: (specs) =>
    set((state) => ({
      currentTree: state.currentTree
        ? { ...state.currentTree, specializations: specs } // Новое имя поля в соответствии с типом
        : null,
    })),

  updateSelectedNodeSpecialization: (spec) =>
    set((state) => {
      const { selectedNode, nodes } = state;
      if (!selectedNode) return {};

      // Формируем обновленную ноду с новой специализацией
      const updatedNode = {
        ...selectedNode,
        data: {
          ...selectedNode.data,
          info: {
            ...selectedNode.data.info,
            specialization: spec,
          },
        },
      };

      // Обновляем её в общем списке нод графа
      const updatedNodes = nodes.map((n) =>
        n.id === selectedNode.id ? updatedNode : n,
      );

      return {
        nodes: updatedNodes,
        selectedNode: updatedNode, // Обновляем и выделенную ноду, чтобы селект не сбрасывался
      };
    }),
}));
