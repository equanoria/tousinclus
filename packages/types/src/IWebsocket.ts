export interface IWSData {
    code: string;
}

export interface IWSController extends IWSData {
    action: string;
}

export interface IWSGameStatus {
    gameStatus: string;
}

export interface IWSWaiting extends IWSData {
    team: string;
}