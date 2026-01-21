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
