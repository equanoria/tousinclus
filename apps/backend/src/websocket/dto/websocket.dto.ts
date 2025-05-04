import { IWSData, IWSGameStatus, IWSController } from '@tousinclus/types';
import { Type } from 'class-transformer';
import { AnswerDTO, VoteDTO } from '../../game/dto/game.dto';

import {
  IsDate,
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
  @Type(() => AnswerDTO || VoteDTO)
  data?: AnswerDTO | VoteDTO;
}

export class WSControllerDTO extends WSDataDTO implements IWSController {
  @IsString()
  @IsNotEmpty()
  action: string;
}

export class WSGameStatus implements IWSGameStatus {
  @IsString()
  @IsNotEmpty()
  gameStatus: string;

  @IsDate()
  @IsOptional()
  timeStamp?: Date;
}
