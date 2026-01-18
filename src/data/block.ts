import type {
  BlockObjectResponse,
  BulletedListItemBlockObjectResponse,
  CalloutBlockObjectResponse,
  ColumnBlockObjectResponse,
  ColumnListBlockObjectResponse,
  DividerBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  ParagraphBlockObjectResponse,
  QuoteBlockObjectResponse,
} from '@notionhq/client';

type BaseBlock = Omit<
  BlockObjectResponse,
  | 'object'
  | 'created_time'
  | 'last_edited_time'
  | 'created_by'
  | 'last_edited_by'
  | 'archived'
  | 'in_trash'
>;

export type ListBlock = Omit<BaseBlock, 'type'> & {
  type: 'bulleted_list' | 'numbered_list';
  children: BaseBlock[];
};

export type NotionBlock = BaseBlock | ListBlock;

type NotionBlocksRecursive = {
  [key: string]: NotionBlock & { children?: NotionBlocksRecursive };
};

export const getBlockData = async (
  blockId: string,
): Promise<{ blocks: NotionBlock[] }> => {
  const response = await fetch(`/api/blocks?parentId=${blockId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch block data');
  }
  const data = await response.json();
  return data;
};

export const getBlockDataRecursive = async (
  blockId: string,
): Promise<{ blocks: NotionBlocksRecursive }> => {
  const response = await fetch(`/api/blocks-recursive?parentId=${blockId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch block data recursively');
  }
  const data = await response.json();
  return data;
};

export const isHeading1Block = (
  block: NotionBlock,
): block is Heading1BlockObjectResponse => block.type === 'heading_1';

export const isHeading2Block = (
  block: NotionBlock,
): block is Heading2BlockObjectResponse => block.type === 'heading_2';

export const isHeading3Block = (
  block: NotionBlock,
): block is Heading3BlockObjectResponse => block.type === 'heading_3';

export const isCalloutBlock = (
  block: NotionBlock,
): block is CalloutBlockObjectResponse => {
  return block.type === 'callout';
};

export const isParagraphBlock = (
  block: NotionBlock,
): block is ParagraphBlockObjectResponse => {
  return block.type === 'paragraph';
};

export const isColumnListBlock = (
  block: NotionBlock,
): block is ColumnListBlockObjectResponse => {
  return block.type === 'column_list';
};

export const isColumnBlock = (
  block: NotionBlock,
): block is ColumnBlockObjectResponse => {
  return block.type === 'column';
};

export const isListBlock = (block: NotionBlock): block is ListBlock => {
  return block.type === 'bulleted_list' || block.type === 'numbered_list';
};

export const isBulletedListItemBlock = (
  block: NotionBlock,
): block is BulletedListItemBlockObjectResponse => {
  return block.type === 'bulleted_list_item';
};

export const isQuoteBlock = (
  block: NotionBlock,
): block is QuoteBlockObjectResponse => {
  return block.type === 'quote';
};

export const isDividerBlock = (
  block: NotionBlock,
): block is DividerBlockObjectResponse => {
  return block.type === 'divider';
};
