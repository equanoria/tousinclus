import { IRoom, IRoomTeam } from '@tousinclus/types';

export interface IRedisRoom extends Partial<IRoom> {
  _id: string;
  teams: IRoomTeam[];
}
