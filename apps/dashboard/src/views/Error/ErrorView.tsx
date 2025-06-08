export interface IError {
  message?: string;
}

export const ErrorView = ({ message }: IError) => {
  return (
    <>
      <p>There is an error.</p>
      <code>{message ?? 'Unknown error.'}</code>
    </>
  );
};
