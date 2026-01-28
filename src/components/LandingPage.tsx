import type { NotionBlock } from '../data/block';
import { type LandingPageData } from '../data/page';
import { headerClass, landingPageClass } from '../styles/pages/LandingPage.css';
import { Heading } from './ui/Heading';
import { RichText } from './ui/RichText';
import { TypeWriter } from './ui/TypeWriter';

type LandingPageProps = {
  blocks?: NotionBlock[];
  page: LandingPageData;
};

export const LandingPage = ({ page }: LandingPageProps) => {
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
    </div>
  );
};
