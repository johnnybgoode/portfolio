import { Router } from './components/Router';
import { ThemeToggle } from './components/ThemeToggle';
import { useColorScheme } from './hooks/useColorScheme';
import { appWrapper } from './styles/app.css';
import './styles/reset.css';
import { darkThemeClass, lightThemeClass } from './styles/theme.css';

export const App = () => {
  const [colorScheme] = useColorScheme();
  const colorSchemeClass =
    colorScheme === 'dark' ? darkThemeClass : lightThemeClass;
  return (
    <div className={[appWrapper, colorSchemeClass].join(' ')}>
      <Router />
      <ThemeToggle />
    </div>
  );
};
