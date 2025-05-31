import type { IGame } from './IGame';
export interface IRoom {
    _id?: unknown;
    createdAt: Date;
    createdBy: string;
    code: string;
    games: IGame[];
    teams: IRoomTeam[];
    organizationName?: string;
    playerCount?: number;
}
export interface IRoomTeam {
    _id?: unknown;
    teamName: string;
}
//# sourceMappingURL=IRoom.d.ts.map