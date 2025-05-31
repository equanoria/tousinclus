import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  ETeam,
  IAnswer,
  IAnswerData,
  IGame,
  IUser,
  IVote,
} from '@tousinclus/types';
import { Document } from 'mongoose';

export type IGameMongo = Omit<
  IGame,
  'status' | 'team1' | 'team2' | 'reflectionEndsAt'
>;

@Schema()
export class User implements IUser {
  @Prop({ required: true, type: String })
  id?: string;

  @Prop({ required: true, type: [String] })
  roles: string[];
}

@Schema()
export class AnswerData implements IAnswerData {
  @Prop({ type: String })
  input1: string;

  @Prop({ type: String })
  input2: string;

  @Prop({ type: String })
  input3: string;

  @Prop({ type: [Number] })
  inputCheckboxes: number[];
}

@Schema()
export class Answer implements IAnswer {
  @Prop({ required: true, type: Number })
  cardId: number;

  @Prop({ required: true, type: String })
  team: ETeam;

  @Prop({ required: true, type: AnswerData })
  answer: AnswerData;
}

@Schema()
export class TeamVote {
  @Prop({ required: true, enum: ETeam })
  team: ETeam;

  @Prop({ required: true, enum: ETeam })
  vote: ETeam;
}

@Schema()
export class Vote implements IVote {
  @Prop({ required: true, type: Number })
  cardId: number;

  @Prop({ required: true, type: [TeamVote] })
  votes: TeamVote[];
}

@Schema({ timestamps: true })
export class GameDocument extends Document implements IGameMongo {
  updatedAt: Date;

  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ required: true, type: User })
  createdBy: IUser['id'];

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
