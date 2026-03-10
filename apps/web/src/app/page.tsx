export const dynamic = 'force-dynamic';

import { fetchBlocks, fetchLandingPage } from '@portfolio/notion';
import { BlockItems } from '../components/Blocks';
import { Heading } from '../components/ui/Heading';
import { RichText } from '../components/ui/RichText';
import { TypeWriter } from '../components/ui/TypeWriter';
import { headerClass, landingPageClass } from '../styles/pages/LandingPage.css';
import { pageWrapper } from '../styles/pages/Page.css';

export default async function HomePage() {
  const [page, { blocks }] = await Promise.all([
    fetchLandingPage('home'),
    fetchBlocks('home'),
  ]);

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
      <div className={pageWrapper}>
        <BlockItems blocks={blocks} />
      </div>
    </div>
  );
}
