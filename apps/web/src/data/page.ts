import type { PageData } from '@portfolio/notion';

export const getPage = async <T extends PageData>(pageId: string) => {
  const response = await fetch(`/api/page/${pageId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch page data');
  }
  const data: T = await response.json();
  return data;
};
