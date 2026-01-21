export const getDatabase = async (databaseId: string) => {
  if (!databaseId) {
    throw new Error('databaseId or dataSourceId is required');
  }

  const response = await fetch(`/api/database/${databaseId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch database.');
  }

  return response.json();
};
