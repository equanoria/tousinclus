import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EGameStatus, IGame } from '@tousinclus/types';
import {
  GameAnswerGroupDocument,
  GameAnswerGroupSchema,
} from './game-answer-group.schema';
import { Document, Types } from 'mongoose';
import { GameVoteDocument, GameVoteSchema } from './game-vote.schema';

@Schema()
export class GameDocument extends Document<Types.ObjectId> implements IGame {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ enum: EGameStatus, required: true, default: EGameStatus.WAITING })
  status: EGameStatus;

  @Prop({ required: true })
  cardDeckId: string;

  @Prop({ type: [GameAnswerGroupSchema], default: [] })
  answerGroups: Types.DocumentArray<GameAnswerGroupDocument>;

  @Prop({ type: [GameVoteSchema], default: [] })
  votes: Types.DocumentArray<GameVoteDocument>;
}

export const GameSchema = SchemaFactory.createForClass(GameDocument);
