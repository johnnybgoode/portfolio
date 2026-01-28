import type { NotionBlock } from '../data/block';
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
} from '../data/block';
import { BlockItems, Blocks } from './Blocks';
import { Database } from './Database';
import { Divider } from './ui/Divider';
import { Flex } from './ui/Flex';
import { Heading } from './ui/Heading';
import { List } from './ui/List';
import { RichText } from './ui/RichText';
import { TextBox } from './ui/TextBox';

type BlockProps = {
  block: NotionBlock;
};

const getChildren = (block: NotionBlock) => {
  if (isListBlock(block)) {
    return <BlockItems blocks={block.children} />;
  } else if (block.has_children) {
    return <Blocks parentId={block.id} />;
  }
  return null;
};

export const Block = ({ block }: BlockProps) => {
  const children = getChildren(block);

  if (isColumnListBlock(block)) {
    return <Flex gap="300">{children}</Flex>;
  }

  if (isColumnBlock(block)) {
    const widthRatio = block.column.width_ratio || 1;
    const colWidth = widthRatio * 100;
    return <div style={{ flex: 1, flexBasis: `${colWidth}%` }}>{children}</div>;
  }

  if (isParagraphBlock(block)) {
    const text = block.paragraph.rich_text
      .map(textItem => textItem.plain_text)
      .join('');
    return (
      <TextBox as="p">
        {text}
        {children}
      </TextBox>
    );
  }

  if (isCalloutBlock(block)) {
    const text = block.callout.rich_text
      .map(textItem => textItem.plain_text)
      .join('');
    return (
      <TextBox as="aside">
        {text}
        {children}
      </TextBox>
    );
  }

  if (isQuoteBlock(block)) {
    const text = block.quote.rich_text
      .map(textItem => textItem.plain_text)
      .join('');
    return (
      <blockquote>
        {text}
        {children}
      </blockquote>
    );
  }

  if (isListBlock(block)) {
    const listType = block.type === 'bulleted_list' ? 'bulleted' : 'numbered';
    return (
      <List type={listType}>
        <BlockItems blocks={block.children} />
      </List>
    );
  }

  if (isBulletedListItemBlock(block)) {
    const text = block.bulleted_list_item.rich_text
      .map(textItem => textItem.plain_text)
      .join('');
    return (
      <li>
        {text}
        {children}
      </li>
    );
  }

  if (isHeading1Block(block)) {
    const richRichText = block.heading_1.rich_text;
    return (
      <Heading level={1}>
        <RichText text={richRichText[0]} />
      </Heading>
    );
  }

  if (isHeading2Block(block)) {
    const richRichText = block.heading_2.rich_text;
    return (
      <Heading level={2}>
        <RichText text={richRichText[0]} />
      </Heading>
    );
  }

  if (isHeading3Block(block)) {
    const richRichText = block.heading_3.rich_text;
    return (
      <Heading level={3}>
        <RichText text={richRichText[0]} />
      </Heading>
    );
  }

  if (isDatabaseBlock(block)) {
    return <Database databaseId={block.id} />;
  }

  if (isDividerBlock(block)) {
    return <Divider />;
  }

  return null;
};
