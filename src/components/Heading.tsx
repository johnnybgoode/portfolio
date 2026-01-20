import type { JSX, PropsWithChildren } from 'react';
import {
  headingStyle1,
  headingStyle2,
  headingStyle3,
} from '../styles/typography.css';

type HeadingProps = PropsWithChildren<{
  level: number;
}>;

const getHeadingClass = (headingLevel: number) => {
  switch (headingLevel) {
    case 1:
      return headingStyle1;
    case 2:
      return headingStyle2;
    case 3:
      return headingStyle3;
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
