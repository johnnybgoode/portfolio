import type { JSX, PropsWithChildren } from 'react';

type HeadingProps = PropsWithChildren<{
  level: number;
}>;

export const Heading = ({ level, children }: HeadingProps) => {
  const headingLevel = Math.min(Math.max(level, 1), 6);
  const Tag = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  return <Tag>{children}</Tag>;
};
