import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import { describe, it } from 'vitest';
import { Resume } from '../../components/Resume';
import { makeProperty, makeRichText } from '../mocks/fixtures/properties';
import { makeGetBlocksHandler, makeGetPageHandler } from '../mocks/handlers';
import { server } from '../mocks/server';
import { render } from '../utils/render';

describe('Resume', () => {
  it('renders page properties', async () => {
    server.use(
      makeGetPageHandler({
        // @ts-ignore TODO title is reserved, rename property in Notion
        title: makeProperty('title', { rich_text: [makeRichText('John E')] }),
        email: makeProperty('email', { email: 'john@email.com' }),
        phone: makeProperty('phone_number', { phone_number: '8675309' }),
        linkedin: makeProperty('url', { url: 'linkedin.com' }),
        github: makeProperty('url', { url: 'github.com' }),
        website: makeProperty('url', { url: 'foo.com' }),
        // skills
      }),
      makeGetBlocksHandler([]),
    );

    render(<Resume pageId="cool-page" />);
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
});
