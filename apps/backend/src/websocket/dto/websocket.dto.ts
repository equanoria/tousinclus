import { IWSData, IWSGameStatus } from '@tousinclus/types';
import { Type } from 'class-transformer';
import { AnswerDTO } from '../../game/dto/game.dto';

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class WSDataDTO implements IWSData {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsOptional()
  action?: string;

  @IsString()
  @IsOptional()
  team?: string;
}

export class ReflectionDataDTO extends WSDataDTO {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => AnswerDTO)
  data: AnswerDTO;
}
export class WSGameStatus implements IWSGameStatus {
  @IsString()
  @IsNotEmpty()
  gameStatus: string;
}
