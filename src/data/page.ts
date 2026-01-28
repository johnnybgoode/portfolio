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
  TitlePropertyValue,
} from './properties';

type PagePropertiesWithLabel<P extends PageProperties> = Partial<{
  [K in keyof P]: PagePropertyValueWithLabel<P[K]>;
}>;

export type PageData = PagePropertiesWithLabel<PageProperties>;

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
export type ResumePageData = PagePropertiesWithLabel<ResumeProperties>;

type ExperienceProperties = {
  name: TitlePropertyValue;
  start: RichTextPropertyValue;
  end: RichTextPropertyValue;
  position: RichTextPropertyValue;
};
export type ExperiencePageData = PagePropertiesWithLabel<ExperienceProperties>;

type LandingPageProperties = {
  headline: RichTextPropertyValue;
  taglines: MultiSelectPropertyItemObjectResponse;
};
export type LandingPageData = PagePropertiesWithLabel<LandingPageProperties>;

export const getPage = async <T extends PageData>(pageId: string) => {
  const response = await fetch(`/api/page/${pageId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch page data');
  }
  const data: T = await response.json();
  return data;
};
