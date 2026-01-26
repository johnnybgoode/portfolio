import type { ElementType } from 'react';
import type { SizeProps, SpaceProps } from '../../styles/sprinkles.css';
import { headingClasses } from '../../styles/typography.css';
import { Box, type BoxElementWithStyles } from './Box';

type HeadingElems = 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
type HeadingProps = BoxElementWithStyles<
  HeadingElems,
  SizeProps | SpaceProps
> & {
  level: 'title' | 1 | 2 | 3 | 4 | 5;
};

export const Heading = ({ level, children, ...rest }: HeadingProps) => {
  const tag: ElementType = level === 'title' ? 'h1' : `h${level}`;
  const classKey = level === 'title' ? 'title' : tag;
  const className = headingClasses[classKey];

  return (
    <Box as={tag} className={className} {...rest}>
      {children}
    </Box>
  );
};
