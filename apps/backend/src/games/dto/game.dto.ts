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
  IGameVote,
} from '@tousinclus/types';
import { Types } from 'mongoose';
import { GameVoteDto } from './game-vote.dto';
import { GameAnswerGroupDto } from './game-answer-group.dto';

export class GameDto implements IGame {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsEnum(EGameStatus)
  status: EGameStatus;

  @IsString()
  @IsNotEmpty()
  cardDeckId: string;

  @ValidateNested({ each: true })
  @Type(() => GameAnswerGroupDto)
  answerGroups: IGameAnswerGroup[];

  @ValidateNested({ each: true })
  @Type(() => GameVoteDto)
  votes: IGameVote[];
}
