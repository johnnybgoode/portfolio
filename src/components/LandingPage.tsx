import { useSuspenseQuery } from '@tanstack/react-query';
import { getLandingPage } from '../data/page';
import { headerClass, landingPageClass } from '../styles/pages/LandingPage.css';
import { Page } from './Page';
import { Heading } from './ui/Heading';
import { RichText } from './ui/RichText';
import { TypeWriter } from './ui/TypeWriter';

type LandingPageProps = {
  pageId: string;
};

export const LandingPage = ({ pageId }: LandingPageProps) => {
  const { data: page } = useSuspenseQuery({
    queryKey: ['pageData', pageId],
    queryFn: () => getLandingPage(pageId),
  });

  return (
    <div className={landingPageClass}>
      <header className={headerClass}>
        <div>
          {page.headline && (
            <Heading level="title">
              <RichText text={page.headline.rich_text} />
            </Heading>
          )}
          {page.taglines && (
            <TypeWriter
              textItems={page.taglines.multi_select.map(item => item.name)}
              typingDelay={1400}
              typingSpeed={125}
            />
          )}
        </div>
      </header>
      <Page displayTitle={false} pageId={pageId} />
    </div>
  );
};
