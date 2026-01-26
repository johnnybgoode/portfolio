import { useQuery } from '@tanstack/react-query';
import { getPage, type ResumePageData } from '../data/page';
import { Experience } from './Experience';
import { LoadingOrError } from './Loading';
import { Box } from './ui/Box';
import { Divider } from './ui/Divider';
import { Flex } from './ui/Flex';
import { Heading } from './ui/Heading';
import { Icon } from './ui/Icon';
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
      <Flex alignItems="flex-start" gap="300">
        <Box width="70">
          {page.title && (
            <Heading level={1} width="40">
              <RichText text={page.title.rich_text} />
            </Heading>
          )}
        </Box>
        <Box display="flex" flexDirection="column" gap="200">
          <TextBox as="div" fontSize="100">
            <div>
              <Icon name="mail" paddingInlineEnd="100" width="100" />{' '}
              {page.email?.email}
            </div>
            <div>
              <Icon name="phone" paddingInlineEnd="100" />{' '}
              {page.phone?.phone_number}
            </div>
            <div>
              <Icon name="linkedin" paddingInlineEnd="100" />{' '}
              {page.linkedin?.url}
            </div>
            <div>
              <Icon name="github" paddingInlineEnd="100" /> {page.github?.url}
            </div>
            <div>
              <Icon name="link" paddingInlineEnd="100" /> {page.website?.url}
            </div>
          </TextBox>
        </Box>
      </Flex>
      <Divider borderWidth="50" marginY="400" />
      <Box>
        <Heading level={3}>{page.professionalSummary?.label}</Heading>
        <Box as="aside" paddingX="400" paddingY="300">
          <RichText text={page.professionalSummary?.rich_text} />
        </Box>
      </Box>
      <Divider borderWidth="50" marginY="400" />
      <Flex alignItems="stretch">
        <Box>
          <Heading level={3}>{page.experience?.label}</Heading>
          {page.experience?.relation?.map(relation => (
            <Experience key={relation.id} pageId={relation.id} />
          ))}
        </Box>
        <Divider
          borderWidth="50"
          direction="vertical"
          marginX="400"
          marginY="200"
        />
        <Box flexGrow={1} width="30">
          <Heading level={3}>{page.skills?.label}</Heading>
          <List items={page.skills?.multi_select.map(item => item.name)} />
        </Box>
      </Flex>
    </div>
  );
};
