import { IWSData, IWSWaiting } from '@tousinclus/types';
import { IsNotEmpty, IsString } from 'class-validator';

export class IWSDataDTO implements IWSData {
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class IWaitingDataDTO extends IWSDataDTO implements IWSWaiting {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  team: string;
}

export class IWSGameStatus extends IWSDataDTO implements IWSData {
  @IsString()
  @IsNotEmpty()
  gameStatus: string;
}
