import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Block } from '../../components/Block';
import {
  makeCalloutBlock,
  makeContentBlock,
  makeHeadingBlock,
  makeListBlock,
} from '../mocks/fixtures/blocks';
import { makeGetBlocksHandler } from '../mocks/handlers';
import { server } from '../mocks/server';
import { render } from '../utils/render';

describe('Block', () => {
  it('renders column blocks', async () => {
    server.use(
      makeGetBlocksHandler([makeContentBlock('paragraph', 'Good content')]),
    );
    const type = 'column' as const;
    const columnBlock = {
      type,
      has_children: true,
      id: 'foo',
      parent: {
        type: 'block_id',
        block_id: 'parent-foo',
      } as const,
      column: {
        width_ratio: 1,
      },
    };
    render(<Block block={columnBlock} />);
    await screen.findByText(/good content/i);
  });

  it('renders heading_1 blocks', async () => {
    const block = makeHeadingBlock('heading_1', 'Cool heading');
    render(<Block block={block} />);

    await screen.findByRole('heading', { level: 1 });
    await screen.findByText(/cool heading/i);
  });

  it('renders heading_2 blocks', async () => {
    const block = makeHeadingBlock('heading_2', 'Cool heading');
    render(<Block block={block} />);

    await screen.findByRole('heading', { level: 2 });
    await screen.findByText(/cool heading/i);
  });

  it('renders heading_3 blocks', async () => {
    const block = makeHeadingBlock('heading_3', 'Cool heading');
    render(<Block block={block} />);

    await screen.findByRole('heading', { level: 3 });
    await screen.findByText(/cool heading/i);
  });

  it('renders bulleted_list_item blocks', async () => {
    const block = makeContentBlock('bulleted_list_item', 'Good point');
    render(<Block block={block} />);
    await screen.findByRole('listitem');
    await screen.findByText(/good point/i);
  });

  it('renders callout blocks', async () => {
    const block = makeCalloutBlock('Great content');
    render(<Block block={block} />);
    await screen.findByRole('complementary');
    await screen.findByText(/great content/i);
  });

  it('renders paragraph blocks', async () => {
    const block = makeContentBlock('paragraph', 'Great content');
    render(<Block block={block} />);
    await screen.findByRole('paragraph');
    await screen.findByText(/great content/i);
  });

  it('renders quote blocks', async () => {
    const block = makeContentBlock('quote', 'Great content');
    render(<Block block={block} />);
    await screen.findByRole('blockquote');
    await screen.findByText(/great content/i);
  });

  it('renders list block', async () => {
    const block = makeListBlock([
      makeContentBlock('bulleted_list_item', 'Good point'),
      makeContentBlock('bulleted_list_item', 'Good point'),
    ]);
    render(<Block block={block} />);
    await screen.findByRole('list');
    const items = await screen.findAllByText(/good point/i);
    expect(items.length).toBe(2);
  });
});
