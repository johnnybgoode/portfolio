import type {
  MultiSelectPropertyItemObjectResponse,
  PageObjectResponse,
  UrlPropertyItemObjectResponse,
} from '@notionhq/client';

export type PageProperties = PageObjectResponse['properties'];
export type PagePropertyValue = PageProperties[string];
export type RichTextPropertyValue = PagePropertyValue & { type: 'rich_text' };

export const isRichTextProperty = (
  property: PagePropertyValue,
): property is RichTextPropertyValue => {
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
