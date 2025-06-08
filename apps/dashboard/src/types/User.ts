import type { IDirectusUser } from '@tousinclus/types';

export type TUser = IDirectusUser & {
  token: string;
};
