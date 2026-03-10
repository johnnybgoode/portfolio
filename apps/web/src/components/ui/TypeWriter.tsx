'use client';

import { useEffect, useState } from 'react';
import {
  CursorClass,
  TypeWriterClass,
} from '../../styles/components/TypeWriter.css';

const cursorStyles = {
  block: '\u2588',
  blockRight: '\u2590',
  pipe: '|',
  underscore: '_',
};

type CursorProps = {
  isTyping: boolean;
  rate: number;
  style: keyof typeof cursorStyles;
};

const Cursor = ({ isTyping, rate, style }: CursorProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const visStyle = { visibility: isVisible ? 'visible' : 'hidden' } as const;
  const blink = !isTyping;

  useEffect(() => {
    if (!blink) {
      return;
    }
    const intervalId = setInterval(() => setIsVisible(prev => !prev), rate);
    return () => clearInterval(intervalId);
  }, [blink, rate]);

  return (
    <span className={CursorClass} style={visStyle}>
      {cursorStyles[style]}
    </span>
  );
};

type TypeWriterProps = {
  textItems: string[];
  typingSpeed: number;
  typingDelay: number;
  cursorStyle?: CursorProps['style'];
  loop?: boolean;
};

export const TypeWriter = ({
  cursorStyle,
  textItems,
  typingSpeed,
  typingDelay,
  loop: loopProp,
}: TypeWriterProps) => {
  const [charIndex, setCharIndex] = useState(0);
  const [messageIndex, setMessagIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const messages = textItems.map(str => str.trim());
  const loop = typeof loopProp === 'boolean' ? loopProp : true;

  if (!loop) {
    // End on first message
    messages.push(messages[0]);
  }

  const visibleText = messages[messageIndex].slice(0, charIndex);
  const currentText = messages[messageIndex];
  const isTyping =
    !isPaused && (isDeleting ? charIndex > 0 : charIndex < currentText.length);

  useEffect(() => {
    let frameId: number;
    const currentText = messages[messageIndex];

    const animate = () => {
      const now = Date.now();
      const elapsed = now - lastUpdateTime;
      const delayPerChar = isDeleting ? typingSpeed / 2 : typingSpeed;

      if (elapsed >= delayPerChar) {
        if (!isDeleting && charIndex < currentText.length) {
          setCharIndex(charIndex + 1);
          setLastUpdateTime(now);
        } else if (!isDeleting && charIndex === currentText.length) {
          if (messageIndex === messages.length - 1 && !loop) {
            setIsPaused(true);
          } else {
            setIsDeleting(true);
            setLastUpdateTime(now + typingDelay);
          }
        } else if (isDeleting && charIndex > 0) {
          setCharIndex(charIndex - 1);
          setLastUpdateTime(now);
        } else if (isDeleting && charIndex === 0) {
          setIsDeleting(false);
          setLastUpdateTime(now + typingDelay * 0.6);
          setMessagIndex((messageIndex + 1) % messages.length);
        }
      }
      if (!isPaused) {
        frameId = requestAnimationFrame(animate);
      }
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
    loop,
    isPaused,
  ]);

  useEffect(() => {
    const onFocus = () => {
      setIsPaused(false);
    };
    const onBlur = () => {
      setIsPaused(true);
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return (
    <pre className={TypeWriterClass}>
      {`> ${visibleText}`}
      <Cursor
        isTyping={isTyping}
        rate={400}
        style={cursorStyle || 'underscore'}
      />
    </pre>
  );
};
