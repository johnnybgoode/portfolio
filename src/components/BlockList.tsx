import { useQuery } from '@tanstack/react-query';
import { getBlockData, type NotionBlock } from '../data/block';
import { Block } from './Block';
import { LoadingOrError } from './Loading';

export const BlockItems = ({ blocks }: { blocks: NotionBlock[] }) => (
  <>
    {blocks.map(block => (
      <Block block={block} key={block.id} />
    ))}
  </>
);

type BlockChildrenProps = {
  parentId: string;
};
export const BlockChildren = ({ parentId }: BlockChildrenProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['blockData', parentId],
    queryFn: () => getBlockData(parentId),
  });
  if (isLoading || error || !data) {
    return <LoadingOrError error={error} isLoading={isLoading} />;
  }

  return <BlockItems blocks={data.blocks} />;
};
