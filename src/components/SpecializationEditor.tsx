import { useSkillTreeStore } from "@/stores/UseSkillTreeStore";
import {
  Specialization,
  Specializations,
  emptySpecialization,
} from "@/types/Skill";
import {
  Text,
  Flex,
  Card,
  TextInput,
  Button,
  Popover,
} from "@gravity-ui/uikit";

import { useState } from "react";
import { HexAlphaColorPicker } from "react-colorful";

type SpecializationListProps = {
  specializations: Specializations;
  onEdit: (skill: Specialization) => void;
  onDelete: (id: string) => void;
};

export const SpecializationEditor: React.FC = () => {
  // Связываем редактор со стором напрямую
  const specializations = useSkillTreeStore(
    (state) => state.currentTree?.specialization ?? [],
  );
  const updateSpecializations = useSkillTreeStore(
    (state) => state.updateSpecializations,
  );

  const [formData, setFormData] = useState<Specialization>(emptySpecialization);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const updateField = (field: keyof Specialization, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) return;

    let updated: Specialization[];
    if (isEdit) {
      updated = specializations.map((s) =>
        s.id === formData.id ? formData : s,
      );
    } else {
      const newSpec = { ...formData, id: `spec_${Date.now()}` };
      updated = [...specializations, newSpec];
    }

    updateSpecializations(updated); // Обновляем состояние стора
    cancelEdit();
  };

  const startEdit = (spec: Specialization) => {
    setFormData(spec);
    setIsEdit(true);
  };

  const cancelEdit = () => {
    setFormData(emptySpecialization);
    setIsEdit(false);
  };

  const handleDelete = (id: string) => {
    const updated = specializations.filter((s) => s.id !== id);
    updateSpecializations(updated);
  };

  return (
    <Flex
      direction="column"
      gap="4"
      style={{ minWidth: "350px", maxHeight: "70vh", boxSizing: "border-box" }}
    >
      <Card view="filled" style={{ padding: "16px", flexShrink: 0 }}>
        <Flex direction="column" gap="3">
          <Text
            variant="caption-1"
            color="secondary"
            style={{ textAlign: "center", textTransform: "uppercase" }}
          >
            {isEdit ? "Редактирование" : "Новая специализация"}
          </Text>

          <TextInput
            label="Название"
            value={formData.name}
            onUpdate={(v) => updateField("name", v)}
            placeholder="Напр: Разрушение"
          />

          <TextInput
            label="Цвет"
            value={formData.color}
            onUpdate={(v) => updateField("color", v)}
            startContent={
              <Popover
                placement="bottom-start"
                content={
                  <div style={{ padding: "12px" }}>
                    <HexAlphaColorPicker
                      color={formData.color || "#ffffff"}
                      onChange={(v) => updateField("color", v)}
                    />
                  </div>
                }
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    marginLeft: "8px",
                    borderRadius: "4px",
                    backgroundColor: formData.color || "#ffffff",
                    cursor: "pointer",
                    border: "2px solid var(--g-color-line-generic)",
                  }}
                />
              </Popover>
            }
          />

          <Flex gap={2}>
            <Button
              view="action"
              size="l"
              onClick={handleSave}
              style={{ flexGrow: 1 }}
              disabled={!formData.name.trim()}
            >
              {isEdit ? "Сохранить" : "Добавить"}
            </Button>
            {isEdit && (
              <Button size="l" onClick={cancelEdit}>
                Отмена
              </Button>
            )}
          </Flex>
        </Flex>
      </Card>

      <Flex direction="column" style={{ overflow: "hidden", flexGrow: 1 }}>
        <Text
          variant="caption-1"
          color="secondary"
          style={{ marginBottom: "8px" }}
        >
          ВСЕ СПЕЦИАЛИЗАЦИИ ({specializations.length})
        </Text>
        <SpecializationList
          specializations={specializations}
          onEdit={startEdit}
          onDelete={handleDelete}
        />
      </Flex>
    </Flex>
  );
};

const SpecializationList = ({
  specializations,
  onEdit,
  onDelete,
}: SpecializationListProps) => {
  if (!specializations || specializations.length === 0) {
    return <Text color="secondary">Список пуст</Text>;
  }

  const [search, setSearch] = useState<string>("");

  const filteredSkills = specializations.filter((item) =>
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
            <Flex justifyContent={"space-between"} gap={1}>
              <Flex gap={1}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    margin: "0 8px",
                    borderRadius: "4px",
                    backgroundColor: element.color || "#ffffff",
                    cursor: "pointer",
                    border: "1px solid var(--g-color-line-generic)",
                  }}
                />
                <Text variant="subheader-1">{element.name}</Text>
              </Flex>
              <Flex style={{ alignSelf: "flex-end" }} gap={2}>
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
