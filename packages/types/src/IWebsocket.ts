export interface IWSData {
    code?: string;
    team?: string;
    data?: object;
}

export interface IWSController extends IWSData {
    action?: string;
}

export interface IWSGameStatus {
    gameStatus: string;
    timeStamp?: Date;
}