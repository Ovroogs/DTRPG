export type CharacteristicName =
  | "Сила"
  | "Ловкость"
  | "Интеллект"
  | "Выносливость"
  | "Харизма"
  | "Восприятие"
  | "Сила Воли";

type CharacteristicValues = [number, number, number];
  
export type Characteristic = {
  name: CharacteristicName;
  grade: 1 | 2 | 3;
  values: CharacteristicValues;
  modifier?: number;
};

export type Characteristics = [
  Characteristic,
  Characteristic,
  Characteristic,
  Characteristic,
  Characteristic,
  Characteristic,
  Characteristic,
];

export const CharacteristicValueDefault: CharacteristicValues = [0, 0, 0];

export const zeroCharacteristics: Characteristic = {
  name: "Сила",
  grade: 1,
  values: CharacteristicValueDefault,
};

// function name() {
//     let s:Characteristic = {
//         grade:1,
//         values:[1,1,1]
//     }
// }
