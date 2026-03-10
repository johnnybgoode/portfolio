import type { ReactNode } from 'react';
import { IconLinkClass } from '../../styles/components/IconLink.css';
import { Icon, type IconProps } from './Icon';

type IconLinkProps = {
  href?: string | null;
  iconName: IconProps['name'];
  linkIcon?: boolean;
  protocol?: 'https://' | 'mailto:' | 'tel:';
  text?: ReactNode;
};
export const IconLink = ({
  href,
  iconName,
  linkIcon,
  protocol: protocolProp,
  text,
}: IconLinkProps) => {
  if (!href) {
    return null;
  }
  const protocol = protocolProp || 'https://';
  const hrefWithProtocol = href.indexOf(':') < 0 ? `${protocol}${href}` : href;
  const shouldLinkIcon = typeof linkIcon !== 'undefined' ? linkIcon : true;
  const linkText = text || href;
  const icon = <Icon name={iconName} paddingInlineEnd="200" />;
  return (
    <div className={IconLinkClass}>
      {!shouldLinkIcon && icon}
      <a href={hrefWithProtocol}>
        {shouldLinkIcon && icon}
        &nbsp;{linkText}
      </a>
    </div>
  );
};
