import type { PropsWithChildren } from 'react';
import { icons } from '../../styles/icons.css';

type IconProps = PropsWithChildren<{
  name: keyof typeof icons;
}>;

export const Icon = ({ name }: IconProps) => {
  return <i className={icons[name]}></i>;
};
