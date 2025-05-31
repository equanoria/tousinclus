import { ERoomStatus, IGame, IRoom, IRoomTeam } from '@tousinclus/types';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { RoomTeamDto } from './room-team.dto';
import { GameDto } from 'src/games/dto/game.dto';

export class RoomDto implements IRoom {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @IsString()
  @IsNotEmpty()
  createdBy: string;

  @IsEnum(ERoomStatus)
  status: ERoomStatus;

  @IsString()
  @IsNotEmpty()
  code: string;

  @ValidateNested({ each: true })
  @Type(() => GameDto)
  games: IGame[];

  @ValidateNested({ each: true })
  @Type(() => RoomTeamDto)
  teams: IRoomTeam[];

  @IsString()
  @IsNotEmpty()
  deckGroupId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organizationName?: string;

  @IsOptional()
  @IsNumber()
  playerCount?: number;
}
