import { Route, Routes } from 'react-router';
import { Page } from './components/Page';
import './App.css';

const Router = () => (
  <Routes>
    <Route
      element={
        <Page displayTitle={false} pageId="2ea0c25cdd3980649eb4c157c0a41524" />
      }
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
