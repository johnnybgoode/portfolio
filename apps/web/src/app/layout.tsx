import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';
import { Nav } from '../components/Nav';
import { QueryProvider } from '../components/QueryProvider';
import { ThemeContextProvider } from '../components/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { ThemeWrapper } from '../components/ThemeWrapper';
import '../styles/reset.css';
import '../styles/app.css';

export const metadata: Metadata = {
  title: 'Portfolio | John Entwistle',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          crossOrigin="anonymous"
          href="https://fonts.gstatic.com"
          rel="preconnect"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
          rel="stylesheet"
        />
        <link
          href="/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link
          href="/favicon-32x32.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/favicon-16x16.png"
          rel="icon"
          sizes="16x16"
          type="image/png"
        />
        <link href="/site.webmanifest" rel="manifest" />
      </head>
      <body>
        <QueryProvider>
          <ThemeContextProvider>
            <ThemeWrapper>
              <Nav />
              {children}
              <ThemeToggle />
            </ThemeWrapper>
          </ThemeContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
