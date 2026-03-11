import type { NotionBlock } from '@portfolio/notion';
import { BlockRenderer } from './BlockRenderer';
import { BlockItems, Blocks } from './Blocks';
import { Database } from './Database';

type BlockProps = {
  block: NotionBlock;
};

export const Block = ({ block }: BlockProps) => (
  <BlockRenderer
    BlockItemsComponent={BlockItems}
    BlocksComponent={Blocks}
    block={block}
    DatabaseComponent={Database}
  />
);
