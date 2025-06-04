import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ERoomStatus, IRoom } from '@tousinclus/types';
import { RoomTeamDocument, RoomTeamSchema } from './room-team.schema';
import { GameDocument, GameSchema } from 'src/games/schemas/game.schema';
import { Document, Types } from 'mongoose';
import { RoomConfigDocument, RoomConfigSchema } from './room-config.schema';

@Schema({ timestamps: true })
export class RoomDocument extends Document<Types.ObjectId> implements IRoom {
  @Prop({ required: true })
  createdBy: string;

  @Prop({ enum: ERoomStatus, required: true, default: ERoomStatus.OPEN })
  status: ERoomStatus;

  @Prop({ required: true })
  code: string;

  @Prop({ type: [GameSchema], default: [] })
  games: Types.DocumentArray<GameDocument>;

  @Prop({ type: [RoomTeamSchema], default: [] })
  teams: Types.DocumentArray<RoomTeamDocument>;

  @Prop({ required: true })
  deckGroupId: string;

  @Prop()
  organizationName?: string;

  @Prop({ type: Number })
  playerCount?: number;

  @Prop({ type: Date })
  endsAt?: Date;

  @Prop({ type: [RoomConfigSchema] })
  config: RoomConfigDocument;

  createdAt: Date;
  updatedAt: Date;
}

export const RoomSchema = SchemaFactory.createForClass(RoomDocument);
