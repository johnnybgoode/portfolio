// Types
export type {
  PropertyItemObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client';

// Fetch functions
export { fetchBlocks } from './blocks.ts';
export { fetchBlocksRecursive } from './blocks-recursive.ts';
export type { StaticPageKeys } from './config.ts';
// Config
export { resolvePageId, STATIC_PAGE_IDS } from './config.ts';
export { fetchAndQueryDataSource } from './data-source.ts';
export { fetchDatabase } from './database.ts';
// Guards
export {
  isBulletedListItemBlock,
  isCalloutBlock,
  isColumnBlock,
  isColumnListBlock,
  isDatabaseBlock,
  isDividerBlock,
  isHeading1Block,
  isHeading2Block,
  isHeading3Block,
  isListBlock,
  isParagraphBlock,
  isQuoteBlock,
} from './guards/block.ts';
export {
  isMultiSelectProperty,
  isRichTextProperty,
  isUrlProperty,
} from './guards/properties.ts';
export { fetchLandingPage, fetchPage, fetchResumePage } from './page.ts';
export type {
  BulletedListItemBlock,
  CalloutBlock,
  ChildDatabaseBlock,
  ColumnBlock,
  ColumnListBlock,
  DividerBlock,
  Heading1Block,
  Heading2Block,
  Heading3Block,
  HeadingBlocks,
  ListBlock,
  NotionBlock,
  NotionBlocksRecursive,
  NumberedListItemBlock,
  ParagraphBlock,
  QuoteBlock,
} from './types/block.ts';
export type { DatabaseResponse } from './types/database.ts';
export type {
  ExperiencePageData,
  LandingPageData,
  PageData,
  ResumePageData,
} from './types/page.ts';
export type {
  NarrowProperties,
  PageProperties,
  PagePropertyValue,
  PagePropertyValueWithLabel,
  RelationPropertyValue,
  RichTextPropertyValue,
  TitlePropertyValue,
} from './types/properties.ts';
