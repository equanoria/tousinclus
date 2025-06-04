import { ETeam, IAnswer, IAnswerData, IGame, IUser, IVote } from '@tousinclus/types';
import { Document } from 'mongoose';
export type IGameMongo = Omit<IGame, 'status' | 'team1' | 'team2' | 'reflectionEndsAt'>;
export declare class User implements IUser {
    id?: string;
    roles: string[];
}
export declare class AnswerData implements IAnswerData {
    input1: string;
    input2: string;
    input3: string;
    inputCheckboxes: number[];
}
export declare class Answer implements IAnswer {
    cardId: number;
    team: ETeam;
    answer: AnswerData;
}
export declare class TeamVote {
    team: ETeam;
    vote: ETeam;
}
export declare class Vote implements IVote {
    cardId: number;
    votes: TeamVote[];
}
export declare class GameDocument extends Document implements IGameMongo {
    updatedAt: Date;
    createdAt: Date;
    createdBy: IUser['id'];
    code: string;
    cardGroupId: number;
    answers: Answer[];
    votes: Vote[];
}
export declare const GameSchema: import("mongoose").Schema<GameDocument, import("mongoose").Model<GameDocument, any, any, any, Document<unknown, any, GameDocument> & GameDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, GameDocument, Document<unknown, {}, import("mongoose").FlatRecord<GameDocument>> & import("mongoose").FlatRecord<GameDocument> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
