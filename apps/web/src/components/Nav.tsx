import Link from 'next/link';
import { nav, navLink, navLinks, navLogo } from '../styles/components/Nav.css';

export function Nav() {
  return (
    <nav className={nav}>
      <Link className={navLogo} href="/">
        Jack
      </Link>
      <ul className={navLinks}>
        <li>
          <Link className={navLink} href="/resume">
            Resume
          </Link>
        </li>
        <li>
          <Link className={navLink} href="/photos">
            Photos
          </Link>
        </li>
      </ul>
    </nav>
  );
}
