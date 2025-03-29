import { IWSData, IWSGameStatus } from '@tousinclus/types';
import { Type } from 'class-transformer';
import { AnswerDTO } from '../../game/dto/game.dto';

import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class WSDataDTO implements IWSData {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  action?: string;

  @IsString()
  @IsNotEmpty()
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
