import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  ValidateNested,
} from 'class-validator';
import { IGameAnswerGroup, IGameAnswers } from '@tousinclus/types';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { GameAnswersDto } from './game-anwsers.dto';

export class GameAnswerGroupDto implements IGameAnswerGroup {
  @IsString()
  @IsNotEmpty()
  extremeUserCardId: string;

  @IsMongoId()
  createdBy: Types.ObjectId;

  @ValidateNested()
  @Type(() => GameAnswersDto)
  answers: IGameAnswers;
}
