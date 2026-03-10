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

export type OmitProps =
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

export type NotionBlocksRecursive = {
  [key: string]: NotionBlock & { children?: NotionBlocksRecursive };
};
