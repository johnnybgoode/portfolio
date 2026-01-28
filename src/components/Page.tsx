import { type NotionBlock } from '../data/block';
import { type PageData } from '../data/page';
import { pageWrapper } from '../styles/pages/Page.css';
import { BlockItems } from './BlockList';
import { Heading } from './ui/Heading';
import { RichText } from './ui/RichText';

type PageProps = {
  blocks?: NotionBlock[];
  page: PageData;
};

export const Page = ({ blocks, page }: PageProps) => {
  return (
    <div className={pageWrapper}>
      {page.title?.type === 'title' && (
        <Heading level={1}>
          {page.title.title.map(textItem => (
            <RichText key={textItem.plain_text} text={textItem} />
          ))}
        </Heading>
      )}
      {blocks && <BlockItems blocks={blocks} />}
    </div>
  );
};
