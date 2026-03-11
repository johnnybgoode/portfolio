import { screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { BlocksClient } from '../../components/BlocksClient';
import { makeCalloutBlock, makeContentBlock } from '../mocks/fixtures/blocks';
import { makeGetBlocksHandler } from '../mocks/handlers';
import { server } from '../mocks/server';
import { render } from '../utils/render';

describe('Page', () => {
  it('renders page blocks', async () => {
    server.use(
      makeGetBlocksHandler([
        makeContentBlock('paragraph', 'cool content'),
        makeCalloutBlock('neat neat'),
      ]),
    );

    render(<BlocksClient parentId="cool-page" />);

    await screen.findByText(/cool content/i);
    await screen.findByText(/neat neat/i);
  });
});
