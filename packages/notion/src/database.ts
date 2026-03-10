import { isFullDatabase } from '@notionhq/client';
import { notion } from './client.ts';
import { resolvePageId } from './config.ts';
import { fetchAndQueryDataSource } from './data-source.ts';
import type { DatabaseResponse } from './types/database.ts';

export const fetchDatabase = async (
  databaseId: string,
): Promise<DatabaseResponse> => {
  const resolvedId = resolvePageId(databaseId);
  if (!resolvedId) {
    throw new Error('Database ID is required.');
  }

  const databaseResponse = await notion.databases.retrieve({
    database_id: resolvedId,
  });

  if (
    !isFullDatabase(databaseResponse) ||
    !databaseResponse.data_sources ||
    !databaseResponse.data_sources.length
  ) {
    throw new Error('Data source not found for the given database.');
  }

  const dataSourceId = databaseResponse.data_sources[0].id;
  const dataSourceResponse = await fetchAndQueryDataSource(dataSourceId);
  const name = databaseResponse.data_sources[0].name
    .toLowerCase()
    .replace(/[^a-z]/g, ' ')
    .trim()
    .replace(/ +/, '-');

  return {
    name,
    data: dataSourceResponse,
  };
};
