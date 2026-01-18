import type { BlockObjectResponse } from '@notionhq/client';
import { Client, isFullBlock } from '@notionhq/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_AUTH_TK,
});

type NotionBlockResponse = Omit<
  BlockObjectResponse,
  | 'object'
  | 'created_time'
  | 'last_edited_time'
  | 'created_by'
  | 'last_edited_by'
  | 'archived'
  | 'in_trash'
>;
type NotionBlocksRecursive = {
  [key: string]: NotionBlockResponse & { children?: NotionBlocksRecursive };
};

const fetchBlocksRecursive = async (blockId: string) => {
  const blocks = {} as NotionBlocksRecursive;
  let cursor: string | undefined = undefined;

  const response = await notion.blocks.children.list({
    block_id: blockId,
    start_cursor: cursor,
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
    blocks[block.id] = blockData;
    if (isFullBlock(block) && block.has_children) {
      const childBlocks = await fetchBlocksRecursive(block.id);
      blocks[block.id]['children'] = childBlocks;
    }
  }

  return blocks;
};

export default async function GET(req: VercelRequest, res: VercelResponse) {
  if (!req.query.parentId || typeof req.query.parentId !== 'string') {
    return res.status(400).json({ error: 'Missing pageId in request body.' });
  }
  let pageBlocks;

  try {
    pageBlocks = await fetchBlocksRecursive(req.query.parentId);
  } catch (__error) {
    // @todo handle NotionClientErrors
    return res.status(500).json({ error: 'Failed to fetch blocks.' });
  }

  res.status(200).json({
    blocks: pageBlocks,
  });
}
