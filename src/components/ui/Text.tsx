import type { RichTextItemResponse } from '@notionhq/client';

type TextProps = {
  textItem: RichTextItemResponse;
};

export const Text = ({ textItem }: TextProps) => {
  if (typeof textItem === 'undefined') {
    return null;
  }
  const { plain_text: text, annotations } = textItem;
  if (annotations.bold) {
    return <strong>{text}</strong>;
  }
  if (annotations.italic) {
    return <em>{text}</em>;
  }
  if (annotations.strikethrough) {
    return <s>{text}</s>;
  }
  if (annotations.underline) {
    return <u>{text}</u>;
  }
  if (annotations.code) {
    return <code>{text}</code>;
  }
  return <span>{text}</span>;
};
