import type { RichTextItemResponse } from '@notionhq/client';

type RichTextProps = {
  text?: RichTextItemResponse | RichTextItemResponse[];
};

const RichTextItem = ({ textItem }: { textItem: RichTextItemResponse }) => {
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

export const RichText = ({ text }: RichTextProps) => {
  if (typeof text === 'undefined') {
    return null;
  }
  if (typeof text === 'object' && 'map' in text) {
    return text.map(item => (
      <RichTextItem key={item?.plain_text} textItem={item} />
    ));
  }
  return <RichTextItem textItem={text} />;
};
