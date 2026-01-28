import { HttpResponse, http } from 'msw';
import type { NotionBlock } from '../../data/block';
import type { PageData } from '../../data/page';
import blockData from './data/blocks.json' with { type: 'json' };
import pageData from './data/pages.json' with { type: 'json' };
import { makeBlocks } from './fixtures/blocks';

export const handlers = [
  http.get<{ id: string }>('/api/page/:id', ({ params }) => {
    const pageId = params.id as keyof typeof pageData;
    const responseData = pageData[pageId] ? pageData[pageId] : pageData['home'];
    return HttpResponse.json(responseData);
  }),
  http.get<{ id: string }>('/api/blocks/:id', ({ params }) => {
    const blockId = params.id as keyof typeof blockData;
    const responseData = blockData[blockId] ? blockData[blockId] : makeBlocks();
    return HttpResponse.json(responseData);
  }),
];

export const makeGetPageHandler = (data: PageData) =>
  http.get('/api/page/:id', () => HttpResponse.json(data));

export const makeGetBlocksHandler = (blocks: NotionBlock[]) =>
  http.get('/api/blocks/:id', () => HttpResponse.json({ blocks }));

export const makeGetNestedBlocksHandler = () => {
  const blocksResponses = {} as Record<string, NotionBlock[]>;

  const getBlocksHandler = http.get<{ id: string }>(
    '/api/blocks/:id',
    ({ params }) => {
      if (blocksResponses[params.id]) {
        return HttpResponse.json({ blocks: blocksResponses[params.id] });
      }
      return HttpResponse.error();
    },
  );
  const registerBlocks = ({
    parentId,
    blocks,
  }: {
    parentId: string;
    blocks: NotionBlock[];
  }) => {
    blocksResponses[parentId] = blocks;
  };
  return [getBlocksHandler, registerBlocks] as const;
};

export const makeGetRelatedPagesHandler = () => {
  const responses = {} as Record<string, PageData>;

  const getPagesHandler = http.get<{ id: string }>(
    '/api/page/:id',
    ({ params }) => {
      if (responses[params.id]) {
        return HttpResponse.json(responses[params.id]);
      }
      return HttpResponse.error();
    },
  );
  const registerResponse = ({
    pageId,
    pageData,
  }: {
    pageId: string;
    pageData: PageData;
  }) => {
    responses[pageId] = pageData;
  };

  return [getPagesHandler, registerResponse] as const;
};
