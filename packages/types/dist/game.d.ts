import type { Types } from 'mongoose';
import type { IRoomTeam } from './Room';
export interface IGame {
    _id: Types.ObjectId | string;
    createdAt: Date;
    status: EGameStatus;
    state: IGameState;
    cardDeckId: string;
    answerGroups: IGameAnswerGroup[];
    votes: IGameVote[];
    ranking: IGameRanking[];
}
export declare enum EGameStatus {
    THINKING = "thinking",
    DEBATE = "debate",
    RESULT = "result",
    CLOSED = "closed"
}
export interface IGameAnswerGroup {
    extremeUserCardId: string;
    createdBy: Types.ObjectId | string | IRoomTeam;
    answers: IGameAnswers;
}
export interface IGameAnswers {
    inclusionIssueDescription: string;
    proposedSolutionDescription: string;
    experienceImprovementDescription: string;
    relatedExtremeUsersIds: string[];
}
export interface IGameVote {
    extremeUserCardId: string;
    createdBy: Types.ObjectId | string | IRoomTeam;
    votedFor: Types.ObjectId | string | IRoomTeam;
}
export interface IGameRanking {
    team: Types.ObjectId | string | IRoomTeam;
    score: number;
}
export interface IGameState {
    thinking?: {
        endsAt: Date;
    };
    debate?: {
        currentVote: string;
    };
}
//# sourceMappingURL=Game.d.ts.map