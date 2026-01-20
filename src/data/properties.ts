import type {
  MultiSelectPropertyItemObjectResponse,
  PageObjectResponse,
  RichTextPropertyItemObjectResponse,
  UrlPropertyItemObjectResponse,
} from '@notionhq/client';

type PagePropertyValue = PageObjectResponse['properties'][string];
type RichTextArrayBasedPropertyValueResponse = Omit<
  RichTextPropertyItemObjectResponse,
  'rich_text'
> & {
  rich_text: Array<RichTextPropertyItemObjectResponse['rich_text']>;
};

export const isRichTextProperty = (
  property: PagePropertyValue,
): property is RichTextArrayBasedPropertyValueResponse => {
  return property.type === 'rich_text';
};

export const isMultiSelectProperty = (
  property: PagePropertyValue,
): property is MultiSelectPropertyItemObjectResponse => {
  return property.type === 'multi_select';
};

export const isUrlProperty = (
  property: PagePropertyValue,
): property is UrlPropertyItemObjectResponse => {
  return property.type === 'url';
};
