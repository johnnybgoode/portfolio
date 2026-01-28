import { useSuspenseQuery } from '@tanstack/react-query';
import { getPage } from '../data/page';
import { pageWrapper } from '../styles/pages/Page.css';
import { Blocks } from './Blocks';
import { Heading } from './ui/Heading';
import { RichText } from './ui/RichText';

type PageProps = {
  displayTitle?: boolean;
  pageId: string;
};

export const Page = ({ pageId, displayTitle = true }: PageProps) => {
  const { data: page } = useSuspenseQuery({
    queryKey: ['pageData', pageId],
    queryFn: () => getPage(pageId),
  });

  return (
    <div className={pageWrapper}>
      {displayTitle && page.title?.type === 'title' && (
        <Heading level={1}>
          {page.title.title.map(textItem => (
            <RichText key={textItem.plain_text} text={textItem} />
          ))}
        </Heading>
      )}
      <Blocks parentId={pageId} />
    </div>
  );
};
