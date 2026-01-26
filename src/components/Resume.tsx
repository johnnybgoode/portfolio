import { useQuery } from '@tanstack/react-query';
import { getPage, type ResumePageData } from '../data/page';
import { Experience } from './Experience';
import { LoadingOrError } from './Loading';
import { Box } from './ui/Box';
import { Divider } from './ui/Divider';
import { Flex } from './ui/Flex';
import { Heading } from './ui/Heading';
import { IconLabel } from './ui/IconLabel';
import { List } from './ui/List';
import { RichText } from './ui/RichText';
import { TextBox } from './ui/TextBox';

type ResumeProps = {
  pageId: string;
};

export const Resume = ({ pageId }: ResumeProps) => {
  const {
    data: page,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pageData', pageId],
    queryFn: () => getPage<ResumePageData>(pageId),
  });

  if (isLoading || error || !page) {
    return <LoadingOrError error={error} isLoading={isLoading} />;
  }

  return (
    <div style={{ maxWidth: '1024px' }}>
      <Flex
        alignItems="center"
        gap="300"
        justifyContent="space-between"
        paddingY="300"
      >
        <Box width="70">
          {page.title && (
            <Heading level={1} style={{ minWidth: '230px' }} width="40">
              <RichText text={page.title.rich_text} />
            </Heading>
          )}
        </Box>

        <Box>
          <IconLabel iconName="mail" label={page.email?.email} />
          <IconLabel iconName="phone" label={page.phone?.phone_number} />
          <IconLabel iconName="linkedin" label={page.linkedin?.url} />
          <IconLabel iconName="github" label={page.github?.url} />
          <IconLabel iconName="link" label={page.website?.url} />
        </Box>
      </Flex>

      <Divider marginY="300" width="50" />

      <Box padding="300">
        <Heading level={3}>{page.professionalSummary?.label}</Heading>
        <Box as="aside" paddingX="400" paddingY="300">
          <TextBox as="aside" fontSize="200">
            <RichText text={page.professionalSummary?.rich_text} />
          </TextBox>
        </Box>
      </Box>

      <Divider marginY="400" width="50" />

      <Flex alignItems="stretch" paddingY="300">
        <Experience experience={page.experience} />

        <Divider direction="vertical" marginX="400" marginY="200" width="50" />

        <Box flexGrow={1} width="40">
          <Heading level={3}>{page.skills?.label}</Heading>
          <List items={page.skills?.multi_select.map(item => item.name)} />
        </Box>
      </Flex>
    </div>
  );
};
