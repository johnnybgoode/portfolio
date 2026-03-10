import type { DatabaseResponse } from '@portfolio/notion';

export const getDatabase = async <T extends DatabaseResponse>(
  databaseId: string,
) => {
  if (!databaseId) {
    throw new Error('databaseId or dataSourceId is required');
  }

  const response = await fetch(`/api/database/${databaseId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch database.');
  }

  const data: T = await response.json();
  return data;
};
