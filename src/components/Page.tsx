import { useQuery } from '@tanstack/react-query';
import { getBlockData } from '../data/block';
import { getPage } from '../data/page';
import { pageWrapper } from '../styles/pages/Page.css';
import { BlockItems } from './BlockList';
import { LoadingOrError } from './Loading';
import { Heading } from './ui/Heading';
import { RichText } from './ui/RichText';

type PageProps = {
  displayTitle?: boolean;
  pageId: string;
};

export const Page = ({ pageId, displayTitle = true }: PageProps) => {
  const {
    data: page,
    isLoading: pageLoading,
    error: pageError,
  } = useQuery({
    queryKey: ['pageData', pageId],
    queryFn: () => getPage(pageId),
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
    <div className={pageWrapper}>
      {displayTitle && page.title?.type === 'title' && (
        <Heading level={1}>
          {page.title.title.map(textItem => (
            <RichText key={textItem.plain_text} text={textItem} />
          ))}
        </Heading>
      )}
      {blockData && <BlockItems blocks={blockData.blocks} />}
    </div>
  );
};
