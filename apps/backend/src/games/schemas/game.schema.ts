import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EGameStatus, IGame, IGameAnswerGroup } from '@tousinclus/types';
import { GameAnswerGroupSchema } from './game-answer-group.schema';
import { Document } from 'mongoose';

@Schema()
export class GameDocument extends Document implements IGame {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ enum: EGameStatus, required: true })
  status: EGameStatus;

  @Prop({ type: [GameAnswerGroupSchema], default: [] })
  answerGroups: IGameAnswerGroup[];
}

export const GameSchema = SchemaFactory.createForClass(GameDocument);
