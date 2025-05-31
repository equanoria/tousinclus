import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IGame, IRoom, IRoomTeam } from '@tousinclus/types';
import { RoomTeamSchema } from './room-team.schema';
import { GameSchema } from 'src/games/schemas/game.schema';
import { Document, Types } from 'mongoose';

@Schema()
export class RoomDocument extends Document<Types.ObjectId> implements IRoom {
  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ required: true })
  createdBy: string;

  @Prop({ required: true })
  code: string;

  @Prop()
  organizationName?: string;

  @Prop({ type: Number })
  playerCount?: number;

  @Prop({ type: [RoomTeamSchema], default: [] })
  teams: IRoomTeam[];

  @Prop({ type: [GameSchema], default: [] })
  games: IGame[];
}

export const RoomSchema = SchemaFactory.createForClass(RoomDocument);
