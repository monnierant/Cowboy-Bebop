export interface Trait {
  name: string;
  damaged: boolean;
}

export interface Traits {
  [category: string]: Trait[];
}

export interface Mouvement {
  name: string;
  difficulty: number;
  dices: number;
  notes: number;
}

export interface Cadran {
  name: string;
  size: number;
  genre: string;
  isImportant: boolean;
  secretNote: string;
  mouvement: number;
  value: number;
  isObjective: boolean;
  isVisibleByPlayers: boolean;
}

export interface Colors {
  [key: string]: {
    on: string;
    off: string;
    fa: string;
  };
}
