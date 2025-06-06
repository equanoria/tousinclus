import type { IUser } from "./IUser";
export declare enum EGameStatus {
    WAITING = "waiting",
    REFLECTION = "reflection",
    DEBATE = "debate",
    RESULT = "result"
}
export declare enum EDebateStatus {
    NEXT_CARD = "next_card",
    END_PHASE = "end_phase",
    RETRY = "retry"
}
export declare enum ETeam {
    TEAM1 = "team1",
    TEAM2 = "team2"
}
export interface IGame {
    createdAt: Date;
    createdBy: IUser["id"];
    reflectionEndsAt?: Date | null;
    _id?: unknown | null;
    code: string;
    status: EGameStatus;
    deckId?: number;
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
    team?: ETeam;
    answer?: IAnswerData;
}
export interface IVote {
    cardId: number;
    votes: {
        team: ETeam;
        vote: ETeam;
    }[];
}
export interface IAnswerData {
    input1: string;
    input2: string;
    input3: string;
    inputCheckboxes: number[];
}
export interface IDebateData {
    eventType: EDebateStatus;
    nextCardId: number;
    answers: IAnswer[];
}
//# sourceMappingURL=IGame.d.ts.map