import { HttpResponse, http } from 'msw';
import type { NotionBlock } from '../../data/block';
import type { PageData } from '../../data/page';
import homepage from './data/homepage.json' with { type: 'json' };
import { makeBlocks } from './fixtures/blocks';

export const handlers = [
  http.get('/api/page', ({ request }) => {
    return HttpResponse.json(homepage);
  }),
  http.get('/api/blocks', () => {
    return HttpResponse.json(makeBlocks());
  }),
];

export const makeGetPageHandler = (data: PageData) =>
  http.get('/api/page', () => HttpResponse.json(data));

export const makeGetBlocksHandler = (blocks: NotionBlock[]) =>
  http.get('/api/blocks', () => HttpResponse.json({ blocks }));
