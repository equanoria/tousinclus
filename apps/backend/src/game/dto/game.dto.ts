import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EGameStatus,
  ETeam,
  type IAnswer,
  type IAnswerData,
  type IGame,
  type ITeam,
  type IUser,
  type IVote,
} from '@tousinclus/types';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  ValidateNested,
} from 'class-validator';

// ========== DTO ==========

export class CreateGameDTO {
  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Identifier of the associated deck (optional)',
    example: 1,
    nullable: true,
  })
  deckId?: number;

  @IsNumber()
  @IsOptional()
  @Max(180)
  @ApiPropertyOptional({
    description:
      'Duration of the reflection part in minutes (optional, max 180)',
    example: 15,
    nullable: true,
    maximum: 180,
  })
  reflectionDuration?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Organisation name (optional)',
    example: 'Publicis',
    nullable: true,
  })
  organizationName?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Total amount of player (optional)',
    example: 12,
    nullable: true,
  })
  playerAmount?: number;
}

export class AnswerDataDTO implements IAnswerData {
  @IsString()
  @Expose()
  @ApiProperty({
    description: 'Answer 1',
    example: 'example answer 1',
  })
  input1: string;

  @IsString()
  @Expose()
  @ApiProperty({
    description: 'Answer 2',
    example: 'example answer 2',
  })
  input2: string;

  @IsString()
  @Expose()
  @ApiProperty({
    description: 'Answer 3',
    example: 'example answer 3',
  })
  input3: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsNotEmpty()
  @Expose()
  @ApiProperty({
    description: 'Checkboxes answer',
    example: [1, 2, 8],
    type: [Number],
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
  @ApiProperty({
    description: 'Team information team1 | team2',
    enum: ETeam,
    example: ETeam.TEAM1,
  })
  team: ETeam;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AnswerDataDTO)
  @Expose()
  @ApiProperty({
    description: 'Answer data',
    type: AnswerDataDTO,
    nullable: false,
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
    type: 'array',
    items: {
      type: 'object',
      properties: {
        team: { type: 'string', enum: Object.values(ETeam) },
        vote: { type: 'string', enum: Object.values(ETeam) },
      },
    },
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
  @IsDate()
  @IsNotEmpty()
  @Expose({ groups: ['admin'] })
  @ApiProperty({
    description: 'Date of creation',
    example: new Date().toISOString(),
    type: String,
    format: 'date-time',
  })
  createdAt: Date;

  @IsNotEmpty()
  @Expose({ groups: ['admin'] })
  @ApiProperty({
    description: 'Mongo _id for the user who created the game',
    example: '507f191e810c19729de860ea',
  })
  createdBy: IUser['id'];

  @IsOptional()
  @IsDate()
  @Expose({ groups: ['room'] })
  @ApiPropertyOptional({
    description: 'Date when the reflection phase ends',
    example: new Date().toISOString(),
    type: String,
    format: 'date-time',
    nullable: true,
  })
  reflectionEndsAt?: Date | null;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Organisation name (optional)',
    example: 'Publicis',
    nullable: true,
  })
  organizationName?: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({
    description: 'Total amount of player (optional)',
    example: 12,
    nullable: true,
  })
  playerAmount?: number;

  @IsOptional()
  @IsString()
  @Expose({ groups: ['admin'] })
  @ApiPropertyOptional({
    description: 'Mongo _id for the game records',
    example: '507f191e810c19729de860ea',
    nullable: true,
  })
  _id?: string;

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
    nullable: true,
  })
  reflectionDuration?: number;

  @IsNumber()
  @IsOptional()
  @Expose()
  @ApiPropertyOptional({
    description: 'Card group identifier',
    example: 14,
    nullable: true,
  })
  cardGroupId?: number;

  @IsNumber()
  @IsOptional()
  @Expose()
  @ApiPropertyOptional({
    description: 'Deck identifier',
    example: 14,
    nullable: true,
  })
  deckId?: number;

  @IsOptional()
  @Expose({ groups: ['team1', 'joining'] })
  @Type(() => TeamDTO)
  @ApiPropertyOptional({
    description: 'First team information',
    type: TeamDTO,
    nullable: true,
  })
  team1?: TeamDTO;

  @IsOptional()
  @Expose({ groups: ['team2', 'joining'] })
  @Type(() => TeamDTO)
  @ApiPropertyOptional({
    description: 'Second team information',
    type: TeamDTO,
    nullable: true,
  })
  team2?: TeamDTO;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AnswerDTO)
  @Expose({ groups: ['reflection'] })
  @ApiPropertyOptional({
    description: 'Answers associated with the team',
    type: [AnswerDTO],
    nullable: true,
  })
  answers?: AnswerDTO[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => VoteDTO)
  @Expose({ groups: ['debate'] })
  @ApiPropertyOptional({
    description: 'Votes for the debate phase',
    type: [VoteDTO],
    nullable: true,
  })
  votes?: VoteDTO[];
}
