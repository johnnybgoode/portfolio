import { isFullBlock } from '@notionhq/client';
import { notion } from './client.ts';
import { stripBlockMetadata } from './transform/blocks.ts';
import type { NotionBlocksRecursive } from './types/block.ts';

export const fetchBlocksRecursive = async (
  blockId: string,
): Promise<NotionBlocksRecursive> => {
  const blocks = {} as NotionBlocksRecursive;

  const response = await notion.blocks.children.list({
    block_id: blockId,
  });

  for (const block of response.results) {
    if (!isFullBlock(block)) {
      continue;
    }
    if (block.archived || block.in_trash) {
      continue;
    }
    const blockData = stripBlockMetadata(block);
    blocks[block.id] = blockData as NotionBlocksRecursive[string];
    if (block.has_children) {
      const childBlocks = await fetchBlocksRecursive(block.id);
      blocks[block.id].children = childBlocks;
    }
  }

  return blocks;
};
