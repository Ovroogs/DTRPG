import {
  readTextFile,
  writeTextFile,
  BaseDirectory,
  exists,
  mkdir,
} from "@tauri-apps/plugin-fs";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import { Skill } from "../types/Skill";

const APP_DIR = "DTRPG"; // Название вашей папки в Документах
const FILE_PATH = `${APP_DIR}\\skills.xml`;

const commonOptions = {
  ignoreAttributes: false, // Не игнорируем атрибуты (нужно для id)
  attributeNamePrefix: "@_", // Префикс для атрибутов в объекте JS
  format: true,
  suppressEmptyNode: true,
};

export const skillsService = {
  async save(skills: Skill[]) {
    await this.ensureDir();

    // Подготовка данных: переименовываем id в @_id, чтобы билдер понял, что это атрибут
    const preparedSkills = skills.map((s) => ({
      ...s,
      "@_id": s.id,
      id: undefined, // Удаляем оригинальный id, чтобы он не продублировался тегом
    }));

    const builder = new XMLBuilder(commonOptions);
    const xmlContent = builder.build({
      "?xml": { "@_version": "1.0", "@_encoding": "utf-8" },
      root: {
        skills: {
          skill: preparedSkills,
        },
      },
    });

    await writeTextFile(FILE_PATH, xmlContent, {
      baseDir: BaseDirectory.Document,
    });
  },

  async load(): Promise<Skill[]> {
    if (!(await exists(FILE_PATH, { baseDir: BaseDirectory.Document })))
      return [];

    const xml = await readTextFile(FILE_PATH, {
      baseDir: BaseDirectory.Document,
    });
    const parser = new XMLParser({
      ...commonOptions,
      isArray: (name) => ["skill", "tags"].includes(name),
    });

    const result = parser.parse(xml);
    const rawSkills = result?.root?.skills?.skill ?? [];

    // Конвертируем обратно: @_id -> id
    return rawSkills.map((s: any) => ({
      ...s,
      id: s["@_id"],
      "@_id": undefined,
    }));
  },

  async ensureDir() {
    if (!(await exists(APP_DIR, { baseDir: BaseDirectory.Document }))) {
      await mkdir(APP_DIR, { baseDir: BaseDirectory.Document });
    }
  },
};
