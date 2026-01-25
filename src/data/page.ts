import type {
  EmailPropertyItemObjectResponse,
  MultiSelectPropertyItemObjectResponse,
  PhoneNumberPropertyItemObjectResponse,
  UrlPropertyItemObjectResponse,
} from '@notionhq/client';
import type {
  PageProperties,
  PagePropertyValueWithLabel,
  RelationPropertyValue,
  RichTextPropertyValue,
} from './properties';

export type PageData = {
  [K in keyof PageProperties]: PagePropertyValueWithLabel<PageProperties[K]>;
};

type ResumeProperties = {
  title: RichTextPropertyValue;
  email: EmailPropertyItemObjectResponse;
  phone: PhoneNumberPropertyItemObjectResponse;
  linkedin: UrlPropertyItemObjectResponse;
  github: UrlPropertyItemObjectResponse;
  website: UrlPropertyItemObjectResponse;
  professionalSummary: RichTextPropertyValue;
  skills: MultiSelectPropertyItemObjectResponse;
  experience: RelationPropertyValue;
};
export type ResumePageData = Partial<{
  [K in keyof ResumeProperties]: PagePropertyValueWithLabel<
    ResumeProperties[K]
  >;
}>;

export type LandingPageData = Partial<{
  headline: PagePropertyValueWithLabel<RichTextPropertyValue>;
  taglines: PagePropertyValueWithLabel<MultiSelectPropertyItemObjectResponse>;
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
