import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IGame, ITeam, IAnswer, IAnswerData } from '@tousinclus/types';
import { Expose, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  ValidateNested,
} from 'class-validator';

// ========== DTO ==========

export class CreateGameDTO {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Identifier of the associated deck (optional)',
    example: 1,
  })
  readonly deckId?: number;
}

export class AnswerDataDTO implements IAnswerData {
  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({
    description: 'Answer 1',
    example: 'example answer 1',
  })
  input1: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({
    description: 'Answer 2',
    example: 'example answer 2',
  })
  input2: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({
    description: 'Answer 3',
    example: 'example answer 3',
  })
  input3: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({
    description: 'Answer 4',
    example: 'example answer 4',
  })
  input4: string;
}

export class AnswerDTO implements IAnswer {
  @IsNumber()
  @Expose()
  @ApiProperty({
    description: 'Card ID',
    example: 42,
  })
  cardId: number;

  @IsOptional()
  @ValidateNested() // Permet la validation de l'objet imbriqué `data`
  @Type(() => AnswerDataDTO) // Transforme `data` en instance de `AnswerDataDTO`
  @Expose()
  @ApiPropertyOptional({
    description: 'Answer data',
    type: AnswerDataDTO,
    nullable: true,
  })
  data?: AnswerDataDTO;
}

export class TeamDTO implements ITeam {
  @IsBoolean()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({ description: 'Is the team connected?', example: true })
  isConnected: boolean;

  @IsString()
  @IsOptional()
  @Expose({ groups: ['room'] })
  @ApiPropertyOptional({
    description: 'Socket IO client ID',
    example: 'aqzsedrftgyhujikolp',
    nullable: true,
  })
  clientId?: string | null;

  @IsOptional()
  @Expose()
  @ValidateNested({ each: true })
  @Type(() => AnswerDTO)
  @ApiPropertyOptional({
    description: 'Answers associated with the team',
    type: AnswerDTO,
  })
  answer?: Record<string, Array<AnswerDTO>>; // Dynamic keys corresponding to IDs
}

export class GameDTO implements IGame {
  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({ description: 'Game code', example: '119949' })
  code: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({ description: 'Game status', example: 'waiting' })
  status: string;

  @IsNumber()
  @IsOptional()
  @Expose()
  @ApiPropertyOptional({
    description: 'Card group identifier',
    example: 14,
  })
  cardGroupId?: number;

  @IsOptional()
  @Expose()
  @Type(() => TeamDTO)
  @ApiPropertyOptional({
    description: 'First team information',
    type: TeamDTO,
  })
  team1?: ITeam;

  @IsOptional()
  @Expose()
  @Type(() => TeamDTO)
  @ApiPropertyOptional({
    description: 'Second team information',
    type: TeamDTO,
  })
  team2?: ITeam;
}
