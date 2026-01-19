import { useQuery } from '@tanstack/react-query';
import { getBlockData } from '../data/block';
import { getPageData } from '../data/page';
import { BlockItems } from './BlockList';
import { Heading } from './Heading';
import { LoadingOrError } from './Loading';
import { Text } from './Text';

type PageProps = {
  displayTitle?: boolean;
  pageId: string;
};

export const Page = ({ pageId, displayTitle = true }: PageProps) => {
  const {
    data: pageData,
    isLoading: pageLoading,
    error: pageError,
  } = useQuery({
    queryKey: ['pageData', pageId],
    queryFn: () => getPageData(pageId),
  });

  const {
    data: blockData,
    isLoading: blockLoading,
    error: blockError,
  } = useQuery({
    queryKey: ['blockData', pageId],
    queryFn: () => getBlockData(pageId),
  });

  const isLoadingOrerror =
    pageLoading || blockLoading || pageError || blockError;

  if (isLoadingOrerror || !pageData) {
    return <LoadingOrError error={pageError} isLoading={pageLoading} />;
  }

  const { page } = pageData;
  return (
    <>
      {displayTitle && page.title.type === 'title' && (
        <Heading level={1}>
          {page.title.title.map(textItem => (
            <Text key={textItem.plain_text} textItem={textItem} />
          ))}
        </Heading>
      )}
      {blockData && <BlockItems blocks={blockData.blocks} />}
    </>
  );
};
