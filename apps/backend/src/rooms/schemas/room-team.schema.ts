import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IRoomTeam } from '@tousinclus/types';
import { Document } from 'mongoose';

@Schema()
export class RoomTeamDocument extends Document implements IRoomTeam {
  @Prop()
  teamName: string;
}

export const RoomTeamSchema = SchemaFactory.createForClass(RoomTeamDocument);
