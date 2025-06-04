import { IsDate, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { IGameState } from '@tousinclus/types';
import { Type } from 'class-transformer';

export class GameStateDto implements IGameState {
  @ValidateNested()
  @Type(() => GameStateThinkingDto)
  thinking: IGameState['thinking'];

  @ValidateNested()
  @Type(() => GameStateDebateDto)
  debate: IGameState['debate'];
}

export class GameStateThinkingDto {
  @IsDate()
  @Type(() => Date)
  endsAt: Date;
}

export class GameStateDebateDto {
  @IsString()
  @IsNotEmpty()
  currentVote: string;
}
