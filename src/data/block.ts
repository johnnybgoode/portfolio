import type {
  BulletedListItemBlockObjectResponse,
  CalloutBlockObjectResponse,
  ChildDatabaseBlockObjectResponse,
  ColumnBlockObjectResponse,
  ColumnListBlockObjectResponse,
  DividerBlockObjectResponse,
  Heading1BlockObjectResponse,
  Heading2BlockObjectResponse,
  Heading3BlockObjectResponse,
  NumberedListItemBlockObjectResponse,
  ParagraphBlockObjectResponse,
  QuoteBlockObjectResponse,
} from '@notionhq/client';

type OmitProps =
  | 'object'
  | 'created_time'
  | 'last_edited_time'
  | 'created_by'
  | 'last_edited_by'
  | 'archived'
  | 'in_trash';

export type BulletedListItemBlock = Omit<
  BulletedListItemBlockObjectResponse,
  OmitProps
>;
export type CalloutBlock = Omit<CalloutBlockObjectResponse, OmitProps>;
export type ChildDatabaseBlock = Omit<
  ChildDatabaseBlockObjectResponse,
  OmitProps
>;
export type ColumnBlock = Omit<ColumnBlockObjectResponse, OmitProps>;
export type ColumnListBlock = Omit<ColumnListBlockObjectResponse, OmitProps>;
export type DividerBlock = Omit<DividerBlockObjectResponse, OmitProps>;
export type Heading1Block = Omit<Heading1BlockObjectResponse, OmitProps>;
export type Heading2Block = Omit<Heading2BlockObjectResponse, OmitProps>;
export type Heading3Block = Omit<Heading3BlockObjectResponse, OmitProps>;
export type HeadingBlocks = Heading1Block | Heading2Block | Heading3Block;
export type NumberedListItemBlock = Omit<
  NumberedListItemBlockObjectResponse,
  OmitProps
>;
export type ParagraphBlock = Omit<ParagraphBlockObjectResponse, OmitProps>;
export type QuoteBlock = Omit<QuoteBlockObjectResponse, OmitProps>;

type BaseBlock =
  | BulletedListItemBlock
  | CalloutBlock
  | ChildDatabaseBlock
  | ColumnBlock
  | ColumnListBlock
  | DividerBlock
  | Heading1Block
  | Heading2Block
  | Heading3Block
  | NumberedListItemBlock
  | ParagraphBlock
  | QuoteBlock;

type ListItemBlocks = BulletedListItemBlock | NumberedListItemBlock;
export type ListBlock = Omit<
  BulletedListItemBlock,
  'bulleted_list_item' | 'has_children' | 'type'
> & {
  type: 'bulleted_list' | 'numbered_list';
  children: ListItemBlocks[];
};

export type NotionBlock = BaseBlock | ListBlock;

type NotionBlocksRecursive = {
  [key: string]: NotionBlock & { children?: NotionBlocksRecursive };
};

export const getBlockData = async (
  blockId: string,
): Promise<{ blocks: NotionBlock[] }> => {
  const response = await fetch(`/api/blocks/${blockId}`);
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

export const isHeading1Block = (block: NotionBlock): block is Heading1Block =>
  block.type === 'heading_1';

export const isHeading2Block = (block: NotionBlock): block is Heading2Block =>
  block.type === 'heading_2';

export const isHeading3Block = (block: NotionBlock): block is Heading3Block =>
  block.type === 'heading_3';

export const isCalloutBlock = (block: NotionBlock): block is CalloutBlock => {
  return block.type === 'callout';
};

export const isParagraphBlock = (
  block: NotionBlock,
): block is ParagraphBlock => {
  return block.type === 'paragraph';
};

export const isColumnListBlock = (
  block: NotionBlock,
): block is ColumnListBlock => {
  return block.type === 'column_list';
};

export const isColumnBlock = (block: NotionBlock): block is ColumnBlock => {
  return block.type === 'column';
};

export const isListBlock = (block: NotionBlock): block is ListBlock => {
  return block.type === 'bulleted_list' || block.type === 'numbered_list';
};

export const isBulletedListItemBlock = (
  block: NotionBlock,
): block is BulletedListItemBlock => {
  return block.type === 'bulleted_list_item';
};

export const isQuoteBlock = (block: NotionBlock): block is QuoteBlock => {
  return block.type === 'quote';
};

export const isDividerBlock = (block: NotionBlock): block is DividerBlock => {
  return block.type === 'divider';
};

export const isDatabaseBlock = (
  block: NotionBlock,
): block is ChildDatabaseBlock => {
  return block.type === 'child_database';
};
