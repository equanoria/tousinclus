import { IUser } from '@tousinclus/types';

declare module 'express' {
  export interface Request {
    user?: IUser;
  }
}
