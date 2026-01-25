import { useQuery } from '@tanstack/react-query';
import { getBlockData } from '../data/block';
import { type ExperiencePageData, getPage } from '../data/page';
import { BlockItems } from './BlockList';
import { LoadingOrError } from './Loading';
import { Box } from './ui/Box';
import { Flex } from './ui/Flex';
import { Heading } from './ui/Heading';
import { RichText } from './ui/RichText';

type PageProps = {
  pageId: string;
};

export const Experience = ({ pageId }: PageProps) => {
  const {
    data: page,
    isLoading: pageLoading,
    error: pageError,
  } = useQuery({
    queryKey: ['pageData', pageId],
    queryFn: () => getPage<ExperiencePageData>(pageId),
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

  if (isLoadingOrerror || !page) {
    return <LoadingOrError error={pageError} isLoading={pageLoading} />;
  }

  return (
    <>
      <Box>
        <Heading level={4}>
          <RichText text={page.name?.title} />
        </Heading>
      </Box>
      <Flex justifyContent="space-between">
        <Box>
          <RichText text={page.position?.rich_text} />
        </Box>{' '}
        <Box>
          <RichText text={page.start?.rich_text} />
          &mdash;
          <RichText text={page.end?.rich_text} />
        </Box>
      </Flex>
      {blockData && <BlockItems blocks={blockData.blocks} />}
    </>
  );
};
