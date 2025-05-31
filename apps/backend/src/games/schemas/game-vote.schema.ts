import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IGameVote } from '@tousinclus/types';
import { Schema as MongooseSchema, Types } from 'mongoose';
import { RoomTeamDocument } from 'src/rooms/schemas/room-team.schema';

@Schema()
export class GameVoteDocument extends Document implements IGameVote {
  @Prop({ required: true })
  extremeUserId: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: RoomTeamDocument.name,
  })
  createdByTeamId: Types.ObjectId;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: RoomTeamDocument.name,
  })
  votedForTeamId: Types.ObjectId;
}

export const GameVoteSchema = SchemaFactory.createForClass(GameVoteDocument);
