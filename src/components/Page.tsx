import { useQuery } from '@tanstack/react-query';
import { getPageData } from '../data/page';
import { BlockChildren } from './BlockList';
import { Heading } from './Heading';
import { LoadingOrError } from './Loading';
import { Text } from './Text';

type PageProps = {
  pageId: string;
};

export const Page = ({ pageId }: PageProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['pageData', pageId],
    queryFn: () => getPageData(pageId),
  });

  if (isLoading || error || !data) {
    return <LoadingOrError error={error} isLoading={isLoading} />;
  }

  const { page } = data;
  return (
    <>
      {page.title.type === 'title' && (
        <Heading level={1}>
          {page.title.title.map(textItem => (
            <Text key={textItem.plain_text} textItem={textItem} />
          ))}
        </Heading>
      )}
      <BlockChildren parentId={pageId} />
    </>
  );
};
