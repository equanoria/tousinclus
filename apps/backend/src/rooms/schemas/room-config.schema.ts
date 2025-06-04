import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IRoomConfig } from '@tousinclus/types';
import { Document } from 'mongoose';

@Schema()
export class RoomConfigDocument extends Document implements IRoomConfig {
  @Prop({ type: Number, required: true })
  thinkingDuration: number;

  @Prop()
  organizationName?: string;

  @Prop({ type: Number })
  playerCount?: number;
}

export const RoomConfigSchema =
  SchemaFactory.createForClass(RoomConfigDocument);
