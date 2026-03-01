import { useSuspenseQuery } from '@tanstack/react-query';
import { useDocumentTitle } from '#hooks/useDocumentTitle.ts';
import { getPage, type ResumePageData } from '../data/page';
import { useBreakpoint } from '../hooks/useBreakpoint';
import {
  lowerWrapper,
  printPageBackground,
  resumeRightCol,
  resumeWrapper,
} from '../styles/pages/Resume.css';
import { Experience } from './Experience';
import { SkillsFrontend } from './Skills';
import { Box } from './ui/Box';
import { Divider } from './ui/Divider';
import { Flex } from './ui/Flex';
import { Heading } from './ui/Heading';
import { IconLink } from './ui/IconLink';
import { RichText } from './ui/RichText';
import { TextBox } from './ui/TextBox';

const Dot = () => (
  <Box paddingX="200" style={{ fontSize: '8px', marginTop: '-1px' }}>
    •
  </Box>
);

type ResumeProps = {
  pageId: string;
};

export const Resume = ({ pageId }: ResumeProps) => {
  useDocumentTitle('Senior Software Engineer | Resume');
  const { data: page } = useSuspenseQuery({
    queryKey: ['pageData', pageId],
    queryFn: () => getPage<ResumePageData>(pageId),
  });
  const breakpoint = useBreakpoint();

  return (
    <div className={resumeWrapper}>
      <div className={printPageBackground}>&nbsp;</div>
      <div style={{ position: 'relative' }}>
        <Flex
          alignItems="stretch"
          justifyContent="space-between"
          paddingY="300"
        >
          <Box flexGrow={1} paddingInlineStart="100" width={['40', '70']}>
            {page.title && (
              <Heading
                level={1}
                paddingInlineStart="100"
                style={{ minWidth: '210px' }}
                width="30"
              >
                <RichText text={page.title.rich_text} />
              </Heading>
            )}
          </Box>

          <Divider
            direction="vertical"
            marginX="400"
            marginY={['400', '400', '200']}
            width="50"
          />

          <Box alignSelf="center" className={resumeRightCol}>
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

        <Divider marginY={['200', '300', '250']} width="50" />

        <Box
          paddingBlockEnd={['300', '300', '100']}
          paddingBlockStart={['300', '300', '250']}
        >
          <Heading level={3}>{page.professionalSummary?.label}</Heading>
          <Box as="aside" paddingInlineEnd="500" paddingX="350" paddingY="200">
            <TextBox as="aside" fontSize="200" style={{ lineHeight: '1.3' }}>
              <RichText text={page.professionalSummary?.rich_text} />
            </TextBox>
          </Box>
        </Box>

        <Divider marginY={['300', '400', '300']} width="50" />

        <Flex
          alignItems="stretch"
          className={lowerWrapper}
          flexDirection={['column', 'row']}
        >
          <Box flexGrow={1} paddingY="100">
            <Experience experience={page.experience} pageId={pageId} />
          </Box>

          <Divider
            direction={breakpoint === 'mobile' ? 'horizontal' : 'vertical'}
            marginBlockEnd="300"
            marginBlockStart="350"
            marginX={['0', '400', '400']}
            paddingBlockStart={['300', '0']}
            width="50"
          />

          <Box
            className={resumeRightCol}
            paddingBlockStart={['0', '100']}
            paddingInlineEnd={['0', '300']}
          >
            <SkillsFrontend page={page} />

            <Divider marginY="600" width="50" />

            <Box justifyContent="space-between">
              <Heading level={3}>Education</Heading>
              <Heading level={5} style={{ marginBlockEnd: '0.25em' }}>
                Drexel University
              </Heading>
              <TextBox fontSize="50">Philadelphia, PA</TextBox>
              <Flex justifyContent="space-between" paddingY="250">
                <Flex alignItems="center">
                  BS <Dot /> MIS
                </Flex>
                <div>2005-2010</div>
              </Flex>
            </Box>
          </Box>
        </Flex>
      </div>
    </div>
  );
};
