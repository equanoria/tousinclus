import type { Types } from 'mongoose';
import type { IRoomTeam } from './IRoom';
export interface IGame {
    _id?: Types.ObjectId | string;
    createdAt: Date;
    status: EGameStatus;
    answerGroups: IGameAnswerGroup[];
    votes: IGameVote[];
}
export declare enum EGameStatus {
    WAITING = "waiting",
    REFLECTION = "reflection",
    DEBATE = "debate",
    RESULT = "result"
}
export interface IGameAnswerGroup {
    extremeUserId: string;
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
    extremeUserId: string;
    createdBy: Types.ObjectId | string | IRoomTeam;
    votedFor: Types.ObjectId | string | IRoomTeam;
}
//# sourceMappingURL=IGame.d.ts.map