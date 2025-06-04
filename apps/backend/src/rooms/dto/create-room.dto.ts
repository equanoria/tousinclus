import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { IRoom, IRoomConfig } from '@tousinclus/types';
import { Type } from 'class-transformer';

export class CreateRoomDto implements Partial<IRoom> {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  deckGroupId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organizationName?: string;

  @IsOptional()
  @IsNumber()
  @IsNotEmpty()
  playerCount?: number;

  @ValidateNested()
  @Type(() => CreateRoomConfigDto)
  config: IRoomConfig;
}

export class CreateRoomConfigDto implements Partial<IRoomConfig> {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organizationName?: string;

  @IsOptional()
  @IsNumber()
  playerCount?: number;

  @IsOptional()
  @IsNumber()
  thinkingDuration?: number;
}
