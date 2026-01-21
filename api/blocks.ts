import type { BlockObjectResponse } from '@notionhq/client';
import { Client, isFullBlock } from '@notionhq/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  isBulletedListItemBlock,
  type NotionBlock,
} from '../src/data/block.ts';

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_AUTH_TK,
});

const nestItems = <T>(sourceArray: T[], items: T[], newItem: T) => {
  if (items.length === 0) {
    return sourceArray;
  }

  const firstItemIndex = sourceArray.indexOf(items[0]);

  if (firstItemIndex === -1) {
    throw new Error('Items not found in source array');
  }

  return [
    ...sourceArray.slice(0, firstItemIndex),
    newItem,
    ...sourceArray.slice(firstItemIndex + items.length),
  ];
};

const filterGroups = <T>(arr: T[], predicate: (i: T) => boolean) => {
  const groups: T[][] = [];
  let currentGroup: T[] = [];
  for (const i of arr) {
    if (predicate(i)) {
      currentGroup.push(i);
    } else if (currentGroup.length > 0) {
      groups.push(currentGroup);
      currentGroup = [];
    }
  }
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
};

const parseParentId = (url: string, res: VercelResponse) => {
  try {
    return url.split('?')[0].split('/').pop();
  } catch (__e: unknown) {
    res.status(400).json({ error: 'Failed to parse URL' });
  }
};

export default async function GET(req: VercelRequest, res: VercelResponse) {
  const parentId = parseParentId(req.url!, res);

  if (!parentId || typeof parentId !== 'string') {
    return res.status(400).json({ error: 'Parent ID is required.' });
  }

  try {
    const response = await notion.blocks.children.list({
      block_id: parentId,
    });

    const fullBlocks = response.results
      .filter(
        (block): block is BlockObjectResponse =>
          isFullBlock(block) && !block.archived && !block.in_trash,
      )
      .map(block => {
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
        return blockData as NotionBlock;
      });

    const bulletedListGroups = filterGroups(
      fullBlocks,
      isBulletedListItemBlock,
    );
    let blocks = fullBlocks;

    for (const listGroup of bulletedListGroups) {
      blocks = nestItems(blocks, listGroup, {
        type: 'bulleted_list',
        id: `bulleted-list-${listGroup[0].id}`,
        parent: listGroup[0].parent,
        children: listGroup,
      } as NotionBlock);
    }

    res.status(200).json({
      blocks,
    });
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch blocks.' });
  }
}
