import { id } from "../system.json";
import { Mouvement, Colors } from "./types";

export const moduleId: string = id;

export const genres: string[] = ["rock", "blues", "jazz", "dance", "tango"];

export const rangs: Mouvement[] = [
  { name: "OK", difficulty: 5, dices: 1, notes: 1 },
  { name: "321", difficulty: 10, dices: 2, notes: 1 },
  { name: "JAM", difficulty: 15, dices: 3, notes: 2 },
];

export const colors: Colors = {
  rock: {
    on: "#f44336",
    off: "#e57373",
    fa: "fa-bolt-lightning",
  },
  blues: {
    on: "#2196f3",
    off: "#64b5f6",
    fa: "fa-guitar",
  },
  jazz: {
    on: "#ff9800",
    off: "#ffb74d",
    fa: "fa-record-vinyl",
  },
  dance: {
    on: "#4caf50",
    off: "#81c784",
    fa: "fa-drum",
  },
  tango: {
    on: "#9c27b0",
    off: "#ba68c8",
    fa: "fa-shoe-prints",
  },
  closed: {
    on: "#444444",
    off: "#aaaaaa",
    fa: "fa-lock",
  },
};
