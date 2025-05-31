import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  EGameStatus,
  IGame,
  IGameAnswerGroup,
  IGameVote,
} from '@tousinclus/types';
import { GameAnswerGroupSchema } from './game-answer-group.schema';
import { Document, Types } from 'mongoose';
import { GameVoteSchema } from './game-vote.schema';

@Schema()
export class GameDocument extends Document<Types.ObjectId> implements IGame {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ enum: EGameStatus, required: true })
  status: EGameStatus;

  @Prop({ type: [GameAnswerGroupSchema], default: [] })
  answerGroups: IGameAnswerGroup[];

  @Prop({ type: [GameVoteSchema], default: [] })
  votes: IGameVote[];
}

export const GameSchema = SchemaFactory.createForClass(GameDocument);
