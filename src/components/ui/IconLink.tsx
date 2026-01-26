import type { ReactNode } from 'react';
import { IconLinkClass } from '../../styles/components/IconLink.css';
import { Icon, type IconProps } from './Icon';

type IconLinkProps = {
  href?: string | null;
  iconName: IconProps['name'];
  linkIcon?: boolean;
  text?: ReactNode;
};
export const IconLink = ({ href, iconName, linkIcon, text }: IconLinkProps) => {
  if (!href) {
    return null;
  }
  const shouldLinkIcon = typeof linkIcon !== 'undefined' ? linkIcon : true;
  const linkText = text || href;
  const icon = <Icon name={iconName} paddingInlineEnd="200" width="100" />;
  return (
    <div className={IconLinkClass}>
      {!shouldLinkIcon && icon}
      <a href={href}>
        {shouldLinkIcon && icon}
        &nbsp;{linkText}
      </a>
    </div>
  );
};
