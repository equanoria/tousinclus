import { IsMongoId, IsNumber } from 'class-validator';
import { IGameRanking } from '@tousinclus/types';
import { Types } from 'mongoose';

export class GameRankingDto implements IGameRanking {
  @IsMongoId()
  team: Types.ObjectId;

  @IsNumber()
  score: number;
}
