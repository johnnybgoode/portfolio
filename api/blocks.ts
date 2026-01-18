import type { BlockObjectResponse } from '@notionhq/client';
import { Client, isFullBlock } from '@notionhq/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_AUTH_TK,
});

type NotionBlock = Omit<
  BlockObjectResponse,
  | 'object'
  | 'created_time'
  | 'last_edited_time'
  | 'created_by'
  | 'last_edited_by'
  | 'archived'
  | 'in_trash'
>;

export default async function GET(req: VercelRequest, res: VercelResponse) {
  if (!req.query.parentId || typeof req.query.parentId !== 'string') {
    return res.status(400).json({ error: 'Missing parentId param.' });
  }
  const blocks: NotionBlock[] = [];

  try {
    const response = await notion.blocks.children.list({
      block_id: req.query.parentId,
    });

    for (const block of response.results) {
      if (!isFullBlock(block)) {
        continue;
      }
      const {
        object,
        created_time,
        last_edited_time,
        created_by,
        last_edited_by,
        archived,
        in_trash,
        ...blockData
      } = block;
      if (archived || in_trash) {
        continue;
      }
      blocks.push(blockData);
    }

    res.status(200).json({
      blocks,
    });
  } catch (__error) {
    // @todo handle NotionClientErrors
    res.status(500).json({ error: 'Failed to fetch blocks.' });
  }
}
