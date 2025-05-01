export declare enum EnumGameStatus {
    Waiting = "waiting",
    Reflection = "reflection",
    Debate = "debate",
    Result = "result"
}
export declare enum EnumTeam {
    team1 = "team1",
    team2 = "team2"
}
export interface IGame {
    code: string;
    status: EnumGameStatus;
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
    team: EnumTeam;
    answer?: IAnswerData;
}
export interface IVote {
    cardId: number;
    team: EnumTeam;
    vote?: Array<EnumTeam>;
}
export interface IAnswerData {
    input1: string;
    input2: string;
    input3: string;
    input4: string;
}
//# sourceMappingURL=IGame.d.ts.map