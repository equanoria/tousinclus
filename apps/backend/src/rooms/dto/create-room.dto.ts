import { IsString, IsOptional, IsNotEmpty, IsNumber } from 'class-validator';
import { IRoom } from '@tousinclus/types';

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
}
