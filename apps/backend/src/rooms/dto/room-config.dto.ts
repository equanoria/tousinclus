import { IRoomConfig } from '@tousinclus/types';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RoomConfigDto implements IRoomConfig {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organizationName?: string;

  @IsOptional()
  @IsNumber()
  playerCount?: number;

  @IsNumber()
  thinkingDuration: number;
}
