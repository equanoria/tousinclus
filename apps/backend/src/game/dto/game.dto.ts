import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IGame,
  ITeam,
  IAnswer,
  IAnswerData,
  EGameStatus,
  ETeam,
  IVote,
} from '@tousinclus/types';
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
  deckId?: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Duration of the reflection part',
    example: 15,
  })
  reflectionDuration: number;
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
    description: 'Checkboxes answer',
    example: [1, 2, 8],
  })
  inputCheckboxes: number[];
}

export class AnswerDTO implements IAnswer {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({
    description: 'Card ID',
    example: 42,
  })
  cardId: number;

  @IsNotEmpty()
  @Expose()
  @ApiPropertyOptional({
    description: 'Team information team1 | team2',
    enum: ETeam,
  })
  team: ETeam;

  @IsNotEmpty()
  @ValidateNested() // Permet la validation de l'objet imbriqué `data`
  @Type(() => AnswerDataDTO) // Transforme `data` en instance de `AnswerDataDTO`
  @Expose()
  @ApiPropertyOptional({
    description: 'Answer data',
    type: AnswerDataDTO,
    nullable: true,
  })
  answer: AnswerDataDTO;
}

export class VoteDTO implements IVote {
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  @ApiProperty({
    description: 'Card ID',
    example: 42,
  })
  cardId: number;

  @IsNotEmpty()
  @Expose()
  @ApiProperty({
    description:
      'Votes cast by each team. Each vote contains the team who voted and the team they voted for.',
    example: [
      { team: 'team1', vote: 'team2' },
      { team: 'team2', vote: 'team1' },
    ],
  })
  votes: { team: ETeam; vote: ETeam }[];
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
  @ApiProperty({
    description: 'Game status',
    example: 'waiting',
    enum: EGameStatus,
  })
  status: EGameStatus;

  @IsNumber()
  @IsOptional()
  @Expose()
  @ApiPropertyOptional({
    description: 'Time for Reflection phase in minutes',
    example: 60,
  })
  reflectionDuration?: number;

  @IsNumber()
  @IsOptional()
  @Expose()
  @ApiPropertyOptional({
    description: 'Card group identifier',
    example: 14,
  })
  cardGroupId?: number;

  @IsOptional()
  @Expose({ groups: ['team1', 'joining'] })
  @Type(() => TeamDTO)
  @ApiPropertyOptional({
    description: 'First team information',
    type: TeamDTO,
  })
  team1?: TeamDTO;

  @IsOptional()
  @Expose({ groups: ['team2', 'joining'] })
  @Type(() => TeamDTO)
  @ApiPropertyOptional({
    description: 'Second team information',
    type: TeamDTO,
  })
  team2?: TeamDTO;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AnswerDTO)
  @Expose({ groups: ['reflection'] })
  @ApiPropertyOptional({
    description: 'Answers associated with the team',
    type: AnswerDTO,
  })
  answers?: Array<AnswerDTO>; // Dynamic keys corresponding to IDs

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VoteDTO)
  @Expose({ groups: ['debate'] })
  votes?: Array<VoteDTO>;
}
