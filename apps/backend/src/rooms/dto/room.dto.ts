import {
  ERoomStatus,
  IGame,
  IRoom,
  IRoomConfig,
  IRoomTeam,
} from '@tousinclus/types';
import { Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Types } from 'mongoose';
import { RoomTeamDto } from './room-team.dto';
import { GameDto } from 'src/games/dto/game.dto';
import { RoomConfigDto } from './room-config.dto';

export class RoomDto implements IRoom {
  @IsMongoId()
  @Expose({ groups: ['admin'] })
  _id: Types.ObjectId;

  @IsDate()
  @Type(() => Date)
  @Expose({ groups: ['admin'] })
  createdAt: Date;

  @IsDate()
  @Type(() => Date)
  @Expose({ groups: ['admin'] })
  updatedAt: Date;

  @IsString()
  @IsNotEmpty()
  @Expose({ groups: ['admin'] })
  createdBy: string;

  @IsEnum(ERoomStatus)
  @Expose()
  status: ERoomStatus;

  @IsString()
  @IsNotEmpty()
  @Expose()
  code: string;

  @ValidateNested({ each: true })
  @Type(() => GameDto)
  @Expose({ groups: ['admin'] })
  games: IGame[];

  @ValidateNested({ each: true })
  @Type(() => RoomTeamDto)
  @Expose()
  teams: IRoomTeam[];

  @IsString()
  @IsNotEmpty()
  @Expose({ groups: ['admin'] })
  deckGroupId: string;

  @ValidateNested()
  @Type(() => RoomConfigDto)
  @Expose({ groups: ['admin'] })
  config: IRoomConfig;
}
