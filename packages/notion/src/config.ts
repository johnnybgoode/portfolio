export type StaticPageKeys = keyof typeof STATIC_PAGE_IDS;
export const STATIC_PAGE_IDS = {
  home: process.env.PAGE_HOME,
  resume: process.env.PAGE_RESUME,
} as const;

export const resolvePageId = (id: string) => {
  if (id in STATIC_PAGE_IDS) {
    return STATIC_PAGE_IDS[id as StaticPageKeys];
  }
  return id;
};
