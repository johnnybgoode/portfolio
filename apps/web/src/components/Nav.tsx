'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nav, navLink, navLinkActive, navLinks } from '../styles/components/Nav.css';

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className={nav}>
      <ul className={navLinks}>
        <li>
          <Link
            className={`${navLink}${pathname.startsWith('/resume') ? ` ${navLinkActive}` : ''}`}
            href="/resume"
          >
            Resume
          </Link>
        </li>
        <li>
          <Link
            className={`${navLink}${pathname.startsWith('/photos') ? ` ${navLinkActive}` : ''}`}
            href="/photos"
          >
            Photos
          </Link>
        </li>
      </ul>
    </nav>
  );
}
