import type { Types } from 'mongoose';
import type { IGame } from './game';

export interface IRoom {
  _id: Types.ObjectId | string;
  createdAt: Date;
  createdBy: string;
  status: ERoomStatus;
  code: string;
  games: IGame[];
  teams: IRoomTeam[];
  deckGroupId: string;

  organizationName?: string;
  playerCount?: number;
}

export interface IRoomTeam {
  _id: Types.ObjectId | string;
  name: string;
}

export enum ERoomStatus {
  OPEN = 'open',
  CLOSED = 'closed',
}
