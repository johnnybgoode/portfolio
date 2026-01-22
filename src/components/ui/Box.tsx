import {
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';
import { type Sprinkles, sprinkles } from '../../styles/sprinkles.css.ts';
import { omit, pick } from '../../utils/index.ts';

export type BoxProps<C extends ElementType> = {
  as?: C;
  children?: ReactNode;
} & Sprinkles &
  ComponentPropsWithoutRef<C>;

export const Box = <C extends ElementType>(props: BoxProps<C>) => {
  const { as: Component = 'div', ...rest } = props;
  const sprinkleKeys = Array.from(sprinkles.properties.keys());
  const sprinkleProps = pick(rest, sprinkleKeys);
  const forwardProps = omit(rest, sprinkleKeys);

  const className = sprinkles({
    ...sprinkleProps,
  });

  return <Component {...forwardProps} className={className} />;
};
