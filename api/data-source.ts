import {
  Client,
  DataSourceObjectResponse,
  isFullDatabase,
  isFullPageOrDataSource,
} from '@notionhq/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_AUTH_TK,
});

const fetchDatabase = async (databaseId: string) => {
  const response = await notion.databases.retrieve({
    database_id: databaseId,
  });
  return response;
};

const fetchDataSource = async (dataSourceId: string) => {
  const response = await notion.dataSources.retrieve({
    data_source_id: dataSourceId,
  });
  return response;
};

const queryDataSource = async (dataSourceId: string) => {
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
  });
  return response;
};

const fetchAndQueryDataSource = async (dataSourceId: string) => {
  const [dataSourceResponse, dataSourceQueryResponse] = await Promise.all([
    fetchDataSource(dataSourceId),
    queryDataSource(dataSourceId),
  ]);
  const { id, icon, cover, title } =
    dataSourceResponse as DataSourceObjectResponse;
  const results = dataSourceQueryResponse.results.map(result => {
    const properties = isFullPageOrDataSource(result) ? result.properties : {};
    return {
      id: result.id,
      ...properties,
    };
  });
  return {
    id,
    icon,
    cover,
    title,
    results,
  };
};

export default async function GET(req: VercelRequest, res: VercelResponse) {
  if (!req.query.databaseId && !req.query.dataSourceId) {
    return res
      .status(400)
      .json({ error: 'A databaseId or dataSourceId param is required.' });
  }
  if (req.query.dataSourceId && typeof req.query.dataSourceId !== 'string') {
    return res.status(400).json({ error: 'dataSourceId must be a string.' });
  }
  if (req.query.databaseId && typeof req.query.databaseId !== 'string') {
    return res.status(400).json({ error: 'databaseId must be a string.' });
  }

  try {
    if (req.query.databaseId) {
      const databaseResponse = await fetchDatabase(req.query.databaseId);
      if (!isFullDatabase(databaseResponse) || !databaseResponse.data_sources) {
        return res
          .status(404)
          .json({ error: 'Data source not found for the given database.' });
      }
      const dataSourceResponse = await fetchAndQueryDataSource(
        databaseResponse.data_sources[0].id,
      );

      return res.status(200).json(dataSourceResponse);
    } else if (req.query.dataSourceId) {
      const dataSourceResponse = await fetchAndQueryDataSource(
        req.query.dataSourceId,
      );

      return res.status(200).json(dataSourceResponse);
    }
  } catch (__error) {
    return res.status(500).json({ error: 'Failed to fetch data source.' });
  }
}
