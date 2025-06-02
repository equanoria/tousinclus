export interface IUser {
  id: string;
  roles: ERole[];
}

export enum ERole {
  ADMIN = 'Admin',
  HOST = 'Host',
}
