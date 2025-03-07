import { IGame, ITeam, IAnswer } from '@tousinclus/types';
import { Expose, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
} from 'class-validator';

// ========== DTO ==========
export class IGameDTO implements IGame {
  @IsString()
  @IsNotEmpty()
  @Expose()
  code: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  status: string;

  @IsNumber()
  @IsOptional()
  @Expose()
  cardGroupId?: number;

  @IsNotEmpty()
  @Expose()
  @Type(() => ITeamDTO)
  team1?: ITeam;

  @IsNotEmpty()
  @Expose()
  @Type(() => ITeamDTO) // Permet de satisfaire le ITeamDTO et d'appliquer les expose groups
  team2?: ITeam;
}

export class ITeamDTO implements ITeam {
  @IsBoolean()
  @IsNotEmpty()
  @Expose()
  isConnected: boolean;

  @IsString()
  @IsOptional()
  @Expose({ groups: ['room'] })
  clientId?: string;

  @IsOptional()
  @Expose()
  answer?: Record<string, IAnswer>; // Clés dynamiques correspondant aux IDs
}

export class IAnswerDTO implements IAnswer {
  @IsString()
  @IsNotEmpty()
  @Expose()
  input1: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  input2: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  input3: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  input4: string;
}

export class CreateGameDTO {
  @IsString()
  @IsOptional()
  readonly deckId?: string;
}
