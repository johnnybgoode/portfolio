import type { ReactNode } from 'react';
import { ListClass } from '../../styles/components/List.css';
import type { ListProps as ListStyleProps } from '../../styles/sprinkles.css';
import { Box, type BoxElementWithStyles } from './Box';

type BaseListProps = {
  type?: 'bulleted' | 'numbered';
} & BoxElementWithStyles<'ul' | 'ol', ListStyleProps>;

interface ItemListProps extends BaseListProps {
  items?: ReactNode[];
  children?: never;
}
interface ChildrenListProps extends BaseListProps {
  children: ReactNode;
  items?: never;
}

type ListProps = ItemListProps | ChildrenListProps;

export const List = ({
  as: _as,
  children,
  items,
  type,
  ...rest
}: ListProps) => {
  if (!items && !children) {
    return null;
  }
  const tag = type === 'numbered' ? 'ol' : 'ul';
  return (
    <Box as={tag} className={ListClass} margin="200" {...rest}>
      {children || items?.map((item, i) => <li key={i}>{item}</li>)}
    </Box>
  );
};
