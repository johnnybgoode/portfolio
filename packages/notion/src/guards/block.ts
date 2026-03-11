import type {
  BulletedListItemBlock,
  CalloutBlock,
  ChildDatabaseBlock,
  ColumnBlock,
  ColumnListBlock,
  DividerBlock,
  Heading1Block,
  Heading2Block,
  Heading3Block,
  ListBlock,
  NotionBlock,
  ParagraphBlock,
  QuoteBlock,
} from '../types/block.ts';

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
