import { PartialType } from '@nestjs/mapped-types';
import { IRoomTeam } from '@tousinclus/types';
import { RoomDto } from './room.dto';
import { IsMongoId, ValidateNested } from 'class-validator';
import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import { RoomTeamDto } from './room-team.dto';

export class RedisRoomDto extends PartialType(RoomDto) {
  @IsMongoId()
  _id: Types.ObjectId;

  @ValidateNested({ each: true })
  @Type(() => RoomTeamDto)
  teams: IRoomTeam[];
}
