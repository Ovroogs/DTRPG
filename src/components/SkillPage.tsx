import {
  Card,
  Button,
  Flex,
  Text,
  TextArea,
  TextInput,
} from "@gravity-ui/uikit";
import { useEffect, useState } from "react";
import { emptySkill, Skill, Skills } from "../types/Skill";
import { skillsService } from "@/xml/SkillXml";

export const SkillPage = () => {
  return (
    <Flex gap={1}>
      <SkillsEditor />
      {/* <SpecializationEditor /> */}
    </Flex>
  );
};

const SkillsEditor = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [formData, setFormData] = useState<Skill>(emptySkill);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  useEffect(() => {
    skillsService.load().then(setSkills);
  }, []);

  const handleSave = async () => {
    if (!formData.name.trim()) return;

    let updated: Skill[];
    if (isEdit) {
      updated = skills.map((s) => (s.id === formData.id ? formData : s));
    } else {
      const newSkill = { ...formData, id: crypto.randomUUID() };
      updated = [...skills, newSkill];
    }

    setSkills(updated);
    await skillsService.save(updated);
    setFormData(emptySkill);
    setIsEdit(false);
  };

  const startEdit = (skill: Skill) => {
    setFormData(skill);
    setIsEdit(true);
  };

  const deleteSkill = async (id: string) => {
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    await skillsService.save(updated);
  };

  const updateForm = (field: keyof Skill, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Flex
      direction="column"
      gap="2"
      height={"100vh"}
      minWidth={"300px"}
      style={{ padding: "10px", boxSizing: "border-box" }}
    >
      <Card view="filled" style={{ padding: "10px", flexShrink: 0 }}>
        <Flex direction="column" gap="2">
          <Text variant="body-3" style={{ textAlign: "center" }}>
            {isEdit ? "РЕДАКТИРОВАНИЕ" : "НОВЫЙ СКИЛЛ"}
          </Text>
          <TextInput
            value={formData.name}
            onUpdate={(v) => updateForm("name", v)}
            placeholder="Название..."
          />
          <TextArea
            value={formData.description}
            onUpdate={(v) => updateForm("description", v)}
            placeholder="Описание..."
            rows={4}
          />
          <TextInput
            value={formData.tags as string}
            onUpdate={(v) => updateForm("tags", v)}
            placeholder="Теги..."
          />

          <Flex gap={2}>
            <Button
              view="action"
              size="l"
              onClick={handleSave}
              style={{ flexGrow: 1 }}
            >
              {isEdit ? "Сохранить" : "Добавить"}
            </Button>
            {isEdit && (
              <Button
                size="l"
                onClick={() => {
                  setIsEdit(false);
                  setFormData(emptySkill);
                }}
              >
                Отмена
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>

      <SkillList skills={skills} onEdit={startEdit} onDelete={deleteSkill} />
    </Flex>
  );
};

type SkillListProps = {
  skills: Skills;
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
};

const SkillList = ({ skills, onEdit, onDelete }: SkillListProps) => {
  if (!skills || skills.length === 0) {
    return <Text color="secondary">Список пуст</Text>;
  }

  const [search, setSearch] = useState<string>("");

  const filteredSkills = skills.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Flex
      gap={2}
      direction="column"
      style={{ flexGrow: 1, overflow: "hidden" }}
    >
      <TextInput onUpdate={setSearch} />
      <Flex
        direction="column"
        gap="2"
        style={{ overflowY: "auto", flexGrow: 1, paddingRight: "8px" }}
      >
        {filteredSkills.map((element) => (
          <Card key={element.id} style={{ padding: "12px", flexShrink: 0 }}>
            <Flex direction="column" gap={2}>
              <Text variant="subheader-1">{element.name}</Text>
              <Text variant="body-1" color="secondary">
                {element.description}
              </Text>
              <Text variant="body-1" color="secondary">
                {element.tags}
              </Text>
              <Flex gap={2}>
                <Button view="flat-action" onClick={() => onEdit(element)}>
                  Изменить
                </Button>
                <Button
                  view="flat-danger"
                  onClick={() => onDelete(element.id ?? "")}
                >
                  Удалить
                </Button>
              </Flex>
            </Flex>
          </Card>
        ))}
      </Flex>
    </Flex>
  );
};
