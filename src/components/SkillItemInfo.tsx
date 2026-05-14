import React from 'react';
import { Flex, Text, Select } from '@gravity-ui/uikit'; // Проверьте ваш путь
import { emptySkill, Specialization } from '@/types/Skill';
import { useSkillTreeStore } from '@/stores/UseSkillTreeStore';
import { useShallow } from 'zustand/shallow';

export const SkillItemInfo = () => {
  // Достаем свойства строго по отдельности — это лечит ошибку бесконечного цикла
  const selectedNode = useSkillTreeStore((state) => state.selectedNode);
  const specializations = useSkillTreeStore(
    useShallow((state) => state.currentTree?.specialization ?? [])
  );
  const updateSelectedNodeSpecialization = useSkillTreeStore((state) => state.updateSelectedNodeSpecialization);

  // Если ни одна нода не выбрана на холсте React Flow
  if (!selectedNode) {
    return (
      <Flex direction="column" alignItems="center" justifyContent="center" height="100%">
        <Text color="secondary" variant="body-2">Выберите навык на холсте графа</Text>
      </Flex>
    );
  }

  const skill = selectedNode.data.info.skill ?? emptySkill;
  const currentSpec = selectedNode.data.info.specialization;

  // Трансформируем специализации дерева в опции для селекта Gravity UI
  const selectOptions = specializations.map((spec: Specialization) => ({
    value: spec.id,
    content: spec.name,
  }));

  const rowStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '120px 1fr',
    gap: '8px',
    marginBottom: '12px',
    alignItems: 'center',
  };

  return (
    <div style={{ width: '100%' }}>
      <Text variant="subheader-2" style={{ marginBottom: '16px', display: 'block' }}>
        Свойства навыка №{selectedNode.data.number}
      </Text>

      <div style={rowStyle}>
        <Text color="secondary" variant="body-1">Name:</Text>
        <Text variant="body-1" style={{ wordBreak: 'break-word', fontWeight: 'bold' }}>
          {skill.name}
        </Text>
      </div>

      <div style={rowStyle}>
        <Text color="secondary" variant="body-1">Description:</Text>
        <Text variant="body-1" style={{ opacity: 0.8 }}>
          {skill.description}
        </Text>
      </div>

      <div style={rowStyle}>
        <Text color="secondary" variant="body-1">Specialization:</Text>
        <Select
          placeholder="Не задана"
          size="m"
          width="max"
          options={selectOptions}
          value={currentSpec?.id ? [currentSpec.id] : []}
          onUpdate={(vals) => {
            const selectedId = vals?.[0];
            const foundSpec = specializations.find((s) => s.id === selectedId);
            // Передаем объект специализации (или undefined для сброса) в Zustand стор
            updateSelectedNodeSpecialization(foundSpec);
          }}
        />
      </div>

      <div style={rowStyle}>
        <Text color="secondary" variant="body-1">Tags:</Text>
        <Text variant="body-1">
          {Array.isArray(skill.tags) ? skill.tags.join(', ') : skill.tags}
        </Text>
      </div>
    </div>
  );
};
