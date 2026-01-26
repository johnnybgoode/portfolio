import type { ReactNode } from 'react';
import type { ListProps as ListStyleProps } from '../../styles/sprinkles.css';
import { Box, type BoxElementWithStyles } from './Box';

type ListProps = {
  items?: ReactNode[];
  type?: 'bulleted' | 'numbered';
} & BoxElementWithStyles<'ul' | 'ol', ListStyleProps>;

export const List = ({ as: _as, items, type }: ListProps) => {
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
