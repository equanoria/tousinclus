import type { Types } from 'mongoose';

export interface IUser {
  id?: Types.ObjectId | string;
  roles: ERole[];
}

export enum ERole {
  HOST = 'Host',
}
