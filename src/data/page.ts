import type { PageObjectResponse } from '@notionhq/client';

type PageData = {
  page: PageObjectResponse['properties'];
};

export const getPageData = async (pageId: string) => {
  const response = await fetch(`/api/page?pageId=${pageId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch page data');
  }
  const data: PageData = await response.json();
  return data;
};
