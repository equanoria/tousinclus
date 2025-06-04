import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IRoomTeam } from '@tousinclus/types';
import { Document, Types } from 'mongoose';

@Schema()
export class RoomTeamDocument
  extends Document<Types.ObjectId>
  implements IRoomTeam
{
  @Prop()
  name: string;

  @Prop()
  client: string;
}

export const RoomTeamSchema = SchemaFactory.createForClass(RoomTeamDocument);
