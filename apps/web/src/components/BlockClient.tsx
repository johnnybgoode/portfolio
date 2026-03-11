'use client';

import type { NotionBlock } from '@portfolio/notion';
import { BlockRenderer } from './BlockRenderer';
import { BlockItems, BlocksClient } from './BlocksClient';
import { DatabaseClient } from './DatabaseClient';

type BlockProps = {
  block: NotionBlock;
};

export const Block = ({ block }: BlockProps) => (
  <BlockRenderer
    BlockItemsComponent={BlockItems}
    BlocksComponent={BlocksClient}
    block={block}
    DatabaseComponent={DatabaseClient}
  />
);
