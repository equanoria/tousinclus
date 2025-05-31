export interface IUser {
  id?: string;
  roles: ERole[];
}

export enum ERole {
  HOST = 'Host',
}
