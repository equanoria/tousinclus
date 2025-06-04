import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IGameRanking } from '@tousinclus/types';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { RoomTeamDocument } from 'src/rooms/schemas/room-team.schema';

@Schema()
export class GameRankingDocument extends Document implements IGameRanking {
  @Prop({ type: Number, required: true })
  score: number;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: RoomTeamDocument.name,
  })
  team: Types.ObjectId;
}

export const GameRankingSchema =
  SchemaFactory.createForClass(GameRankingDocument);
