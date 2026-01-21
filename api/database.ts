import { Client, isFullDatabase } from '@notionhq/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const notion = new Client({
  auth: process.env.NOTION_AUTH_TK,
});

const fetchDatabase = async (databaseId: string) => {
  const response = await notion.databases.retrieve({
    database_id: databaseId,
  });
  return response;
};

const parseDatabaseId = (url: string, res: VercelResponse) => {
  try {
    return url.split('?')[0].split('/').pop();
  } catch (__e: unknown) {
    res.status(400).json({ error: 'Failed to parse URL' });
  }
};

export default async function GET(req: VercelRequest, res: VercelResponse) {
  const databaseId = parseDatabaseId(req.url!, res);
  if (!databaseId || typeof databaseId !== 'string') {
    return res.status(400).json({ error: 'Database ID is required.' });
  }

  try {
    const databaseResponse = await fetchDatabase(databaseId);
    const protocol = req.headers['x-forwarded-proto'];
    const host = req.headers.host;
    if (
      !isFullDatabase(databaseResponse) ||
      !databaseResponse.data_sources ||
      !databaseResponse.data_sources.length
    ) {
      console.error(databaseResponse);
      return res
        .status(404)
        .json({ error: 'Data source not found for the given database.' });
    }
    try {
      const response = await fetch(
        `${protocol}://${host}/api/data-source/${databaseId}`,
      );
      const data = await response.json();
      return res.status(response.status).json(data);
    } catch (e) {
      console.error(e);
      res.status(500).json(':(');
    }
  } catch (error: unknown) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch database.' });
  }
}
