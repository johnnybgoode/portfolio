import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { getBlockData } from '#data/block.ts';
import { getDatabase } from '#data/database.ts';
import {
  type ExperiencePageData,
  getPage,
  type ResumePageData,
} from '../data/page';
import styles from '../styles/components/Experience.css';
import { Blocks } from './Blocks';
import { Box } from './ui/Box';
import { Divider } from './ui/Divider';
import { ErrorMessage } from './ui/ErrorMessage';
import { Flex } from './ui/Flex';
import { Heading } from './ui/Heading';
import { Loading } from './ui/Loading';
import { RichText } from './ui/RichText';
import { TextBox } from './ui/TextBox';

const TimelineSegment = () => {
  return (
    <div className={styles.timelineSegment}>
      <svg
        className={styles.timelineDot}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="50" cy="50" r="50"></circle>
      </svg>
      <Divider direction="vertical" width="50" />
    </div>
  );
};

const ExperienceItem = ({ pageId }: { pageId: string }) => {
  const { data: page } = useSuspenseQuery({
    queryKey: ['page', pageId],
    queryFn: () => getPage<ExperiencePageData>(pageId),
  });

  return (
    <div className={styles.experienceItem}>
      <TimelineSegment />
      <Flex
        flexDirection="column"
        gap="100"
        paddingInlineEnd={['300', '400', '0']}
      >
        <Flex alignItems="center" justifyContent="space-between">
          <Heading level={4} marginY="200">
            <RichText text={page.name?.title} />
          </Heading>
          <TextBox fontWeight="500">
            <RichText text={page.location?.rich_text} />
          </TextBox>
        </Flex>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          paddingBlockEnd="200"
        >
          <TextBox fontWeight="500">
            <RichText text={page.position?.rich_text} />
          </TextBox>
          <Box>
            <RichText text={page.start?.rich_text} />
            &nbsp;&mdash;&nbsp;
            <RichText text={page.end?.rich_text} />
          </Box>
        </Flex>
        <Blocks parentId={pageId} />
      </Flex>
    </div>
  );
};

type ExperienceDatabaseResult = {
  [k in Capitalize<keyof ExperiencePageData>]: ExperiencePageData[Lowercase<k>];
} & { id: string };

const ExperienceRows = ({ pageId }: { pageId: string }) => {
  const { data } = useSuspenseQuery({
    queryKey: ['experienceDatabase', pageId],
    queryFn: async () => {
      const { blocks } = await getBlockData(pageId);
      const databaseBlock = blocks.find(b => b.type === 'child_database');
      if (!databaseBlock) {
        throw new Error(`No child database found for page ${pageId}`);
      }
      const database = await getDatabase(databaseBlock.id);
      if (!database.data?.results) {
        throw new Error('No database results');
      }
      return (database.data.results as unknown as ExperienceDatabaseResult[])
        .map(r => ({
          start: Number(r.Start?.rich_text[0].plain_text),
          end: Number(r.End?.rich_text[0].plain_text),
          id: r.id,
        }))
        .sort((a, b) => b.start - a.start);
    },
  });

  return (
    <>
      {data.map(({ id }) => (
        <ErrorBoundary fallback={<ErrorMessage />} key={id}>
          <Suspense fallback={<Loading />}>
            <ExperienceItem pageId={id} />
          </Suspense>
        </ErrorBoundary>
      ))}
    </>
  );
};

type ExperienceProps = {
  pageId: string;
  experience: ResumePageData['experience'];
};

export const Experience = ({ pageId, experience }: ExperienceProps) => {
  if (!pageId || !experience || !experience.label) {
    return;
  }

  return (
    <Box>
      <Heading level={3}>{experience.label}</Heading>
      <Flex alignItems="stretch">
        <Box
          paddingInlineEnd={['300', '300', '250']}
          paddingInlineStart={['300', '400', '300']}
          paddingY="200"
        >
          <ErrorBoundary fallback={<ErrorMessage />}>
            <Suspense fallback={<Loading />}>
              <ExperienceRows pageId={pageId} />
            </Suspense>
          </ErrorBoundary>
        </Box>
      </Flex>
    </Box>
  );
};
