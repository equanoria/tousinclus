import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IGameVote } from '@tousinclus/types';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { RoomTeamDocument } from 'src/rooms/schemas/room-team.schema';

@Schema()
export class GameVoteDocument extends Document implements IGameVote {
  @Prop({ required: true })
  extremeUserCardId: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: RoomTeamDocument.name,
  })
  createdBy: Types.ObjectId;

  @Prop({
    required: true,
    type: MongooseSchema.Types.ObjectId,
    ref: RoomTeamDocument.name,
  })
  votedFor: Types.ObjectId;
}

export const GameVoteSchema = SchemaFactory.createForClass(GameVoteDocument);
