import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IGameAnswer } from '@tousinclus/types';
import { Document } from 'mongoose';

@Schema()
export class GameAnswerDocument
  extends Document
  implements IGameAnswer<unknown>
{
  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  value: unknown;
}

export const GameAnswerSchema =
  SchemaFactory.createForClass(GameAnswerDocument);
