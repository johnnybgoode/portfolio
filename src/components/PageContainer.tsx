import { useQuery } from '@tanstack/react-query';
import type { ComponentType } from 'react';
import { getBlockData, type NotionBlock } from '../data/block';
import { getPage, type PageData } from '../data/page';
import { LoadingOrError } from './Loading';

type PageContainerProps<P extends PageData> = {
  fetchBlocks?: boolean;
  pageId: string;
  PageComponent: ComponentType<{ blocks?: NotionBlock[]; page: P }>;
};

export const PageContainer = <P extends PageData>({
  pageId,
  fetchBlocks,
  PageComponent,
}: PageContainerProps<P>) => {
  const shouldFetchBlocks =
    typeof fetchBlocks !== 'undefined' ? fetchBlocks : true;

  const {
    data: page,
    isLoading: pageLoading,
    error: pageError,
  } = useQuery({
    queryKey: ['page', pageId],
    queryFn: () => getPage<P>(pageId),
  });

  const {
    data: blocks,
    isLoading: blockLoading,
    error: blockError,
  } = useQuery({
    queryKey: ['blocks', pageId],
    queryFn: () => {
      if (shouldFetchBlocks) {
        return getBlockData(pageId);
      }
      return Promise.resolve({ blocks: [] });
    },
  });

  const isLoadingOrerror =
    pageLoading || blockLoading || pageError || blockError;

  if (isLoadingOrerror || !page) {
    return <LoadingOrError error={pageError} isLoading={pageLoading} />;
  }

  return <PageComponent blocks={blocks?.blocks} page={page} />;
};
