import { useQuery } from '@tanstack/react-query';
import { getResumePage } from '../data/page';
import { LoadingOrError } from './Loading';
import { Masthead } from './Masthead';
import { Page } from './Page';
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
      <Masthead>
          {page.Title && (
            <Heading level={1}>
              <RichText text={page.Title.rich_text} />
            </Heading>
          )}
      </Masthead>
      <Page displayTitle={false} pageId={pageId} />
    </>
  );
};
