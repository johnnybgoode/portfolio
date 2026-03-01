import type { PageData } from '#data/page.ts';
import { resumeRightCol, skillsWrapper } from '../styles/pages/Resume.css';
import { Box } from './ui/Box';
import { Heading } from './ui/Heading';
import { List } from './ui/List';

export const SkillsBackend = ({ page }: { page: PageData }) => (
  <Box
    className={[skillsWrapper, resumeRightCol].join(' ')}
    paddingBlockStart={['0', '100']}
    paddingInlineEnd={['0', '300']}
  >
    <Heading level={3}>{page.skills?.label}</Heading>

    <Heading level={5}>Languages & Frameworks</Heading>
    <strong>Backend: </strong>
    <List
      items={[
        'PHP',
        'Symfony',
        'Laravel',
        'Drupal',
        'Express.js',
        'Node.js',
        'Python',
        'MySQL/MariaDB',
        'Postgres',
        'Redis',
        'Prisma',
      ]}
      paddingBlockStart="200"
      variant="inline"
    />
    <strong>Frontend: </strong>
    <List
      items={[
        'TypeScript',
        'JavaScript',
        'React',
        'Redux',
        'React Context',
        'Jotai',
      ]}
      paddingBlockStart="200"
      variant="inline"
    />

    <Heading level={5}>APIs & Integration</Heading>
    <List
      items={[
        'RESTful API design and implementation',
        'GraphQL, Apollo',
        'SSO',
        'LLM workflows',
      ]}
      paddingBlockStart="200"
    />

    <Heading level={5}>Architecture & Systems</Heading>
    <List
      items={[
        'Microservices architecture',
        'Event-driven architecture',
        'Distributed systems analysis and debugging',
        'System design and technical architecture',
      ]}
      paddingBlockStart="200"
    />

    <Heading level={4}>Testing</Heading>
    <List
      items={[
        'Test-driven development',
        'Jest',
        'Jasmine',
        'Vitest',
        'React Testing Library',
        'Playwright',
        'Selenium',
      ]}
      paddingBlockStart="200"
      variant="inline"
    />

    <Heading level={5}>Additional Technologies</Heading>
    <List
      items={['Apache Kafka', 'Webpack', 'Vite', 'Go']}
      paddingBlockStart="200"
      variant="inline"
    />
  </Box>
);

export const SkillsFrontend = ({ page }: { page: PageData }) => (
  <Box className={skillsWrapper}>
    <Heading level={3}>{page.skills?.label}</Heading>

    <Heading level={5}>Languages</Heading>
    <List
      items={[
        'TypeScript',
        'JavaScript (ES6+)',
        'PHP',
        'CSS3',
        'SQL',
        'Python',
      ]}
      paddingBlockStart="200"
      variant="inline"
    />

    <Heading level={5}>Frameworks/Libraries</Heading>
    <List
      items={[
        'React',
        'Redux',
        'Jotai',
        'Gatsby',
        'Express.js',
        'RxJS',
        'Styled Components',
        'Tailwind CSS',
        'Shadcn',
      ]}
      paddingBlockStart="200"
      variant="inline"
    />

    <Heading level={5}>Testing</Heading>
    <List
      items={[
        'Jest',
        'Jasmine',
        'Vitest',
        'React Testing Library',
        'MSW',
        'Playwright',
        // 'Selenium',
      ]}
      paddingBlockStart="200"
      variant="inline"
    />

    <Heading level={5}>Infrastructure & Tooling</Heading>
    <List
      items={[
        'Webpack',
        'Vite',
        'Docker',
        'Vercel',
        'Netlify',
        'Github Actions',
        'New Relic',
        'Amplitude',
        'Sentry',
        'Grafana',
      ]}
      paddingBlockStart="200"
      variant="inline"
    />
  </Box>
);
/*
Core: TypeScript · JavaScript · React · Redux · React Context · Jotai · React Query · RxJS
Architecture & Patterns: SSR/SSG · Next.js (App Router patterns) · Component architecture · Technical design / RFC authorship · Microservices
Performance & Observability: Core Web Vitals (FCP, LCP, CLS) · Bundle analysis · Grafana · New Relic · Sentry · Datadog
Testing: Jest · Vitest · Jasmine · React Testing Library · Playwright · Selenium · Test-driven development
Styling: Tailwind CSS · CSS-in-JS (styled-components) · Atomic / utility-first CSS systems
Tooling: Webpack · Vite · GitHub Actions · Travis CI
Additional: PHP · Python · Drupal · SQL · LLM-powered UX · Web Accessibility (WCAG) · ElevenLabs · OpenAI Integration

*/
