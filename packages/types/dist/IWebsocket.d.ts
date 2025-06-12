import type { EGameStatus } from './IGame';
export interface IWSData {
    code?: string;
    team?: string;
    data?: object;
}
export interface IWSController extends IWSData {
    action?: string;
}
export interface IWSGameStatus {
    gameStatus: EGameStatus;
    timeStamp?: Date;
}
//# sourceMappingURL=IWebsocket.d.ts.map