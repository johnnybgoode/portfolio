import { makeRichText } from './properties';

const makeTitleProperty = (text: string) => ({
  id: 'title',
  type: 'title',
  title: [makeRichText(text)],
});

export const makePage = (pageId: string) => ({
  page: {
    title: makeTitleProperty(`Mock Page ${pageId}`),
  },
});
