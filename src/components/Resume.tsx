import { useQuery } from '@tanstack/react-query';
import { getResumePage } from '../data/page';
import { LoadingOrError } from './Loading';
import { Box } from './ui/Box';
import { Flex } from './ui/Flex';
import { Heading } from './ui/Heading';
import { Icon } from './ui/Icon';
import { RichText } from './ui/RichText';

type ResumeProps = {
  pageId: string;
};

export const Resume = ({ pageId }: ResumeProps) => {
  const {
    data: page,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pageData', pageId],
    queryFn: () => getResumePage(pageId),
  });

  if (isLoading || error || !page) {
    return <LoadingOrError error={error} isLoading={isLoading} />;
  }

  return (
    <>
      <Flex alignItems="flex-start" gap="300">
        <Box width="70">
          {page.title && (
            <Heading level={1}>
              <RichText text={page.title.rich_text} />
            </Heading>
          )}
        </Box>
      </Flex>
      <hr />
    </>
  );
};
