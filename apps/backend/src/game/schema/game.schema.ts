import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ETeam, IAnswer, IAnswerData, IGame, IVote } from '@tousinclus/types';
import { Document } from 'mongoose';

type IGameMongo = Omit<IGame, 'status' | 'team1' | 'team2'>;

@Schema()
export class AnswerData implements IAnswerData {
  @Prop({ required: true, type: String })
  input1: string;

  @Prop({ required: true, type: String })
  input2: string;

  @Prop({ required: true, type: String })
  input3: string;

  @Prop({ required: true, type: [Number] })
  inputCheckboxes: string[];
}

@Schema()
export class Answer implements IAnswer {
  @Prop({ required: true, type: Number })
  cardId: number;

  @Prop({ required: true, type: ETeam })
  team: ETeam;

  @Prop({ required: true, type: AnswerData })
  answer: AnswerData;
}

@Schema()
export class Vote implements IVote {
  @Prop({ required: true, type: Number })
  cardId: number;

  @Prop({ required: true, type: [ETeam] })
  votes: { team: ETeam; vote: ETeam }[];
}

@Schema({ timestamps: true })
export class GameDocument extends Document implements IGameMongo {
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true, type: String })
  code: string;

  @Prop({ required: true, type: Number })
  cardGroupId: number;

  @Prop({ required: true, type: [Answer] })
  answers: Answer[];

  @Prop({ required: true, type: [Vote] })
  votes: Vote[];
}

export const GameSchema = SchemaFactory.createForClass(GameDocument);
