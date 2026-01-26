import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { describe, it } from 'vitest';
import { Resume } from '../../components/Resume';
import { makeProperty, makeRichText } from '../mocks/fixtures/properties';
import {
  makeGetBlocksHandler,
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
    await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

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
    const [getPagesHandler, registerResponse] = makeGetRelatedPagesHandler();

    registerResponse({
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
          value: { relation: [{ id: 'exp-1' }] },
        }),
      },
    });
    registerResponse({
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

    server.use(getPagesHandler, makeGetBlocksHandler([]));

    render(<Resume pageId="resume" />);
    // await waitForElementToBeRemoved(() => screen.queryByText(/loading/i));

    // screen.logTestingPlaygroundURL();
    await screen.findByRole('heading', { name: /experience/i });
    // await screen.findByText(/button pusher/i)
  });
});
