import type { NotionBlock } from '@portfolio/notion';
import {
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
} from '@portfolio/notion';
import type { ComponentType } from 'react';
import { Divider } from './ui/Divider';
import { Flex } from './ui/Flex';
import { Heading } from './ui/Heading';
import { List } from './ui/List';
import { RichText } from './ui/RichText';
import { TextBox } from './ui/TextBox';

type BlockRendererProps = {
  block: NotionBlock;
  BlocksComponent: ComponentType<{ parentId: string }>;
  DatabaseComponent: ComponentType<{ databaseId: string }>;
  BlockItemsComponent: ComponentType<{ blocks: NotionBlock[] }>;
};

export const BlockRenderer = ({
  block,
  BlocksComponent,
  DatabaseComponent,
  BlockItemsComponent,
}: BlockRendererProps) => {
  const children = isListBlock(block) ? (
    <BlockItemsComponent blocks={block.children} />
  ) : block.has_children ? (
    <BlocksComponent parentId={block.id} />
  ) : null;

  if (isColumnListBlock(block)) {
    return <Flex gap="300">{children}</Flex>;
  }

  if (isColumnBlock(block)) {
    const colWidth = (block.column.width_ratio || 1) * 100;
    return <div style={{ flex: 1, flexBasis: `${colWidth}%` }}>{children}</div>;
  }

  if (isParagraphBlock(block)) {
    return (
      <TextBox as="p">
        <RichText text={block.paragraph.rich_text} />
        {children}
      </TextBox>
    );
  }

  if (isCalloutBlock(block)) {
    return (
      <TextBox as="aside">
        <RichText text={block.callout.rich_text} />
        {children}
      </TextBox>
    );
  }

  if (isQuoteBlock(block)) {
    return (
      <blockquote>
        <RichText text={block.quote.rich_text} />
        {children}
      </blockquote>
    );
  }

  if (isListBlock(block)) {
    const listType = block.type === 'bulleted_list' ? 'bulleted' : 'numbered';
    return (
      <List type={listType}>
        <BlockItemsComponent blocks={block.children} />
      </List>
    );
  }

  if (isBulletedListItemBlock(block)) {
    return (
      <li>
        <RichText text={block.bulleted_list_item.rich_text} />
        {children}
      </li>
    );
  }

  if (isHeading1Block(block)) {
    return (
      <Heading level={1}>
        <RichText text={block.heading_1.rich_text[0]} />
      </Heading>
    );
  }

  if (isHeading2Block(block)) {
    return (
      <Heading level={2}>
        <RichText text={block.heading_2.rich_text[0]} />
      </Heading>
    );
  }

  if (isHeading3Block(block)) {
    return (
      <Heading level={3}>
        <RichText text={block.heading_3.rich_text[0]} />
      </Heading>
    );
  }

  if (isDatabaseBlock(block)) {
    return <DatabaseComponent databaseId={block.id} />;
  }

  if (isDividerBlock(block)) {
    return <Divider />;
  }

  return null;
};
