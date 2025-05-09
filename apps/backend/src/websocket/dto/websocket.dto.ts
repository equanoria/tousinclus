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
  @Type(({ object }) => {
    // discrimination basée sur la présence d'un champ unique
    if ('answer' in object.data) {
      return AnswerDTO;
    }
    if ('votes' in object.data) {
      return VoteDTO;
    }
    throw new Error('Unsupported data type'); // throw une erreur si le type est inconnu
  })
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
