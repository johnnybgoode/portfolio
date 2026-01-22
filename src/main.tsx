import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './styles/app.css';
import { App } from './App.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
    },
  },
});

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }
  const port = new URL(import.meta.url).port;
  // Don't mock data for vercel dev
  // @todo find a better way to check if running via vercel
  if (port === '3000') {
    return;
  }

  const { worker } = await import('./test/mocks/browser');
  return worker.start();
}

enableMocking()
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      </StrictMode>,
    );
  })
  .catch(error => {
    throw new Error(`Failed to enable mocking: ${error}`);
  });
