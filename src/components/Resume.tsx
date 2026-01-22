import { useQuery } from '@tanstack/react-query';
import { getResumePage } from '../data/page';
import { Heading } from './Heading';
import { LoadingOrError } from './Loading';
import { Masthead } from './Masthead';
import { Page } from './Page';
import { Text } from './Text';

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
      <Masthead>
        {page.Title && (
          <Heading level={1}>
            <Text textItem={page.Title.rich_text[0]} />
          </Heading>
        )}
      </Masthead>
      <Page displayTitle={false} pageId={pageId} />
    </>
  );
};
