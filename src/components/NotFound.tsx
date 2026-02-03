import { headerClass, landingPageClass } from '../styles/pages/LandingPage.css';
import { Heading } from './ui/Heading';

export const NotFound = () => {
  return (
    <div className={landingPageClass}>
      <header className={headerClass}>
        <Heading level={1}>Page not found</Heading>
        <Heading level={4}>
          <a href="/">Click here to go home</a>.
        </Heading>
      </header>
    </div>
  );
};
