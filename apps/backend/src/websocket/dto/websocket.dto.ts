import { IWSData, IWSWaiting, IWSGameStatus } from '@tousinclus/types';
import { Type } from 'class-transformer';
import { AnswerDTO } from '../../game/dto/game.dto';

import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class WSDataDTO implements IWSData {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class WaitingDataDTO extends WSDataDTO implements IWSWaiting {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  team: string;
}

export class ReflectionDataDTO {
  @IsNumber()
  @IsOptional()
  cardId?: number;

  @IsNumber()
  @IsOptional()
  @ValidateNested()
  @Type(() => AnswerDTO)
  answer?: Record<string, AnswerDTO>;
}

export class WSGameStatus implements IWSGameStatus {
  @IsString()
  @IsNotEmpty()
  gameStatus: string;
}
