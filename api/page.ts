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

export default async function GET(req: VercelRequest, res: VercelResponse) {
  if (!req.query.pageId || typeof req.query.pageId !== 'string') {
    return res.status(400).json({ error: 'Missing pageId in request body.' });
  }
  try {
    const pageData = await fetchPageData(req.query.pageId);
    res.status(200).json({
      page: pageData.properties,
    });
  } catch (error) {
    if (
      isNotionClientError(error) &&
      error.code === APIErrorCode.ObjectNotFound
    ) {
      return res.status(404).json({ error: 'Page not found.' });
    }

    return res.status(500).json({ error: 'Internal error.' });
  }
}
