import type { Types } from 'mongoose';
import type { IRoomTeam } from './Room';

export interface IGame {
  _id: Types.ObjectId | string;
  createdAt: Date;
  status: EGameStatus;
  cardDeckId: string;
  answerGroups: IGameAnswerGroup[];
  votes: IGameVote[];
}

export enum EGameStatus {
  WAITING = 'waiting',
  REFLECTION = 'reflection',
  DEBATE = 'debate',
  RESULT = 'result',
  CLOSED = 'closed',
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
