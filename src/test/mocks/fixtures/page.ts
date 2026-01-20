const makeRichText = (text: string) => ({
  type: 'text',
  text: {
    content: text,
    link: null,
  },
  annotations: {
    bold: false,
    italic: false,
    strikethrough: false,
    underline: false,
    code: false,
    color: 'default',
  },
  plain_text: text,
  href: null,
});

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
