export interface IGame {
  _id?: unknown;
  createdAt: Date;
  status: EGameStatus;
  answerGroups: IGameAnswerGroup[];
  votes: IGameVote[];
}

export enum EGameStatus {
  WAITING = 'waiting',
  REFLECTION = 'reflection',
  DEBATE = 'debate',
  RESULT = 'result',
}

export interface IGameAnswerGroup {
  extremeUserId: string;
  createdByTeam: unknown;
  answers: IGameAnswer<unknown>[];
}

export interface IGameAnswer<T> {
  key: string;
  value: T;
}

export interface IGameVote {
  extremeUserId: string;
  createdBy: unknown;
  votedFor: unknown;
}
