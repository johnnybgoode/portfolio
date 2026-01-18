import type { NotionBlock } from '../data/block';
import {
  isBulletedListItemBlock,
  isCalloutBlock,
  isColumnBlock,
  isColumnListBlock,
  isDividerBlock,
  isHeading1Block,
  isHeading2Block,
  isHeading3Block,
  isListBlock,
  isParagraphBlock,
  isQuoteBlock,
} from '../data/block';
import { BlockChildren, BlockItems } from './BlockList';
import { Heading } from './Heading';
import { Text } from './Text';

type BlockProps = {
  block: NotionBlock;
};

const getChildren = (block: NotionBlock) => {
  if (isListBlock(block)) {
    return <BlockItems blocks={block.children} />;
  } else if (block.has_children) {
    return <BlockChildren parentId={block.id} />;
  }
  return null;
};

export const Block = ({ block }: BlockProps) => {
  const children = getChildren(block);

  if (isColumnListBlock(block)) {
    return <div style={{ display: 'flex', gap: '16px' }}>{children}</div>;
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
      <p>
        {text}
        {children}
      </p>
    );
  }

  if (isCalloutBlock(block)) {
    const text = block.callout.rich_text
      .map(textItem => textItem.plain_text)
      .join('');
    return (
      <aside>
        {text}
        {children}
      </aside>
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
    const ListWrapper = block.type === 'bulleted_list' ? 'ul' : 'ol';
    return (
      <ListWrapper>
        <BlockItems blocks={block.children} />
      </ListWrapper>
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
    const richText = block.heading_1.rich_text;
    return (
      <Heading level={1}>
        <Text textItem={richText[0]} />
      </Heading>
    );
  }

  if (isHeading2Block(block)) {
    const richText = block.heading_2.rich_text;
    return (
      <Heading level={2}>
        <Text textItem={richText[0]} />
      </Heading>
    );
  }

  if (isHeading3Block(block)) {
    const richText = block.heading_3.rich_text;
    return (
      <Heading level={3}>
        <Text textItem={richText[0]} />
      </Heading>
    );
  }

  if (isDividerBlock(block)) {
    return <hr />;
  }

  return null;
};
