import type { IGame } from '@tousinclus/types';
import type { ISocketResponse } from '../../../types/ISocketResponse';

export type TWaitingResponseCallback = (payload: ISocketResponse<IGame>) => void;
