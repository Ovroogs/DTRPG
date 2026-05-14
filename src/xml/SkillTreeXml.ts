import {
  readTextFile,
  writeTextFile,
  BaseDirectory,
  exists,
  mkdir,
  readDir,
} from "@tauri-apps/plugin-fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { SkillTree } from "../types/Skill"; // Пути к вашим типам
import { SkillNode } from "../components/SkillNode"; // Путь к типу ноды
import { Edge } from "@xyflow/react";

const APP_DIR = "DTRPG";
const commonOptions = {
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  format: true,
  suppressEmptyNode: true,
};

export type SkillTreeSaveData = SkillTree & {
  nodes: SkillNode[];
  edges: Edge[];
};

export const skillTreeService = {
  // 1. Обеспечение наличия папки
  async ensureDir() {
    const dirExists = await exists(APP_DIR, {
      baseDir: BaseDirectory.Document,
    });
    if (!dirExists) {
      await mkdir(APP_DIR, { baseDir: BaseDirectory.Document });
    }
  },

  // 2. Сохранение древа в XML
  async save(data: SkillTreeSaveData) {
    await this.ensureDir();

    // Генерируем имя файла на основе ID или Имени
    const fileName = `${data.id || data.name.replace(/\s+/g, "_")}.xml`;
    const filePath = `${APP_DIR}\\${fileName}`;

    const builder = new XMLBuilder(commonOptions);

    // Подготовка данных для XML (перенос id в атрибуты)
    const xmlContent = builder.build({
      "?xml": { "@_version": "1.0", "@_encoding": "utf-8" },
      root: {
        id: data.id,
        name: data.name,
        specializations: {
          specialization: data.specialization,
        },
        graph: {
          nodes: {
            node: data.nodes.map((n) => ({
              ...n,
              "@_id": n.id,
              id: undefined,
            })),
          },
          edges: {
            edge: data.edges.map((e) => ({
              ...e,
              "@_id": e.id,
              id: undefined,
            })),
          },
        },
      },
    });

    await writeTextFile(filePath, xmlContent, {
      baseDir: BaseDirectory.Document,
    });
  },

  // 3. Загрузка конкретного древа по ID (имени файла)
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
      isArray: (name) => ["node", "edge", "specialization"].includes(name),
      parseTagValue: true,
      parseAttributeValue: true,
    });

    const result = parser.parse(xml);
    const root = result?.root;

    if (!root) return null;

    return {
      id: root.id,
      name: root.name,
      specialization: root.specializations?.specialization ?? [],
      nodes: (root.graph?.nodes?.node ?? []).map((n: any) => ({
        ...n,
        id: n["@_id"],
      })),
      edges: (root.graph?.edges?.edge ?? []).map((e: any) => ({
        ...e,
        id: e["@_id"],
      })),
    };
  },

  // 4. Создание нового пустого древа
  async createNew(name: string): Promise<SkillTreeSaveData> {
    const newId = `tree_${Date.now()}`;
    const newData: SkillTreeSaveData = {
      id: newId,
      name: name,
      specialization: [],
      nodes: [],
      edges: [],
    };

    await this.save(newData);
    return newData;
  },

  // 5. Получение списка всех файлов (кроме основного списка скиллов)
  async getAllTrees(): Promise<string[]> {
    await this.ensureDir();
    const entries = await readDir(APP_DIR, { baseDir: BaseDirectory.Document });

    return entries
      .filter((e) => e.name.endsWith(".xml") && e.name !== "skills.xml")
      .map((e) => e.name.replace(".xml", ""));
  },

  async getAllTreesName(): Promise<{ id: string; name: string }[]> {
    const filePaths = await this.getAllTrees();
    const names: { id: string; name: string }[] = new Array(filePaths.length);
    // names.length = filePaths.length
    for (let index = 0; index < filePaths.length; index++) {
      const filePath = `${APP_DIR}\\${filePaths[index]}.xml`;
      const xml = await readTextFile(filePath, {
        baseDir: BaseDirectory.Document,
      });

      const parser = new XMLParser({
        ...commonOptions,
        isArray: (name) => ["node", "edge", "specialization"].includes(name),
        parseTagValue: true,
        parseAttributeValue: true,
      });

      const result = parser.parse(xml);
      const root = result?.root;

      if (!root) continue;
      
      names[index] = { id: root.id, name: root.name};
    }

    return names;
  },
};
