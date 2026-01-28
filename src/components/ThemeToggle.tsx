import { useCallback, useEffect, useRef, useState } from 'react';
import { useColorScheme } from '../hooks/useColorScheme';
import styles from '../styles/components/ThemeToggle.css';
import { Icon } from './ui/Icon';

export const ThemeToggle = () => {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [colorScheme, setColorScheme] = useColorScheme();
  const [labelVisible, setLabelVisible] = useState(false);
  const nextScheme = colorScheme === 'dark' ? 'light' : 'dark';
  const nextSchemeLabel = `${nextScheme.charAt(0).toUpperCase()}${nextScheme.substring(1)} Mode`;
  const toggleLabelVisibility = useCallback(() => {
    setLabelVisible(!labelVisible);
  }, [labelVisible]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current.addEventListener('mouseenter', toggleLabelVisibility);
    ref.current.addEventListener('mouseleave', toggleLabelVisibility);

    return () => {
      if (!ref.current) {
        return;
      }
      ref.current.removeEventListener('mouseEnter', toggleLabelVisibility);
      ref.current.removeEventListener('mouseLeave', toggleLabelVisibility);
    };
  }, [toggleLabelVisibility]);

  return (
    <button
      className={styles.themeToggle}
      onClick={() => setColorScheme(nextScheme)}
      ref={ref}
    >
      <Icon name="sun" size="200" />
      <span
        className={styles.themeToggleLabel}
        style={{ visibility: labelVisible ? 'visible' : 'hidden' }}
      >
        {nextSchemeLabel}
      </span>
    </button>
  );
};
