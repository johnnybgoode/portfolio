import type { ReactNode } from 'react';
import {
  type ListProps as ListStyleProps,
  type Sprinkles,
} from '../../styles/sprinkles.css';
import { Box, type BoxProps } from './Box';

type ListProps = {
  items?: ReactNode[];
  type?: 'bulleted' | 'numbered';
} & Pick<Sprinkles, ListStyleProps> &
  Omit<BoxProps<'ul' | 'ol'>, keyof Sprinkles>;

export const List = ({ items, type }: ListProps) => {
  if (!items) {
    return null;
  }
  const tag = type === 'numbered' ? 'ol' : 'ul';
  return (
    <Box as={tag}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Box>
  );
};
