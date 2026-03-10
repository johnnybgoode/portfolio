import { screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { Resume } from '../../components/Resume';
import { makeChildDatabaseBlock } from '../mocks/fixtures/blocks';
import { makeProperty, makeRichText } from '../mocks/fixtures/properties';
import {
  makeGetBlocksHandler,
  makeGetDatabaseHandler,
  makeGetNestedBlocksHandler,
  makeGetPageHandler,
  makeGetRelatedPagesHandler,
} from '../mocks/handlers';
import { server } from '../mocks/server';
import { render } from '../utils/render';

describe('Resume', () => {
  it('renders page properties', async () => {
    server.use(
      makeGetPageHandler({
        title: makeProperty({
          type: 'title',
          // @ts-ignore TODO title is reserved, rename property in Notion
          value: { rich_text: [makeRichText('John E')] },
        }),
        email: makeProperty({
          type: 'email',
          value: { email: 'john@email.com' },
        }),
        phone: makeProperty({
          type: 'phone_number',
          value: { phone_number: '8675309' },
        }),
        linkedin: makeProperty({ type: 'url', value: { url: 'linkedin.com' } }),
        github: makeProperty({ type: 'url', value: { url: 'github.com' } }),
        website: makeProperty({ type: 'url', value: { url: 'foo.com' } }),
      }),
      makeGetBlocksHandler([]),
    );

    render(<Resume pageId="resume" />);

    await screen.findByText(/john e/i);
    await screen.findByText('mail-icon');
    await screen.findByText('john@email.com');
    await screen.findByText('phone-icon');
    await screen.findByText('8675309');
    await screen.findByText('linkedin-icon');
    await screen.findByText('linkedin.com');
    await screen.findByText('github-icon');
    await screen.findByText('github.com');
    await screen.findByText('link-icon');
    await screen.findByText('foo.com');
  });

  it('renders experience section', async () => {
    const [getPagesHandler, registerPageResponse] =
      makeGetRelatedPagesHandler();
    const [getBlocksHandler, registerBlocksResponse] =
      makeGetNestedBlocksHandler();

    registerPageResponse({
      pageId: 'resume',
      pageData: {
        title: makeProperty({
          type: 'title',
          // @ts-ignore TODO title is reserved, rename property in Notion
          value: { rich_text: [makeRichText('John E')] },
        }),
        email: makeProperty({
          type: 'email',
          value: { email: 'john@email.com' },
        }),
        phone: makeProperty({
          type: 'phone_number',
          value: { phone_number: '8675309' },
        }),
        linkedin: makeProperty({ type: 'url', value: { url: 'linkedin.com' } }),
        github: makeProperty({ type: 'url', value: { url: 'github.com' } }),
        website: makeProperty({ type: 'url', value: { url: 'foo.com' } }),
        experience: makeProperty({
          type: 'relation',
          label: 'Experience',
          value: { relation: [] },
        }),
      },
    });
    registerPageResponse({
      pageId: 'exp-1',
      pageData: {
        name: makeProperty({
          type: 'title',
          // @ts-ignore TODO title is reserved, rename property in Notion
          value: { rich_text: [makeRichText('Cool company')] },
        }),
        start: makeProperty({
          type: 'rich_text',
          value: { rich_text: [makeRichText('2015')] },
        }),
        end: makeProperty({
          type: 'rich_text',
          value: { rich_text: [makeRichText('2020')] },
        }),
        position: makeProperty({
          type: 'rich_text',
          value: { rich_text: [makeRichText('Button Pusher')] },
        }),
      },
    });

    registerBlocksResponse({
      parentId: 'resume',
      blocks: [makeChildDatabaseBlock('exp-db')],
    });
    registerBlocksResponse({ parentId: 'exp-1', blocks: [] });

    server.use(
      getPagesHandler,
      getBlocksHandler,
      makeGetDatabaseHandler([
        {
          id: 'exp-1',
          Start: { rich_text: [{ plain_text: '2015' }] },
          End: { rich_text: [{ plain_text: '2020' }] },
        },
      ]),
    );

    render(<Resume pageId="resume" />);

    await screen.findByRole('heading', { name: /experience/i });
    await screen.findByText(/button pusher/i);
  });
});
