import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type RenderOptions, render } from '@testing-library/react';
import type { PropsWithChildren, ReactElement } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { gcTime: Number.POSITIVE_INFINITY, retry: false },
  },
});

// biome-ignore lint: style/useComponentExportOnlyModules
const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options: Omit<RenderOptions, 'wrapper'> & { route?: string } = {
    reactStrictMode: true,
  },
) => render(ui, { wrapper: AppProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
