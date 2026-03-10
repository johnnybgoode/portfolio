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
} from './properties.ts';

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

type ExperienceProperties = {
  name: TitlePropertyValue;
  start: RichTextPropertyValue;
  end: RichTextPropertyValue;
  location: RichTextPropertyValue;
  position: RichTextPropertyValue;
};
export type ExperiencePageData = Partial<{
  [K in keyof ExperienceProperties]: PagePropertyValueWithLabel<
    ExperienceProperties[K]
  >;
}>;

export type LandingPageData = Partial<{
  headline: PagePropertyValueWithLabel<RichTextPropertyValue>;
  taglines: PagePropertyValueWithLabel<MultiSelectPropertyItemObjectResponse>;
}>;
