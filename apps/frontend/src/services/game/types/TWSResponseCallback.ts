import type { IGame } from '@tousinclus/types';
import type { ISocketResponse } from '../../../types/ISocketResponse';

export type TWSResponseCallback = (payload: ISocketResponse<IGame>) => void;
