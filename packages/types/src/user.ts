import type { Types } from 'mongoose';

export interface IUser {
  id: string;
  roles: ERole[];
}

export enum ERole {
  HOST = 'Host',
}
