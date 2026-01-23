import type { ElementType, PropsWithChildren } from 'react';
import { headingClasses } from '../../styles/typography.css';

type HeadingProps = PropsWithChildren<{
  level: 1 | 2 | 3 | 4 | 5;
}>;

export const Heading = ({ level, children }: HeadingProps) => {
  const Tag: ElementType = `h${level}`;
  const className = headingClasses[`h${level}Class`];

  return <Tag className={className}>{children}</Tag>;
};
