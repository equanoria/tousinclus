import { IGame } from '@tousinclus/types';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGameDto implements Partial<IGame> {
  @IsString()
  @IsNotEmpty()
  cardDeckId: string;
}
