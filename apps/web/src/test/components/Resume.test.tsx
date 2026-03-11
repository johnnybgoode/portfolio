import { screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { Experience } from '../../components/Experience';
import { makeChildDatabaseBlock } from '../mocks/fixtures/blocks';
import { makeProperty, makeRichText } from '../mocks/fixtures/properties';
import {
  makeGetDatabaseHandler,
  makeGetNestedBlocksHandler,
  makeGetRelatedPagesHandler,
} from '../mocks/handlers';
import { server } from '../mocks/server';
import { render } from '../utils/render';

describe('Resume', () => {
  it('renders experience section', async () => {
    const [getPagesHandler, registerPageResponse] =
      makeGetRelatedPagesHandler();
    const [getBlocksHandler, registerBlocksResponse] =
      makeGetNestedBlocksHandler();

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

    const experience = makeProperty({
      type: 'relation',
      label: 'Experience',
      value: { relation: [] },
    });

    render(<Experience experience={experience} pageId="resume" />);

    await screen.findByRole('heading', { name: /experience/i });
    await screen.findByText(/button pusher/i);
  });
});
