import { Route, Routes } from 'react-router';
import { LandingPage } from './LandingPage';
import { Resume } from './Resume';

export const Router = () => (
  <Routes>
    <Route element={<LandingPage pageId="home" />} path="/" />
    <Route element={<Resume pageId="resume" />} path="/resume" />
  </Routes>
);
