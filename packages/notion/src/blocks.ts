import type { BlockObjectResponse } from '@notionhq/client';
import { isFullBlock } from '@notionhq/client';
import { notion } from './client.ts';
import { resolvePageId } from './config.ts';
import { transformBlocks } from './transform/blocks.ts';
import type { NotionBlock } from './types/block.ts';

export const fetchBlocks = async (
  parentId: string,
): Promise<{ blocks: NotionBlock[] }> => {
  const resolvedId = resolvePageId(parentId);
  if (!resolvedId) {
    throw new Error('Parent ID is required.');
  }
  const response = await notion.blocks.children.list({
    block_id: resolvedId,
  });

  const blocks = transformBlocks(
    response.results.filter((block): block is BlockObjectResponse =>
      isFullBlock(block),
    ),
  );

  return { blocks };
};
