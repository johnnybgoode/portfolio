import type { PageObjectResponse } from '@notionhq/client';

export const transformPageProperties = (
  properties: PageObjectResponse['properties'],
) => {
  return Object.fromEntries(
    Object.entries(properties).map(([label, value]) => {
      const fieldKey = label
        .toLowerCase()
        .replace(/[^a-z0-9]/, ' ')
        .replace(/\s+/, '_')
        .split('_')
        .map((w, i) =>
          i > 0 ? `${w.charAt(0).toUpperCase()}${w.substring(1)}` : w,
        )
        .join('');

      return [
        fieldKey,
        {
          label,
          ...value,
        },
      ];
    }),
  );
};
