import { IRoomConfig } from '@tousinclus/types';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class RoomConfigDto implements IRoomConfig {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organizationName?: string;

  @IsOptional()
  @IsNumber()
  playerCount?: number;

  @IsDate()
  @Type(() => Date)
  reflectionEndsAt: Date;
}
