export enum EGameStatus {
  Waiting = "waiting",
  Reflection = "reflection",
  Debate = "debate",
  Result = "result",
}

export enum ETeam {
  team1 = "team1",
  team2 = "team2"
}

export interface IGame {
  code: string;
  status: EGameStatus;
  cardGroupId?: number;
  team1?: ITeam;
  team2?: ITeam;
  answers?: Array<IAnswer>;
  votes?: Array<IVote>;
}

export interface ITeam {
  isConnected: boolean;
  clientId?: string;
}

export interface IAnswer {
  cardId: number;
  team: ETeam;
  answer?: IAnswerData;
}

export interface IVote {
  cardId: number;
  team: ETeam;
  vote?: Array<ETeam>;
}

export interface IAnswerData {
  input1: string;
  input2: string;
  input3: string;
  input4: string;
}
