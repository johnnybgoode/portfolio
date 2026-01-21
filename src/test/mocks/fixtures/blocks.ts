import type {
  BulletedListItemBlock,
  CalloutBlock,
  Heading1Block,
  Heading2Block,
  Heading3Block,
  HeadingBlocks,
  ListBlock,
  ParagraphBlock,
  QuoteBlock,
} from '../../../data/block';
import {
  makeRichTextWithColor,
  makeToggleableRichTextWithColor,
} from './properties';
import { makeId } from './utils';

type PageParent = {
  type: 'page_id';
  page_id: string;
};
const makePageParent = (id: string): PageParent => ({
  type: 'page_id',
  page_id: id,
});

type MakeHeadingBlock<T extends HeadingBlocks['type']> = (
  t: T,
) => T extends 'heading_1'
  ? Heading1Block
  : T extends 'heading_2'
    ? Heading2Block
    : T extends 'heading_3'
      ? Heading3Block
      : never;

export const makeHeadingBlock = <T extends HeadingBlocks['type']>(
  type: T,
  text: string,
) => {
  const id = makeId(text);

  return {
    type,
    [type]: makeToggleableRichTextWithColor(text),
    id,
    has_children: false,
    parent: makePageParent(id),
  } as ReturnType<MakeHeadingBlock<T>>;
};

type ContentBlockTypes = 'bulleted_list_item' | 'paragraph' | 'quote';
type MakeContentBlock<T extends ContentBlockTypes> = (
  t: T,
) => T extends 'bulleted_list_item'
  ? BulletedListItemBlock
  : T extends 'paragraph'
    ? ParagraphBlock
    : T extends 'quote'
      ? QuoteBlock
      : never;
type ContentBlockOptions<T extends ContentBlockTypes> = Partial<
  Omit<ReturnType<MakeContentBlock<T>>, 'type'>
>;

export const makeContentBlock = <T extends ContentBlockTypes>(
  type: T,
  text: string,
  options?: ContentBlockOptions<T>,
) => {
  const id = makeId(text.substring(0, 10));
  return {
    type,
    [type]: makeRichTextWithColor(text),
    id,
    has_children: false,
    parent: makePageParent(id),
    ...options,
  } as ReturnType<MakeContentBlock<T>>;
};

export const makeCalloutBlock = (text: string): CalloutBlock => {
  const id = makeId(text.substring(0, 10));
  return {
    type: 'callout',
    callout: {
      ...makeRichTextWithColor(text),
      icon: null,
    },
    id,
    has_children: false,
    parent: makePageParent(id),
  };
};

export const makeListBlock = (children: ListBlock['children']): ListBlock => {
  const firstChild = children[0];
  const id = `list-parent-${firstChild.id}`;
  const childType = firstChild.type;
  const type =
    childType === 'bulleted_list_item'
      ? 'bulleted_list'
      : childType === 'numbered_list_item'
        ? 'numbered_list'
        : null;
  if (type === null) {
    throw new Error(`Invalid list child ${childType}`);
  }
  return {
    type,
    children,
    id,
    parent: makePageParent(id),
  };
};

export const makeBlocks = () => ({ blocks: [] });
