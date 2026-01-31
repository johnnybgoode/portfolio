import { useSuspenseQuery } from '@tanstack/react-query';
import { getPage, type ResumePageData } from '../data/page';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { resumeWrapper } from '../styles/pages/Resume.css';
import { Experience } from './Experience';
import { Box } from './ui/Box';
import { Divider } from './ui/Divider';
import { Flex } from './ui/Flex';
import { Heading } from './ui/Heading';
import { IconLink } from './ui/IconLink';
import { List } from './ui/List';
import { RichText } from './ui/RichText';
import { TextBox } from './ui/TextBox';

type ResumeProps = {
  pageId: string;
};

export const Resume = ({ pageId }: ResumeProps) => {
  const { data: page } = useSuspenseQuery({
    queryKey: ['pageData', pageId],
    queryFn: () => getPage<ResumePageData>(pageId),
  });
  const breakpoint = useBreakpoint();

  return (
    <div className={resumeWrapper}>
      <Flex alignItems="stretch" justifyContent="space-between" paddingY="300">
        <Box flexGrow={1} width={['40', '70']}>
          {page.title && (
            <Heading level={1} style={{ minWidth: '230px' }} width={'30'}>
              <RichText text={page.title.rich_text} />
            </Heading>
          )}
        </Box>

        <Divider direction="vertical" marginX="400" marginY="400" width="50" />

        <Box alignSelf="center" style={{ minWidth: '210px' }}>
          <IconLink
            href={page.email?.email}
            iconName="mail"
            protocol="mailto:"
          />
          <IconLink
            href={page.phone?.phone_number}
            iconName="phone"
            protocol="tel:"
          />
          <IconLink href={page.linkedin?.url} iconName="linkedin" />
          <IconLink href={page.github?.url} iconName="github" />
          <IconLink href={page.website?.url} iconName="link" />
        </Box>
      </Flex>

      <Divider marginY="300" width="50" />

      <Box paddingY="300">
        <Heading level={3}>{page.professionalSummary?.label}</Heading>
        <Box as="aside" paddingInlineEnd="500" paddingX="350" paddingY="200">
          <TextBox as="aside" fontSize="200">
            <RichText text={page.professionalSummary?.rich_text} />
          </TextBox>
        </Box>
      </Box>

      <Divider marginY="400" width="50" />

      <Flex alignItems="stretch" flexDirection={['column', 'row']}>
        <Box flexGrow={1} paddingY="300">
          <Experience experience={page.experience} />
        </Box>

        <Divider
          direction={breakpoint === 'mobile' ? 'horizontal' : 'vertical'}
          marginX={['0', '400']}
          marginY={['400', '200']}
          paddingBlockStart={['300', '0']}
          width="50"
        />

        <Box paddingY={['0', '300']} style={{ minWidth: '210px' }}>
          <Heading level={3}>{page.skills?.label}</Heading>
          <List items={page.skills?.multi_select.map(item => item.name)} />
        </Box>
      </Flex>
    </div>
  );
};
