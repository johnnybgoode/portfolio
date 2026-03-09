import { useEffect } from 'react';

const baseTitle = 'John Entwistle';

export const useDocumentTitle = (pageTitle: string, reset: boolean = false) => {
  const title = pageTitle.trim();
  useEffect(() => {
    if (reset) {
      document.title = baseTitle;
    }
    if (title.length === 0) {
      return;
    }
    document.title = `${baseTitle} | ${title}`;
  }, [title, reset]);
};
