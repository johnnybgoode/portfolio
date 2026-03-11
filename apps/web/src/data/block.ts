import type { NotionBlock } from '@portfolio/notion';

export const getBlockData = async (
  blockId: string,
): Promise<{ blocks: NotionBlock[] }> => {
  const response = await fetch(`/api/blocks/${blockId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch block data');
  }
  const data = await response.json();
  return data;
};
