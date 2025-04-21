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
  team?: string;

  @ValidateNested()
  @IsOptional()
  @Type(() => AnswerDTO)
  data?: AnswerDTO;
}

export class WSControllerDTO extends WSDataDTO {
  @IsString()
  @IsNotEmpty()
  action: string;
}

export class WSGameStatus implements IWSGameStatus {
  @IsString()
  @IsNotEmpty()
  gameStatus: string;
}
