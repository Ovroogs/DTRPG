import { useSkillTreeStore } from "@/stores/UseSkillTreeStore";
import { skillTreeService } from "@/xml/SkillTreeXml";
import { Flex, Button, Modal, Text, Select } from "@gravity-ui/uikit";
import { useState, useEffect } from "react";
import { SpecializationEditor } from "./SpecializationEditor";
import { Pair } from "@/types/Others";


export const TreeInfo = () => {
  const currentTree = useSkillTreeStore((state) => state.currentTree);
  const loadTree = useSkillTreeStore((state) => state.loadTree);
  const createNewTree = useSkillTreeStore((state) => state.createNewTree);

  const [options, setOptions] = useState<Pair[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Функция загрузки списка файлов из папки DTRPG
  const refreshTreeList = async () => {
    try {
      const treeFiles = await skillTreeService.getAllTreesName();
      const newOptions = treeFiles.map((pair) => ({
        value: pair.id,
        content: pair.name,
      }));
      setOptions(newOptions);
    } catch (error) {
      console.error("Ошибка при получении списка древ:", error);
    }
  };

  // Загружаем список при монтировании компонента
  useEffect(() => {
    refreshTreeList();
  }, []);
  console.log(options);
  return (
    <Flex direction="column" gap={3}>
      <Text variant="caption-1" color="secondary">
        ТЕКУЩЕЕ ДРЕВО
      </Text>

      <Select
        filterable
        placeholder="Выберите или введите название..."
        size="l"
        width="max"
        options={options}
        value={currentTree?.name ? [currentTree.name] : []}
        onUpdate={(vals) => {
          if (vals && vals.length > 0) {
            loadTree(vals[0]); // Вызываем асинхронный метод стора
          }
        }}
        onFilterChange={setSearchValue}
        renderEmptyOptions={() => (
          <div style={{ padding: "10px" }}>
            <Button
              view="flat-success"
              width="max"
              onClick={async () => {
                if (!searchValue) return;
                await createNewTree(searchValue); // Создаем через стор
                await refreshTreeList();
              }}
            >
              Создать "{searchValue}"
            </Button>
          </div>
        )}
      />

      <Button
        view="flat-secondary"
        size="m"
        width="max"
        onClick={() => setIsModalOpen(true)}
        disabled={!currentTree} // Не даем настраивать, если древо не выбрано
      >
        Настроить специализации
      </Button>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div
          style={{
            padding: "20px",
            backgroundColor: "var(--g-color-base-background)",
            borderRadius: "8px",
            minWidth: "450px",
          }}
        >
          <Text
            variant="subheader-2"
            style={{ marginBottom: "15px", display: "block" }}
          >
            Управление специализациями
          </Text>

          {/* Больше никаких пропсов передавать не нужно! */}
          <SpecializationEditor />

          <Flex justifyContent="flex-end" style={{ marginTop: "20px" }}>
            <Button view="action" onClick={() => setIsModalOpen(false)}>
              Готово
            </Button>
          </Flex>
        </div>
      </Modal>
    </Flex>
  );
};
