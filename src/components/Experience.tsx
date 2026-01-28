import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
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
      <Flex flexDirection="column" gap="100">
        <Flex
          alignItems="center"
          justifyContent="space-between"
          paddingInlineEnd="400"
        >
          <Heading level={4} marginY="200">
            <RichText text={page.name?.title} />
          </Heading>
          <Box>
            <RichText text={page.start?.rich_text} />
            &mdash;
            <RichText text={page.end?.rich_text} />
          </Box>
        </Flex>
        <Box>
          <TextBox fontWeight="500">
            <RichText text={page.position?.rich_text} />
          </TextBox>
        </Box>
        <Blocks parentId={pageId} />
      </Flex>
    </div>
  );
};

type ExperienceProps = {
  experience: ResumePageData['experience'];
};

export const Experience = ({ experience }: ExperienceProps) => {
  if (!experience || !experience.relation) {
    return;
  }

  return (
    <Box>
      <Heading level={3}>{experience.label}</Heading>
      <Flex alignItems="stretch">
        <Box paddingInlineEnd="300" paddingInlineStart="400" paddingY="200">
          {experience.relation.map(({ id }) => (
            <ErrorBoundary fallback={<ErrorMessage />} key={id}>
              <Suspense fallback={<Loading />}>
                <ExperienceItem pageId={id} />
              </Suspense>
            </ErrorBoundary>
          ))}
        </Box>
      </Flex>
    </Box>
  );
};
