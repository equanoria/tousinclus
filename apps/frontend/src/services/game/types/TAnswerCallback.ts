import type { IAnswer } from '@tousinclus/types';
import type { ISocketResponse } from '../../../types/ISocketResponse';

export type TAnswerCallback = (payload: ISocketResponse<IAnswer>) => void;
