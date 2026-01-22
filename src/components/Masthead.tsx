import type { PropsWithChildren } from 'react';

type MastheadProps = PropsWithChildren<{}>;
export const Masthead = ({ children }: MastheadProps) => {
  return <section>{children}</section>;
};
