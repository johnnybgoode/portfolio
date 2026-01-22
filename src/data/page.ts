import type {
  EmailPropertyItemObjectResponse,
  MultiSelectPropertyItemObjectResponse,
  PageObjectResponse,
  PhoneNumberPropertyItemObjectResponse,
  UrlPropertyItemObjectResponse,
} from '@notionhq/client';

type PagePropertyValue = PageData[string];

export type PageData = PageObjectResponse['properties'];

export type ResumePageData = Partial<{
  Title: PagePropertyValue & { type: 'rich_text' };
  Email: EmailPropertyItemObjectResponse;
  Phone: PhoneNumberPropertyItemObjectResponse;
  Linkedin: UrlPropertyItemObjectResponse;
  Github: UrlPropertyItemObjectResponse;
  Website: UrlPropertyItemObjectResponse;
  Summary: PagePropertyValue & { type: 'rich_text' };
  Skills: MultiSelectPropertyItemObjectResponse;
}>;

export type LandingPageData = Partial<{
  Headline: PagePropertyValue & { type: 'rich_text' };
  Taglines: MultiSelectPropertyItemObjectResponse;
}>;

export const getPage = async <T extends PageData>(pageId: string) => {
  const response = await fetch(`/api/page/${pageId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch page data');
  }
  const data: T = await response.json();
  return data;
};

export const getResumePage = getPage<ResumePageData>;

export const getLandingPage = getPage<LandingPageData>;
