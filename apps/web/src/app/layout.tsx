import type { Metadata } from 'next';
import { DM_Mono, Montserrat, Nunito_Sans } from 'next/font/google';
import type { PropsWithChildren } from 'react';
import { QueryProvider } from '../components/QueryProvider';
import { ThemeContextProvider } from '../components/ThemeContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { ThemeWrapper } from '../components/ThemeWrapper';
import '../styles/reset.css';
import '../styles/app.css';

const dmMono = DM_Mono({
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  variable: '--font-nunito-sans',
});

export const metadata: Metadata = {
  title: 'Portfolio | John Entwistle',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      className={`${dmMono.variable} ${montserrat.variable} ${nunitoSans.variable}`}
      lang="en"
    >
      <head>
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
              {children}
              <ThemeToggle />
            </ThemeWrapper>
          </ThemeContextProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
