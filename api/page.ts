import {
  APIErrorCode,
  Client,
  isFullPage,
  isNotionClientError,
} from '@notionhq/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { parseId } from './utils.js';

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
  const pageId = parseId(req.url!, res);
  if (!pageId) {
    return res.status(400).json({ error: 'Page ID is required.' });
  }
  try {
    const pageData = await fetchPageData(pageId);
    const properties = Object.fromEntries(
      Object.entries(pageData.properties).map(([label, value]) => {
        const fieldKey = label
          .toLowerCase()
          .replace(/[^a-z0-9]/, ' ')
          .replace(/\s+/, '_')
          .split('_')
          .map((w, i) =>
            i > 0 ? `${w.charAt(0).toUpperCase()}${w.substring(1)}` : w,
          )
          .join('');

        return [
          fieldKey,
          {
            label,
            ...value,
          },
        ];
      }),
    );
    res.status(200).json(properties);
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
