import {
  CharacteristicName,
  Characteristics,
  CharacteristicValueDefault,
} from "./Characteristic";

export type Race = {
  id?: string;
  name: string;
  characteristics: Characteristics;
  numberOfTransfers: Number;
  peculiarity: string;
  folks?: Folk[] | undefined;
};

export const emptyRace: Race = {
  name: "",
  characteristics: [
    {
      name: "Сила",
      grade: 1,
      values: CharacteristicValueDefault,
    },
    {
      name: "Ловкость",
      grade: 1,
      values: CharacteristicValueDefault,
    },
    {
      name: "Интеллект",
      grade: 1,
      values: CharacteristicValueDefault,
    },
    {
      name: "Выносливость",
      grade: 1,
      values: CharacteristicValueDefault,
    },
    {
      name: "Харизма",
      grade: 1,
      values: CharacteristicValueDefault,
    },
    {
      name: "Восприятие",
      grade: 1,
      values: CharacteristicValueDefault,
    },
    {
      name: "Сила Воли",
      grade: 1,
      values: CharacteristicValueDefault,
    },
  ],
  numberOfTransfers: 0,
  peculiarity: "",
};

export type Folk = {
  id?: string;
  name: string;
  modifierCharacteristics: {
    characteristic: CharacteristicName;
    number: number;
  }[];
  ability: string;
};
