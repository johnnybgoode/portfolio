import {
  type DataSourceObjectResponse,
  isFullPageOrDataSource,
} from '@notionhq/client';
import { notion } from './client.ts';

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

export const fetchAndQueryDataSource = async (dataSourceId: string) => {
  const [dataSourceResponse, dataSourceQueryResponse] = await Promise.all([
    fetchDataSource(dataSourceId),
    queryDataSource(dataSourceId),
  ]);
  const { id, title } = dataSourceResponse as DataSourceObjectResponse;
  const results = dataSourceQueryResponse.results.map(result => {
    const properties = isFullPageOrDataSource(result) ? result.properties : {};
    return {
      id: result.id,
      ...properties,
    };
  });
  return {
    id,
    title,
    results,
  };
};
