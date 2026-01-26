import type { ReactNode } from 'react';
import { IconLabelClass } from '../../styles/components/IconLabel.css';
import { Icon, type IconProps } from './Icon';

type IconLabelProps = {
  iconName: IconProps['name'];
  label: ReactNode;
};
export const IconLabel = ({ iconName, label }: IconLabelProps) => {
  if (!label) {
    return null;
  }
  return (
    <div className={IconLabelClass}>
      <Icon name={iconName} paddingInlineEnd="200" width="100" />
      &nbsp;{label}
    </div>
  );
};
