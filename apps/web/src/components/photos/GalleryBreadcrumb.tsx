import Link from 'next/link';
import {
  breadcrumb,
  breadcrumbCurrent,
  breadcrumbLink,
  breadcrumbSep,
} from '~styles/components/photos.css';

type Crumb = { label: string; href: string };

type GalleryBreadcrumbProps = {
  crumbs: Crumb[];
  current: string;
};

export function GalleryBreadcrumb({ crumbs, current }: GalleryBreadcrumbProps) {
  return (
    <nav className={breadcrumb}>
      {crumbs.map(crumb => (
        <>
          <Link className={breadcrumbLink} href={crumb.href} key={crumb.href}>
            {crumb.label}
          </Link>
          <span className={breadcrumbSep}>›</span>
        </>
      ))}
      <span className={breadcrumbCurrent}>{current}</span>
    </nav>
  );
}
