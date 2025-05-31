import { IsString, IsNotEmpty, IsArray } from 'class-validator';
import { IGameAnswers } from '@tousinclus/types';

export class GameAnswersDto implements IGameAnswers {
  @IsString()
  @IsNotEmpty()
  inclusionIssueDescription: string;

  @IsString()
  @IsNotEmpty()
  proposedSolutionDescription: string;

  @IsString()
  @IsNotEmpty()
  experienceImprovementDescription: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  relatedExtremeUsersIds: string[];
}
