export interface IUser {
  id: string;
  roles: ERole[];
}

export enum ERole {
  OPERATOR = 'Operator',
  HOST = 'Host',
}
