import type {
  EmailPropertyItemObjectResponse,
  MultiSelectPropertyItemObjectResponse,
  PageObjectResponse,
  PhoneNumberPropertyItemObjectResponse,
  UrlPropertyItemObjectResponse,
} from '@notionhq/client';
import type { PagePropertyValue, RichTextPropertyValue } from './properties';

export type PageData = PageObjectResponse['properties'];

export type ResumePageData = Partial<{
  Title: RichTextPropertyValue;
  Email: EmailPropertyItemObjectResponse;
  Phone: PhoneNumberPropertyItemObjectResponse;
  Linkedin: UrlPropertyItemObjectResponse;
  Github: UrlPropertyItemObjectResponse;
  Website: RichTextPropertyValue;
  Summary: RichTextPropertyValue;
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
