import { Route, Routes } from 'react-router';
import { LandingPage } from './LandingPage';
import { Resume } from './Resume';

export const Router = () => (
  <Routes>
    <Route
      element={<LandingPage pageId="2ed0c25cdd39804ea469c8c0f3c020a5" />}
      path="/"
    />
    <Route
      element={<Resume pageId="2ef0c25cdd398099be9be1e645bb73ec" />}
      path="/resume"
    />
  </Routes>
);
