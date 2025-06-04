import {
  IsString,
  IsDate,
  IsNotEmpty,
  ValidateNested,
  IsEnum,
  IsMongoId,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  EGameStatus,
  IGame,
  IGameAnswerGroup,
  IGameRanking,
  IGameState,
  IGameVote,
} from '@tousinclus/types';
import { Types } from 'mongoose';
import { GameVoteDto } from './game-vote.dto';
import { GameAnswerGroupDto } from './game-answer-group.dto';
import { GameRankingDto } from './game-ranking.dto';
import { GameStateDto } from './game-state.dto';

export class GameDto implements IGame {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @IsEnum(EGameStatus)
  status: EGameStatus;

  @ValidateNested()
  @Type(() => GameStateDto)
  state: IGameState;

  @IsString()
  @IsNotEmpty()
  cardDeckId: string;

  @ValidateNested({ each: true })
  @Type(() => GameAnswerGroupDto)
  answerGroups: IGameAnswerGroup[];

  @ValidateNested({ each: true })
  @Type(() => GameVoteDto)
  votes: IGameVote[];

  @ValidateNested({ each: true })
  @Type(() => GameRankingDto)
  ranking: IGameRanking[];
}
