import type { RichTextItemResponse } from '@notionhq/client';

export type DatabaseResponse = {
  name: string;
  data: {
    id: string;
    title: RichTextItemResponse[];
    results: Array<{ id: string } & Record<string, unknown>>;
  };
};
