import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type RenderOptions, render } from '@testing-library/react';
import type { ReactElement } from 'react';

const mockDependencies = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { gcTime: Number.POSITIVE_INFINITY, retry: false },
    },
  });
  return {
    queryClient,
  } as const;
};

const customRender = (
  ui: ReactElement,
  options: RenderOptions & { route?: string } = {
    reactStrictMode: true,
  },
) => {
  const { queryClient } = mockDependencies();

  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    { ...options },
  );
};

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
