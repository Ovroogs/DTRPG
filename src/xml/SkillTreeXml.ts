import {
  readTextFile,
  writeTextFile,
  BaseDirectory,
  exists,
  mkdir,
  readDir,
} from "@tauri-apps/plugin-fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { SkillTree, Specialization } from "../types/Skill"; // Путь к типам
import { SkillNode } from "../components/tree/SkillNode"; // Путь к ноде
import { Edge } from "@xyflow/react";

const APP_DIR = "DTRPG";

// Полностью чистый XML без атрибутов
const commonOptions = {
  ignoreAttributes: true,
  format: true,
  suppressEmptyNode: true,
};

export type SkillTreeSaveData = SkillTree & {
  nodes: SkillNode[];
  edges: Edge[];
};

export const skillTreeService = {
  // 1. Проверка директории
  async ensureDir() {
    const dirExists = await exists(APP_DIR, {
      baseDir: BaseDirectory.Document,
    });
    if (!dirExists) {
      await mkdir(APP_DIR, { baseDir: BaseDirectory.Document });
    }
  },

  // 2. Сохранение (Используем ваше новое свойство specializations)
  async save(data: SkillTreeSaveData) {
    await this.ensureDir();

    const fileName = `${data.id || data.name.replace(/\s+/g, "_")}.xml`;
    const filePath = `${APP_DIR}\\${fileName}`;

    const builder = new XMLBuilder(commonOptions);

    const xmlContent = builder.build({
      "?xml": { version: "1.0", encoding: "utf-8" },
      root: {
        id: data.id,
        name: data.name,
        // Запись структуры <specializations><specialization>...</specialization></specializations>
        specializations: {
          specialization: data.specializations,
        },
        graph: {
          nodes: {
            node: data.nodes,
          },
          edges: {
            edge: data.edges,
          },
        },
      },
    });

    await writeTextFile(filePath, xmlContent, {
      baseDir: BaseDirectory.Document,
    });
  },

  // 3. Загрузка по ID с линковкой цветов
  async loadById(id: string): Promise<SkillTreeSaveData | null> {
    const filePath = `${APP_DIR}\\${id}.xml`;

    if (!(await exists(filePath, { baseDir: BaseDirectory.Document }))) {
      return null;
    }

    const xml = await readTextFile(filePath, {
      baseDir: BaseDirectory.Document,
    });

    const parser = new XMLParser({
      ...commonOptions,
      isArray: (name, jpath) => {
        // Ноды и связи графа всегда должны быть массивами
        if (["node", "edge"].includes(name)) return true;

        // Переводим jpath в строку для безопасного поиска подстроки
        const pathString = String(jpath);
        if (
          name === "specialization" &&
          pathString.includes("root.specializations")
        ) {
          return true;
        }

        return false;
      },
      parseTagValue: true,
    });

    const result = parser.parse(xml);
    const root = result?.root;

    if (!root) return null;

    // Читаем корневые специализации
    const treeSpecializations: Specialization[] =
      root.specializations?.specialization ?? [];

    // Восстановление нод
    const rawNodes = root.graph?.nodes?.node ?? [];
    const restoredNodes = rawNodes.map((n: any) => {
      let xmlSpec = n.data?.info?.specialization;

      // Защита: если внутри ноды данные упали в массив, достаем объект
      if (Array.isArray(xmlSpec)) {
        xmlSpec = xmlSpec[0];
      }

      // Линковка с цветом из корня по id специализации
      const specId = xmlSpec?.id || xmlSpec;
      const actualSpec =
        treeSpecializations.find((s) => s.id === specId) || xmlSpec;

      return {
        ...n,
        id: String(n.id), // ID теперь берется из тега <id>
        data: {
          ...n.data,
          number: Number(n.data?.number ?? 0),
          info: {
            ...n.data?.info,
            skill: n.data?.info?.skill ?? {},
            // Передаем строго объект, рамка ноды гарантированно окрасится
            specialization: actualSpec || undefined,
          },
        },
      };
    }) as SkillNode[];

    // Восстановление связей
    const rawEdges = root.graph?.edges?.edge ?? [];
    const restoredEdges = rawEdges.map((e: any) => ({
      ...e,
      id: String(e.id),
    })) as Edge[];

    return {
      id: String(root.id),
      name: String(root.name),
      specializations: treeSpecializations, // Переименовано под ваш новый тип
      nodes: restoredNodes,
      edges: restoredEdges,
    };
  },

  // 4. Создание нового древа
  async createNew(name: string): Promise<SkillTreeSaveData> {
    const newId = `tree_${Date.now()}`;
    const newData: SkillTreeSaveData = {
      id: newId,
      name: name,
      specializations: [], // Переименовано под ваш новый тип
      nodes: [],
      edges: [],
    };

    await this.save(newData);
    return newData;
  },

  // 5. Поиск всех XML файлов
  async getAllTrees(): Promise<string[]> {
    await this.ensureDir();
    const entries = await readDir(APP_DIR, { baseDir: BaseDirectory.Document });

    return entries
      .filter((e) => e.name.endsWith(".xml") && e.name !== "skills.xml")
      .map((e) => e.name.replace(".xml", ""));
  },

  // 6. Сборка ID и реальных Имён для селекта
  async getAllTreesName(): Promise<{ id: string; name: string }[]> {
    const filePaths = await this.getAllTrees();
    const names: { id: string; name: string }[] = [];

    for (let index = 0; index < filePaths.length; index++) {
      const filePath = `${APP_DIR}\\${filePaths[index]}.xml`;
      const xml = await readTextFile(filePath, {
        baseDir: BaseDirectory.Document,
      });

      const parser = new XMLParser({
        ...commonOptions,
        isArray: (name) => ["node", "edge", "specialization"].includes(name),
        parseTagValue: true,
      });

      const result = parser.parse(xml);
      const root = result?.root;

      if (!root) continue;

      names.push({ id: String(root.id), name: String(root.name) });
    }

    return names;
  },
};
