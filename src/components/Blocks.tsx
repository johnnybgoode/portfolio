import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getBlockData, type NotionBlock } from '../data/block';
import { Block } from './Block';
import { ErrorMessage } from './ui/ErrorMessage';
import { Loading } from './ui/Loading';

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
const BlockChildren = ({ parentId }: BlocksProps) => {
  const { data } = useSuspenseQuery({
    queryKey: ['blockData', parentId],
    queryFn: () => getBlockData(parentId),
  });

  return <BlockItems blocks={data.blocks} />;
};

export const Blocks = ({ parentId }: BlocksProps) => {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<Loading />}>
        <BlockChildren parentId={parentId} />
      </Suspense>{' '}
    </ErrorBoundary>
  );
};
