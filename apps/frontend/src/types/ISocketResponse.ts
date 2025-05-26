export interface ISocketResponse<T> {
  status: string;
  message: string;
  errorCode?: 'FORBIDDEN' | 'NOT_FOUND';
  data: T;
}
