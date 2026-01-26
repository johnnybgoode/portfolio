import {
  type NarrowProperties,
  type PagePropertyValue,
} from '../../../data/properties';

type PropertyValue<
  K extends PagePropertyValue['type'],
  P extends NarrowProperties<PagePropertyValue, K>,
> = K extends keyof P ? Pick<P, K> & Partial<P> : never;

export const makeProperty = <
  K extends PagePropertyValue['type'],
  P extends NarrowProperties<PagePropertyValue, K>,
>({
  type,
  value,
  label,
}: {
  type: K;
  value: PropertyValue<K, P>;
  label?: string;
}) => ({
  ...value,
  label: label || type,
  id: 'foo',
  type,
});

export const makeRichText = (text: string) =>
  ({
    type: 'text',
    text: {
      content: text,
      link: null,
    } as const,
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
      color: 'default',
    } as const,
    plain_text: text,
    href: null,
  }) as const;

export const makeRichTextWithColor = (text: string) => {
  const color = 'default' as const;
  return {
    rich_text: [makeRichText(text)],
    color,
  };
};

export const makeToggleableRichTextWithColor = (text: string) => {
  const is_toggleable = false as const;
  return {
    ...makeRichTextWithColor(text),
    is_toggleable,
  };
};
