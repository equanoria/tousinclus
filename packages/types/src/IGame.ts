export enum EnumGameStatus {
  Waiting = "waiting",
  Reflection = "reflection",
  Debate = "debate",
  Result = "result",
}

export enum Team {
  team1 = "team1",
  team2 = "team2"
}

export interface IGame {
  code: string;
  status: EnumGameStatus;
  cardGroupId?: number;
  team1?: ITeam;
  team2?: ITeam;
}

export interface ITeam {
  isConnected: boolean;
  clientId?: string;
  answers?: Array<IAnswer>; // Clés dynamiques correspondant aux IDs
}

export interface IAnswer {
  cardId: number;
  team: Team
  answer?: IAnswerData;
}

export interface IVote {
  cardId: number;
  team: Team
  vote?: Array<Team>
}

export interface IAnswerData {
  input1: string;
  input2: string;
  input3: string;
  input4: string;
}
