import type { Types } from 'mongoose';
import type { IGame } from './Game_';
export interface IRoom {
    _id: Types.ObjectId | string;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    status: ERoomStatus;
    code: string;
    games: IGame[];
    teams: IRoomTeam[];
    deckGroupId: string;
    config: IRoomConfig;
}
export interface IRoomTeam {
    _id: Types.ObjectId | string;
    name: string;
}
export declare enum ERoomStatus {
    OPEN = "open",
    CLOSED = "closed"
}
export interface IRoomConfig {
    thinkingDuration: number;
    organizationName?: string;
    playerCount?: number;
}
//# sourceMappingURL=Room.d.ts.map