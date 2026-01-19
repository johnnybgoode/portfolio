import { Heading } from './Heading';

type LoadingOrErrorProps = {
  dataType?: string;
  error: unknown;
  isLoading: boolean;
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

export const LoadingOrError = ({
  dataType,
  error,
  isLoading,
}: LoadingOrErrorProps) => {
  if (isLoading) {
    return <Loading />;
  }
  if (error) {
    return (
      <ErrorMessage
        message="Please try again later."
        title={`Error loading ${dataType || 'page'}`}
      />
    );
  }
  return null;
};
