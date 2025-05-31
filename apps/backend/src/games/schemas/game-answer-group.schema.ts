import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IGameAnswer, IGameAnswerGroup } from '@tousinclus/types';
import { GameAnswerSchema } from './game-answer.schema';
import { Document, Schema as SchemaType, Types } from 'mongoose';
import { RoomTeamDocument } from 'src/rooms/schemas/room-team.schema';

@Schema()
export class GameAnswerGroupDocument
  extends Document
  implements IGameAnswerGroup
{
  @Prop({ required: true })
  extremeUserId: string;

  @Prop({
    required: true,
    type: SchemaType.Types.ObjectId,
    ref: RoomTeamDocument.name,
  })
  createdByTeamId: Types.ObjectId;

  @Prop({ type: [GameAnswerSchema], required: true })
  answers: IGameAnswer<unknown>[];
}

export const GameAnswerGroupSchema = SchemaFactory.createForClass(
  GameAnswerGroupDocument,
);
