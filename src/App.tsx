import { Router } from './components/Router';
import { appWrapper } from './styles/app.css';
import './styles/reset.css';
import { darkThemeClass } from './styles/theme.css';

export const App = () => (
  <div className={[appWrapper, darkThemeClass].join(' ')}>
    <Router />
  </div>
);
