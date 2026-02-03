import type { VercelResponse } from '@vercel/node';

export type StaticPageKeys = keyof typeof STATIC_PAGE_IDS;
export const STATIC_PAGE_IDS = {
  home: process.env.PAGE_HOME,
  resume: process.env.PAGE_RESUME,
} as const;

export const parseId = (url: string, res: VercelResponse) => {
  try {
    const id = url.split('?')[0].split('/').pop();
    if (id && id in STATIC_PAGE_IDS) {
      return STATIC_PAGE_IDS[id as StaticPageKeys];
    }
    return id;
  } catch (e: unknown) {
    console.error(e);
    res.status(400).json({ error: 'Failed to parse ID from URL' });
  }
};
