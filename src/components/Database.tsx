import type {
  PropertyItemObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getDatabase } from '../data/database';
import { ErrorMessage } from './ui/ErrorMessage';
import { Heading } from './ui/Heading';
import { Loading } from './ui/Loading';
import { RichText } from './ui/RichText';

type DatabaseProps = {
  databaseId: string;
};

const TableCell = ({ data }: { data: PropertyItemObjectResponse }) => {
  if (typeof data === 'string' || typeof data === 'number') {
    return <td>{data}</td>;
  }
  if (!('type' in data)) {
    return <td>Unsupported data</td>;
  }
  if (data.type === 'rich_text') {
    const richRichText =
      data.rich_text as unknown as Array<RichTextItemResponse>;
    return (
      <td>
        <RichText text={richRichText[0]} />
      </td>
    );
  }
  if (data.type === 'title') {
    const titleRichText = data.title as unknown as Array<RichTextItemResponse>;
    return (
      <td>
        <RichText text={titleRichText[0]} />
      </td>
    );
  }
  if (data.type === 'multi_select') {
    return <td>{data.multi_select.map(item => item.name).join(', ')}</td>;
  }
  return <td>{`[ ${data.type} ]`}</td>;
};

const DatabaseTable = ({ databaseId }: DatabaseProps) => {
  const { data: database } = useSuspenseQuery({
    queryKey: ['databaseData', databaseId],
    queryFn: () => getDatabase(databaseId),
  });

  const { data } = database;

  return (
    <div>
      {data.title && (
        <Heading level={2}>
          <RichText text={data.title[0]} />
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

export const Database = ({ databaseId }: DatabaseProps) => {
  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Suspense fallback={<Loading />}>
        <DatabaseTable databaseId={databaseId} />
      </Suspense>{' '}
    </ErrorBoundary>
  );
};
