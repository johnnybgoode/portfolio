import { ErrorBoundary } from 'react-error-boundary';
import { Router } from './components/Router';
import { ThemeToggle } from './components/ThemeToggle';
import { useColorScheme } from './hooks/useColorScheme';
import { appWrapper } from './styles/app.css';
import './styles/reset.css';
import { Suspense } from 'react';
import { ErrorMessage } from './components/ui/ErrorMessage';
import { Loading } from './components/ui/Loading';
import { darkThemeClass, lightThemeClass } from './styles/theme.css';

export const App = () => {
  const [colorScheme] = useColorScheme();
  const colorSchemeClass =
    colorScheme === 'dark' ? darkThemeClass : lightThemeClass;

  return (
    <div className={[appWrapper, colorSchemeClass].join(' ')}>
      <ErrorBoundary fallback={<ErrorMessage />}>
        <Suspense fallback={<Loading size="lg" variant="fullscreen" />}>
          <Router />
        </Suspense>
      </ErrorBoundary>
      <ThemeToggle />
    </div>
  );
};
