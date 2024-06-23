import { id } from "../system.json";
import { Mouvement } from "./types";

export const moduleId: string = id;

export const genres: string[] = ["rock", "blues", "jazz", "dance", "tango"];

export const rangs: Mouvement[] = [
  { name: "OK", difficulty: 5, dices: 1, notes: 1 },
  { name: "321", difficulty: 10, dices: 2, notes: 1 },
  { name: "JAM", difficulty: 15, dices: 3, notes: 2 },
];
