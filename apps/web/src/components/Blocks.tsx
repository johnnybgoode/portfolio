import type { NotionBlock } from '@portfolio/notion';
import { fetchBlocks } from '@portfolio/notion';
import { Block } from './Block';

export const BlockItems = ({ blocks }: { blocks: NotionBlock[] }) => {
  if (!blocks) {
    return null;
  }
  return (
    <>
      {blocks.map(block => (
        <Block block={block} key={block.id} />
      ))}
    </>
  );
};

type BlocksProps = {
  parentId: string;
};

export const Blocks = async ({ parentId }: BlocksProps) => {
  const { blocks } = await fetchBlocks(parentId);
  return <BlockItems blocks={blocks} />;
};
