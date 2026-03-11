import type { BlockObjectResponse } from '@notionhq/client';
import { isFullBlock } from '@notionhq/client';
import { isBulletedListItemBlock } from '../guards/block.ts';
import type { NotionBlock } from '../types/block.ts';

export const nestItems = <T>(sourceArray: T[], items: T[], newItem: T) => {
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

export const filterGroups = <T>(arr: T[], predicate: (i: T) => boolean) => {
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

export const stripBlockMetadata = (block: BlockObjectResponse): NotionBlock => {
  const {
    object: _object,
    created_time: _created_time,
    last_edited_time: _last_edited_time,
    created_by: _created_by,
    last_edited_by: _last_edited_by,
    archived: _archived,
    in_trash: _in_trash,
    ...blockData
  } = block;
  return blockData as NotionBlock;
};

export const transformBlocks = (
  results: BlockObjectResponse[],
): NotionBlock[] => {
  const fullBlocks = results
    .filter(
      (block): block is BlockObjectResponse =>
        isFullBlock(block) && !block.archived && !block.in_trash,
    )
    .map(stripBlockMetadata);

  const bulletedListGroups = filterGroups(fullBlocks, isBulletedListItemBlock);
  let blocks = fullBlocks;

  for (const listGroup of bulletedListGroups) {
    blocks = nestItems(blocks, listGroup, {
      type: 'bulleted_list',
      id: `bulleted-list-${listGroup[0].id}`,
      parent: listGroup[0].parent,
      children: listGroup,
    } as NotionBlock);
  }

  return blocks;
};
