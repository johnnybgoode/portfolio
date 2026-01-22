import type {
  PropertyItemObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client';
import { useQuery } from '@tanstack/react-query';
import { getDatabase } from '../data/database';
import { Heading } from './Heading';
import { LoadingOrError } from './Loading';
import { Text } from './Text';

const TableCell = ({ data }: { data: PropertyItemObjectResponse }) => {
  if (typeof data === 'string' || typeof data === 'number') {
    return <td>{data}</td>;
  }
  if (!('type' in data)) {
    return <td>Unsupported data</td>;
  }
  if (data.type === 'rich_text') {
    const richText = data.rich_text as unknown as Array<RichTextItemResponse>;
    return (
      <td>
        <Text textItem={richText[0]} />
      </td>
    );
  }
  if (data.type === 'title') {
    const titleText = data.title as unknown as Array<RichTextItemResponse>;
    return (
      <td>
        <Text textItem={titleText[0]} />
      </td>
    );
  }
  if (data.type === 'multi_select') {
    return <td>{data.multi_select.map(item => item.name).join(', ')}</td>;
  }
  return <td>{`[ ${data.type} ]`}</td>;
};

export const Database = ({ databaseId }: { databaseId: string }) => {
  const {
    data: database,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['databaseData', databaseId],
    queryFn: () => getDatabase(databaseId),
  });

  if (isLoading || error || !database) {
    return (
      <LoadingOrError dataType="database" error={error} isLoading={isLoading} />
    );
  }
  const { data } = database;

  return (
    <div>
      {data.title && (
        <Heading level={2}>
          <Text textItem={data.title[0]} />
        </Heading>
      )}
      {data.results.length > 0 && (
        <table>
          <thead>
            <tr>
              {Object.keys(data.results[0]).map(
                key => key !== 'id' && <th key={key}>{key}</th>,
              )}
            </tr>
          </thead>
          <tbody>
            {data.results.map(row => (
              <tr key={row.id}>
                {Object.entries(row).map(
                  ([key, property]) =>
                    key !== 'id' && <TableCell data={property} key={key} />,
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
