import { Heading } from './Heading';

type LoadingOrErrorProps = {
  isLoading: boolean;
  error: unknown;
};

type ErrorMessageProps = {
  title: string;
  message: string;
};

export const Loading = () => <div>Loading...</div>;
export const ErrorMessage = ({ title, message }: ErrorMessageProps) => (
  <div>
    <Heading level={3}>{title}</Heading>
    {message}
  </div>
);

export const LoadingOrError = ({ isLoading, error }: LoadingOrErrorProps) => {
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return (
      <ErrorMessage
        message="Please try again later."
        title="Error loading page"
      />
    );
  }
  return null;
};
