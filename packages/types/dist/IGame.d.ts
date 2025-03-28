export interface IGame {
    code: string;
    status: string;
    cardGroupId?: number;
    team1?: ITeam;
    team2?: ITeam;
}
export interface ITeam {
    isConnected: boolean;
    clientId?: string;
    answer?: Record<string, Array<IAnswer>>;
}
export interface IAnswer {
    cardId: number;
    data?: IAnswerData;
}
export interface IAnswerData {
    input1: string;
    input2: string;
    input3: string;
    input4: string;
}
//# sourceMappingURL=IGame.d.ts.map