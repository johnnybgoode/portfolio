import { errorWrapper } from '../../styles/components/ErrorMessage.css';
import { Heading } from './Heading';

export const ErrorMessage = () => {
  return (
    <div className={errorWrapper} role="alert">
      <Heading level={4}>Something went wrong</Heading>
      <p>We couldn't load this content. Please try again later.</p>
    </div>
  );
};
