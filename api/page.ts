import {
  APIErrorCode,
  Client,
  isFullPage,
  isNotionClientError,
} from '@notionhq/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_AUTH_TK,
});

const fetchPageData = async (pageId: string) => {
  const pageData = await notion.pages.retrieve({ page_id: pageId });
  if (!isFullPage(pageData)) {
    throw new Error('Page data is not a full page object.');
  }
  return pageData;
};

const parsePageId = (url: string, res: VercelResponse) => {
  try {
    return url.split('?')[0].split('/').pop();
  } catch (__e: unknown) {
    res.status(400).json({ error: 'Failed to parse URL' });
  }
};

export default async function GET(req: VercelRequest, res: VercelResponse) {
  const pageId = parsePageId(req.url!, res);
  if (!pageId) {
    return res.status(400).json({ error: 'Page ID is required.' });
  }
  try {
    const pageData = await fetchPageData(pageId);
    res.status(200).json(pageData.properties);
  } catch (error: unknown) {
    console.error(error);
    if (
      isNotionClientError(error) &&
      error.code === APIErrorCode.ObjectNotFound
    ) {
      return res.status(404).json({ error: 'Page not found.' });
    }

    return res.status(500).json({ error: 'Internal error.' });
  }
}
