import { error } from 'node:console';
import {
  Client,
  DataSourceObjectResponse,
  isFullPageOrDataSource,
} from '@notionhq/client';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_AUTH_TK,
});

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

const parseDataSourceId = (url: string, res: VercelResponse) => {
  try {
    return url.split('?')[0].split('/').pop();
  } catch (__e: unknown) {
    res.status(400).json({ error: 'Failed to parse URL' });
  }
};

export default async function GET(req: VercelRequest, res: VercelResponse) {
  const dataSourceId = parseDataSourceId(req.url!, res);

  if (!dataSourceId || typeof dataSourceId !== 'string') {
    return res.status(400).json({ error: 'Data source ID is required.' });
  }

  try {
    const dataSourceResponse = await fetchAndQueryDataSource(dataSourceId);

    return res.status(200).json(dataSourceResponse);
  } catch (__error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch data source.' });
  }
}
