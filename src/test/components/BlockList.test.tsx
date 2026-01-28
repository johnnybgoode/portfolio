import { screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { Blocks } from '../../components/Blocks';
import { makeContentBlock, makeListBlock } from '../mocks/fixtures/blocks';
import { makeGetNestedBlocksHandler } from '../mocks/handlers';
import { server } from '../mocks/server';
import { render } from '../utils/render';

describe('BlockList', () => {
  it('renders nested list block', async () => {
    const [getBlocksHandler, registerBlocks] = makeGetNestedBlocksHandler();
    server.use(getBlocksHandler);
    registerBlocks({
      parentId: 'page',
      blocks: [
        makeListBlock([
          makeContentBlock('bulleted_list_item', 'good point', {
            has_children: true,
            id: 'level-1',
          }),
        ]),
      ],
    });
    registerBlocks({
      parentId: 'level-1',
      blocks: [
        makeListBlock([makeContentBlock('bulleted_list_item', 'great point')]),
      ],
    });

    render(<Blocks parentId="page" />);

    await screen.findByText(/good point/i);
    await screen.findByText(/great point/i);
  });
});
