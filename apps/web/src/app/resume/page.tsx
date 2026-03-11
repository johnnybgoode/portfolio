import type { ResumePageData } from '@portfolio/notion';
import { fetchPage } from '@portfolio/notion';
import type { Metadata } from 'next';
import { Experience } from '../../components/Experience';
import { ResponsiveDivider } from '../../components/ResumeClient';
import { SkillsFrontend } from '../../components/Skills';
import { Box } from '../../components/ui/Box';
import { Divider } from '../../components/ui/Divider';
import { Flex } from '../../components/ui/Flex';
import { Heading } from '../../components/ui/Heading';
import { IconLink } from '../../components/ui/IconLink';
import { RichText } from '../../components/ui/RichText';
import { TextBox } from '../../components/ui/TextBox';
import {
  dot,
  lowerWrapper,
  printPageBackground,
  relativeWrapper,
  resumeRightCol,
  resumeWrapper,
  summaryText,
  titleHeading,
} from '../../styles/pages/Resume.css';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Senior Software Engineer | Resume | John Entwistle',
};

const Dot = () => (
  <Box className={dot} paddingX="200">
    •
  </Box>
);

const PAGE_ID = 'resume';

export default async function ResumePage() {
  const page = await fetchPage<ResumePageData>(PAGE_ID);

  return (
    <div className={resumeWrapper}>
      <div className={printPageBackground}>&nbsp;</div>
      <div className={relativeWrapper}>
        <Flex
          alignItems="stretch"
          justifyContent="space-between"
          paddingY="300"
        >
          <Box flexGrow={1} paddingInlineStart="100" width={['40', '70']}>
            {page.title && (
              <Heading
                className={titleHeading}
                level={1}
                paddingInlineStart="100"
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
            <TextBox as="aside" className={summaryText} fontSize="200">
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
            <Experience experience={page.experience} pageId={PAGE_ID} />
          </Box>

          <ResponsiveDivider />

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
}
