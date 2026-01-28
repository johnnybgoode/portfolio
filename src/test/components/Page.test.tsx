import { screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { Page } from '../../components/Page';
import { PageContainer } from '../../components/PageContainer';
import { makeCalloutBlock, makeContentBlock } from '../mocks/fixtures/blocks';
import { makeProperty, makeRichText } from '../mocks/fixtures/properties';
import { makeGetBlocksHandler, makeGetPageHandler } from '../mocks/handlers';
import { server } from '../mocks/server';
import { render } from '../utils/render';

describe('Page', () => {
  it('renders page properties', async () => {
    server.use(
      makeGetPageHandler({
        title: makeProperty({
          type: 'title',
          value: { title: [makeRichText('Catchy title')] },
        }),
      }),
      makeGetBlocksHandler([]),
    );

    render(<PageContainer PageComponent={Page} pageId="cool-page" />);

    await screen.findByText(/catchy title/i);
  });
  it('renders page blocks', async () => {
    server.use(
      makeGetPageHandler({
        title: makeProperty({
          type: 'title',
          value: { title: [makeRichText('Catchy title')] },
        }),
      }),
      makeGetBlocksHandler([
        makeContentBlock('paragraph', 'cool content'),
        makeCalloutBlock('neat neat'),
      ]),
    );

    render(<PageContainer PageComponent={Page} pageId="cool-page" />);

    await screen.findByText(/cool content/i);
    await screen.findByText(/neat neat/i);
  });
});
