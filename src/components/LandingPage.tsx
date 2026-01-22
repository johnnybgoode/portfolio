import { useQuery } from '@tanstack/react-query';
import { getLandingPage } from '../data/page';
import { headerClass } from '../styles/components/LandingPage.css';
import { Heading } from './Heading';
import { LoadingOrError } from './Loading';
import { Page } from './Page';
import { Text } from './Text';
import { TypeWriter } from './TypeWriter';

type LandingPageProps = {
  pageId: string;
};

export const LandingPage = ({ pageId }: LandingPageProps) => {
  const {
    data: page,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pageData', pageId],
    queryFn: () => getLandingPage(pageId),
  });

  if (isLoading || error || !page) {
    return <LoadingOrError error={error} isLoading={isLoading} />;
  }

  return (
    <>
      <header className={headerClass}>
        <div>
          {page.Headline && (
            <Heading level={1}>
              <Text textItem={page.Headline.rich_text[0]} />
            </Heading>
          )}
          {page.Taglines && (
            <TypeWriter
              textItems={page.Taglines.multi_select.map(item => item.name)}
              typingDelay={1400}
              typingSpeed={125}
            />
          )}
        </div>
      </header>
      <Page displayTitle={false} pageId={pageId} />
    </>
  );
};
