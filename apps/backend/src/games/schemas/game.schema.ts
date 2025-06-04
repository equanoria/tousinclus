import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EGameStatus, IGame, IGameState } from '@tousinclus/types';
import {
  GameAnswerGroupDocument,
  GameAnswerGroupSchema,
} from './game-answer-group.schema';
import { Document, Types } from 'mongoose';
import { GameVoteDocument, GameVoteSchema } from './game-vote.schema';
import { GameRankingDocument, GameRankingSchema } from './game-ranking.schema';

@Schema({ timestamps: true })
export class GameDocument extends Document<Types.ObjectId> implements IGame {
  @Prop({ enum: EGameStatus, required: true, default: EGameStatus.THINKING })
  status: EGameStatus;

  @Prop({ required: true })
  cardDeckId: string;

  @Prop({ type: [GameAnswerGroupSchema], default: [] })
  answerGroups: Types.DocumentArray<GameAnswerGroupDocument>;

  @Prop({ type: [GameVoteSchema], default: [] })
  votes: Types.DocumentArray<GameVoteDocument>;

  @Prop({ type: [GameRankingSchema], default: [] })
  ranking: Types.DocumentArray<GameRankingDocument>;

  state: IGameState;
  createdAt: Date;
  updatedAt: Date;
}

export const GameSchema = SchemaFactory.createForClass(GameDocument);
