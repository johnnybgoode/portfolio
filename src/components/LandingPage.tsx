import { useQuery } from '@tanstack/react-query';
import { getBlockData } from '../data/block';
import { getPageData } from '../data/page';
import { isMultiSelectProperty, isRichTextProperty } from '../data/properties';
import { headerClass } from '../styles/components/LandingPage.css';
import { BlockItems } from './BlockList';
import { Heading } from './Heading';
import { LoadingOrError } from './Loading';
import { Text } from './Text';
import { TypeWriter } from './TypeWriter';

type LandingPageProps = {
  pageId: string;
};

export const LandingPage = ({ pageId }: LandingPageProps) => {
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
      <header className={headerClass}>
        <div>
          {page.Headline && isRichTextProperty(page.Headline) && (
            <Heading level={1}>
              <Text textItem={page.Headline.rich_text[0]} />
            </Heading>
          )}
          {page.Taglines && isMultiSelectProperty(page.Taglines) && (
            <TypeWriter
              textItems={page.Taglines.multi_select.map(item => item.name)}
              typingDelay={1400}
              typingSpeed={125}
            />
          )}
        </div>
      </header>
      {blockData && <BlockItems blocks={blockData.blocks} />}
    </>
  );
};
