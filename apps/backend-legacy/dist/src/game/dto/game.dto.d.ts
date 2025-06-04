import { IGame, ITeam, IAnswer, IAnswerData, EGameStatus, ETeam, IVote, IUser } from '@tousinclus/types';
export declare class CreateGameDTO {
    deckId?: number;
    reflectionDuration: number;
}
export declare class AnswerDataDTO implements IAnswerData {
    input1: string;
    input2: string;
    input3: string;
    inputCheckboxes: number[];
}
export declare class AnswerDTO implements IAnswer {
    cardId: number;
    team: ETeam;
    answer: AnswerDataDTO;
}
export declare class VoteDTO implements IVote {
    cardId: number;
    votes: {
        team: ETeam;
        vote: ETeam;
    }[];
}
export declare class TeamDTO implements ITeam {
    isConnected: boolean;
    clientId?: string | null;
}
export declare class GameDTO implements IGame {
    createdAt: Date;
    createdBy: IUser['id'];
    reflectionEndsAt?: Date | null;
    _id?: string;
    code: string;
    status: EGameStatus;
    reflectionDuration?: number;
    cardGroupId: number;
    team1?: TeamDTO;
    team2?: TeamDTO;
    answers?: AnswerDTO[];
    votes?: VoteDTO[];
}
