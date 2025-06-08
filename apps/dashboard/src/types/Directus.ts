export interface IDirectusError {
  errors: {
    extensions: {
      code: string;
    };
  }[];
}