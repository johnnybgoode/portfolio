import type { ElementType, PropsWithChildren } from 'react';
import { headingClasses } from '../../styles/typography.css';

type HeadingProps = PropsWithChildren<{
  level: 'title' | 1 | 2 | 3 | 4 | 5;
}>;

export const Heading = ({ level, children }: HeadingProps) => {
  const Tag: ElementType = level === 'title' ? 'h1' : `h${level}`;
  const classKey = level === 'title' ? 'title' : Tag;
  const className = headingClasses[classKey];

  return <Tag className={className}>{children}</Tag>;
};
