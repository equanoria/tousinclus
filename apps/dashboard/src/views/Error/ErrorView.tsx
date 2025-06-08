import { useAuth } from "../../context/AuthProvider";

export interface IError {
  message?: string;
}

export const ErrorView = ({ message }: IError) => {
  const { user } = useAuth();
  console.log("ErrorView", { user });

  return (
    <>
      <p>There is an error.</p>
      <code>{message ?? 'Unknown error.'}</code>
    </>
  );
};
