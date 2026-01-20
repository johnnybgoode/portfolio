import { Route, Routes } from 'react-router';
import { LandingPage } from './components/LandingPage';
import { Page } from './components/Page';
import './App.css';

const Router = () => (
  <Routes>
    <Route
      element={<LandingPage pageId="2ed0c25cdd39804ea469c8c0f3c020a5" />}
      path="/"
    />
    <Route
      element={<Page pageId="2e70c25cdd3981c28b55e02cc9e421ba" />}
      path="/resume"
    />
  </Routes>
);

export const App = () => (
  <>
    <Router />
  </>
);
