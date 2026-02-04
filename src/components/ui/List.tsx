import type { ReactNode } from 'react';
import { listWrapper } from '../../styles/components/List.css';
import type {
  ListProps as ListStyleProps,
  SpaceProps,
} from '../../styles/sprinkles.css';
import { Box, type BoxElementWithStyles } from './Box';

type BaseListProps = {
  type?: 'bulleted' | 'numbered';
  variant?: keyof typeof listWrapper;
} & BoxElementWithStyles<'ul' | 'ol', ListStyleProps | SpaceProps>;

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
  variant,
  ...rest
}: ListProps) => {
  if (!items && !children) {
    return null;
  }
  const tag = type === 'numbered' ? 'ol' : 'ul';

  return (
    <Box as={tag} className={listWrapper[variant || 'block']} {...rest}>
      {children || items?.map((item, i) => <li key={i}>{item}</li>)}
    </Box>
  );
};
