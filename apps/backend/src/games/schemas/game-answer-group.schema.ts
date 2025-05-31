import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IGameAnswerGroup, IGameAnswers } from '@tousinclus/types';
import { GameAnswersSchema } from './game-answers.schema';
import { Document, Schema as SchemaType, Types } from 'mongoose';
import { RoomTeamDocument } from 'src/rooms/schemas/room-team.schema';

@Schema()
export class GameAnswerGroupDocument
  extends Document
  implements IGameAnswerGroup
{
  @Prop({ required: true })
  extremeUserCardId: string;

  @Prop({
    required: true,
    type: SchemaType.Types.ObjectId,
    ref: RoomTeamDocument.name,
  })
  createdBy: Types.ObjectId;

  @Prop({ type: GameAnswersSchema, required: true })
  answers: IGameAnswers;
}

export const GameAnswerGroupSchema = SchemaFactory.createForClass(
  GameAnswerGroupDocument,
);
