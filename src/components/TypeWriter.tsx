import type { MultiSelectPropertyItemObjectResponse } from '@notionhq/client';
import { useEffect, useState } from 'react';
import { CursorStyle, TypeWriterStyle } from '../styles/components/TypeWriter.css';

type TypeWriterProps = {
  textItems: MultiSelectPropertyItemObjectResponse;
  typingSpeed: number;
  typingDelay: number;
};

export const TypeWriter = ({
  textItems,
  typingSpeed,
  typingDelay,
}: TypeWriterProps) => {
  const [charIndex, setCharIndex] = useState(0);
  const [messageIndex, setMessagIndex] = useState(0);
  const [visibleText, setVisibleText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const messages = textItems.multi_select.map(item => item.name);

  useEffect(() => {
    let frameId: number;

    const currentText = messages[messageIndex];
    const animate = () => {
      const now = Date.now();
      const elapsed = now - lastUpdateTime;
      const delayPerChar = isDeleting ? typingSpeed / 2 : typingSpeed;

      if (elapsed >= delayPerChar) {
        if (!isDeleting && charIndex < currentText.length) {
          setVisibleText(prev => `${prev}${currentText.charAt(charIndex)}`);
          setCharIndex(charIndex + 1);
          setLastUpdateTime(now);
        } else if (!isDeleting && charIndex === currentText.length) {
          setIsDeleting(true);
          setLastUpdateTime(now + typingDelay);
        } else if (isDeleting && charIndex > 0) {
          setCharIndex(charIndex - 1);
          setVisibleText(prev => prev.slice(0, -1));
          setLastUpdateTime(now);
        } else if (isDeleting && charIndex === 0) {
          setIsDeleting(false);
          setCharIndex(0);
          setVisibleText('');
          setMessagIndex((messageIndex + 1) % messages.length);
          setLastUpdateTime(now);
        }
      }

      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [
    charIndex,
    messages,
    isDeleting,
    lastUpdateTime,
    messageIndex,
    typingDelay,
    typingSpeed,
  ]);

  return (
    <pre className={TypeWriterStyle}>
      {`> ${visibleText}`}
      <span className={CursorStyle}>
        _
      </span>
    </pre>
  );
};
