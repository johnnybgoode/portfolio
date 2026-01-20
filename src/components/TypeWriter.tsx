import { useEffect, useState } from 'react';
import {
  CursorStyle,
  TypeWriterStyle,
} from '../styles/components/TypeWriter.css';

const cursorStyles = {
  block: '▋',
  blockRight: '▐',
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
    <span className={CursorStyle} style={visStyle}>
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
  const [visibleText, setVisibleText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [isPaused, setIsPaused] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const messages = textItems.map(str => str.trim());
  const loop = typeof loopProp === 'boolean' ? loopProp : true;

  if (!loop) {
    // End on first message
    messages.push(messages[0]);
  }

  useEffect(() => {
    let frameId: number;
    const currentText = messages[messageIndex];

    const animate = () => {
      const now = Date.now();
      const elapsed = now - lastUpdateTime;
      const delayPerChar = isDeleting ? typingSpeed / 2 : typingSpeed;

      if (elapsed >= delayPerChar) {
        if (!isDeleting && charIndex < currentText.length) {
          setIsTyping(true);
          setVisibleText(prev => `${prev}${currentText.charAt(charIndex)}`);
          setCharIndex(charIndex + 1);
          setLastUpdateTime(now);
        } else if (!isDeleting && charIndex === currentText.length) {
          if (messageIndex === messages.length - 1 && !loop) {
            setIsPaused(true);
          } else {
            setIsTyping(false);
            setIsDeleting(true);
            setLastUpdateTime(now + typingDelay);
          }
        } else if (isDeleting && charIndex > 0) {
          setIsTyping(true);
          setCharIndex(charIndex - 1);
          setVisibleText(prev => prev.slice(0, -1));
          setLastUpdateTime(now);
        } else if (isDeleting && charIndex === 0) {
          setIsTyping(false);
          setIsDeleting(false);
          setLastUpdateTime(now + typingDelay * 0.6);
          setCharIndex(0);
          setVisibleText('');
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
      setIsTyping(true);
    };
    const onBlur = () => {
      setIsPaused(true);
      setIsTyping(false);
    };
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  return (
    <pre className={TypeWriterStyle}>
      {`> ${visibleText}`}
      <Cursor
        isTyping={isTyping}
        rate={400}
        style={cursorStyle || 'underscore'}
      />
    </pre>
  );
};
