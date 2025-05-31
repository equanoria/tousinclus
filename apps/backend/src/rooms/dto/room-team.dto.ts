import { IRoomTeam } from '@tousinclus/types';
import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class RoomTeamDto implements IRoomTeam {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  name: string;
}
