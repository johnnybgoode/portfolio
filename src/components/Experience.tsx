import { useQuery } from '@tanstack/react-query';
import { getBlockData } from '../data/block';
import {
  type ExperiencePageData,
  getPage,
  type ResumePageData,
} from '../data/page';
import { ExperienceClass } from '../styles/components/Experience.css';
import { BlockItems } from './BlockList';
import { LoadingOrError } from './Loading';
import { Box } from './ui/Box';
import { Flex } from './ui/Flex';
import { Heading } from './ui/Heading';
import { RichText } from './ui/RichText';
import { TextBox } from './ui/TextBox';

type ExperienceaItemProps = {
  pageId: string;
};

const ExperienceItem = ({ pageId }: ExperienceaItemProps) => {
  const {
    data: page,
    isLoading: pageLoading,
    error: pageError,
  } = useQuery({
    queryKey: ['pageData', pageId],
    queryFn: () => getPage<ExperiencePageData>(pageId),
  });

  const {
    data: blockData,
    isLoading: blockLoading,
    error: blockError,
  } = useQuery({
    queryKey: ['blockData', pageId],
    queryFn: () => getBlockData(pageId),
  });

  const isLoadingOrerror =
    pageLoading || blockLoading || pageError || blockError;

  if (isLoadingOrerror || !page) {
    return <LoadingOrError error={pageError} isLoading={pageLoading} />;
  }

  return (
    <Flex className={ExperienceClass} flexDirection="column" gap="100">
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
      <Box>{blockData && <BlockItems blocks={blockData.blocks} />}</Box>
    </Flex>
  );
};

type ExperienceProps = {
  experience: ResumePageData['experience'];
};

export const Experience = ({ experience }: ExperienceProps) => {
  if (!experience || !experience.relation) {
    return;
  }
  const { label, relation } = experience;

  return (
    <Box>
      <Heading level={3}>{label}</Heading>
      <Flex alignItems="stretch">
        <Box paddingInlineEnd="300" paddingInlineStart="400" paddingY="200">
          {relation?.map(relationItem => (
            <ExperienceItem key={relationItem.id} pageId={relationItem.id} />
          ))}
        </Box>
      </Flex>
    </Box>
  );
};
