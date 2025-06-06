import type { ISocketResponse } from '../../../types/ISocketResponse';

export type TWSResponseCallback<T> = (payload: ISocketResponse<T>) => void;
