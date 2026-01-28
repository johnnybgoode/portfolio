import { Route, Routes } from 'react-router';
import { LandingPage } from './LandingPage';
import { PageContainer } from './PageContainer';
import { Resume } from './Resume';

export const Router = () => (
  <Routes>
    <Route
      element={
        <PageContainer
          fetchBlocks={false}
          PageComponent={LandingPage}
          pageId="home"
        />
      }
      index
    />
    <Route
      element={
        <PageContainer
          fetchBlocks={false}
          PageComponent={Resume}
          pageId="resume"
        />
      }
      path="/resume"
    />
  </Routes>
);
