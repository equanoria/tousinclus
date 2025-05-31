import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IGameAnswers } from '@tousinclus/types';
import { Document } from 'mongoose';

@Schema()
export class GameAnswersDocument extends Document implements IGameAnswers {
  @Prop()
  inclusionIssueDescription: string;

  @Prop()
  proposedSolutionDescription: string;

  @Prop()
  experienceImprovementDescription: string;

  @Prop({ type: [String] })
  relatedExtremeUsersIds: string[];
}

export const GameAnswersSchema =
  SchemaFactory.createForClass(GameAnswersDocument);
