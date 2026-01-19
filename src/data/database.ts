type GetDatabaseParameters = {
  databaseId?: string;
  dataSourceId?: string;
};
export const getDatabase = async ({
  databaseId,
  dataSourceId,
}: GetDatabaseParameters) => {
  if (!databaseId && !dataSourceId) {
    throw new Error('databaseId or dataSourceId is required');
  }
  const query = dataSourceId
    ? `dataSourceId=${dataSourceId}`
    : `databaseId=${databaseId}`;

  const response = await fetch(`/api/data-source?${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch database data');
  }

  const data = await response.json();
  return data;
};
