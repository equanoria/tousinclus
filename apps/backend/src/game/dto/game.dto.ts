import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateGameDTO {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    description: 'Identifier of the associated deck (optional)',
    example: 1,
  })
  readonly deckId?: number;
}

export class IAnswerDTO implements IAnswer {
  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({
    description: 'Answer 1',
    example: 'example answer 1',
    nullable: true,
  })
  input1: string | null;

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({
    description: 'Answer 2',
    example: 'example answer 2',
    nullable: true,
  })
  input2: string | null;

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({
    description: 'Answer 3',
    example: 'example answer 3',
    nullable: true,
  })
  input3: string | null;

  @IsString()
  @IsOptional()
  @Expose()
  @ApiProperty({
    description: 'Answer 4',
    example: 'example answer 4',
    nullable: true,
  })
  input4: string | null;
}

export class ITeamDTO implements ITeam {
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
  @ApiPropertyOptional({
    description: 'Answers associated with the team',
    type: IAnswerDTO,
  })
  answer?: Record<string, IAnswer>; // Dynamic keys corresponding to IDs
}

export class IGameDTO implements IGame {
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
  @Type(() => ITeamDTO)
  @ApiPropertyOptional({
    description: 'First team information',
    type: ITeamDTO,
  })
  team1?: ITeam;

  @IsOptional()
  @Expose()
  @Type(() => ITeamDTO)
  @ApiPropertyOptional({
    description: 'Second team information',
    type: ITeamDTO,
  })
  team2?: ITeam;
}
