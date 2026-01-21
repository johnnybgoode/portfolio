import type { JSX, PropsWithChildren } from 'react';
import { h1Class, h2Class, h3Class } from '../styles/typography.css';

type HeadingProps = PropsWithChildren<{
  level: number;
}>;

const getHeadingClass = (headingLevel: number) => {
  switch (headingLevel) {
    case 1:
      return h1Class;
    case 2:
      return h2Class;
    case 3:
      return h3Class;
    default:
      return undefined;
  }
};

export const Heading = ({ level, children }: HeadingProps) => {
  const headingLevel = Math.min(Math.max(level, 1), 6);
  const Tag = `h${headingLevel}` as keyof JSX.IntrinsicElements;
  const headingClass = getHeadingClass(headingLevel);

  return <Tag className={headingClass}>{children}</Tag>;
};
