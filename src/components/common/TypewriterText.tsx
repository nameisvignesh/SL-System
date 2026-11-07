import React, { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per char
  onComplete?: () => void;
  className?: string;
  showCursor?: boolean;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 18,
  onComplete,
  className = '',
  showCursor = true,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    setDisplayedText('');
    setIsFinished(false);
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsFinished(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={`inline ${className}`}>
      {displayedText}
      {showCursor && !isFinished && (
        <span className="inline-block w-1.5 h-3.5 bg-[#2D9CFF] ml-0.5 animate-pulse align-middle" />
      )}
    </span>
  );
};
