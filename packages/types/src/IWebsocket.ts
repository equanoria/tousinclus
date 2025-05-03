import type { IAnswer } from './IGame';

export interface IWSData {
  code?: string;
  action?: string;
}

export interface IWSGameStatus {
  gameStatus: string;
}

export interface IWSWaiting extends IWSData {
  team: string;
}

export interface IWSReflection extends IWSData {
  cardId?: number;
  answer?: Record<string, Array<IAnswer>>; // Clés dynamiques correspondant aux IDs
}
