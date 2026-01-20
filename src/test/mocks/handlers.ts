import { HttpResponse, http } from 'msw';
import homepage from './data/homepage.json' with { type: 'json' };
import { makeBlocks } from './fixtures/blocks';

export const handlers = [
  http.get('/api/page', ({ request }) => {
    console.log(request.url);
    return HttpResponse.json(homepage);
  }),
  http.get('/api/blocks', () => {
    return HttpResponse.json(makeBlocks());
  }),
];
