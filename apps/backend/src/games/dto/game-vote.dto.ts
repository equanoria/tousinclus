import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';
import { IGameVote } from '@tousinclus/types';
import { Types } from 'mongoose';

export class GameVoteDto implements IGameVote {
  @IsString()
  @IsNotEmpty()
  extremeUserCardId: string;

  @IsMongoId()
  createdBy: Types.ObjectId;

  @IsMongoId()
  votedFor: Types.ObjectId;
}
