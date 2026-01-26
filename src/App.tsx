import { Router } from './components/Router';
import { AppClass } from './styles/app.css';
import './styles/reset.css';

export const App = () => (
  <div className={AppClass}>
    <Router />
  </div>
);
