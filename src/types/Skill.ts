export type Skill = {
  id?: string;
  name: string;
  description: string | undefined;
  tags?: string | string[] | undefined;
};

export type SkillTree = {
  id?: string;
  name: string;
  specialization: Specializations;
}

export type Specialization = {
  id: string;
  name: string;
  color: string;
};

export type SkillInfo = {
  skill: Skill;
  specialization?: Specialization;
};

export type Skills = Skill[];

export type Specializations = Specialization[];

export const emptySkill: Skill = {
  id: "",
  name: "",
  description: "",
  tags: "",
};

export const emptySpecialization: Specialization = {
  id: "",
  name: "",
  color: "#000",
};