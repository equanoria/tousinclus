export interface IData {
  action: string;
}

export interface IWaitingData extends IData {
  gameCode: string;
  team: string;
}
