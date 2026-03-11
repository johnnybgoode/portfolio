import { isFullPage } from '@notionhq/client';
import { notion } from './client.ts';
import { resolvePageId } from './config.ts';
import { transformPageProperties } from './transform/page.ts';
import type {
  LandingPageData,
  PageData,
  ResumePageData,
} from './types/page.ts';

export const fetchPage = async <T extends PageData>(
  pageId: string,
): Promise<T> => {
  const resolvedId = resolvePageId(pageId);
  if (!resolvedId) {
    throw new Error('Page ID is required.');
  }

  const pageData = await notion.pages.retrieve({ page_id: resolvedId });
  if (!isFullPage(pageData)) {
    throw new Error('Page data is not a full page object.');
  }

  return transformPageProperties(pageData.properties) as T;
};

export const fetchResumePage = (pageId: string) =>
  fetchPage<ResumePageData>(pageId);

export const fetchLandingPage = (pageId: string) =>
  fetchPage<LandingPageData>(pageId);
