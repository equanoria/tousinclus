export interface IData {
  action: string;
}

export interface IGameData extends IData {
  gameCode: string;
}

export interface IWaitingData extends IGameData {
  team: string;
}
