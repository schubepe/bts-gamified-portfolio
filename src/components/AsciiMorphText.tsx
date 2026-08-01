import { useEffect, useRef } from 'react';

interface AsciiMorphTextProps {
  text: string;
}

const AsciiMorphText: React.FC<AsciiMorphTextProps> = ({ text }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chars = '!<>-_\\/[]{}—=+*^?#________';
    const letters = text.split('');

    if (!containerRef.current) return;

    containerRef.current.innerHTML = '';

    letters.forEach((letter) => {
      const span = document.createElement('span');

      span.textContent = letter;
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      span.style.minWidth = letter === ' ' ? '0.3em' : 'auto';

      containerRef.current?.appendChild(span);
    });

    const spans = containerRef.current.querySelectorAll('span');

    spans.forEach((span, index) => {
      const letter = letters[index];
      let iterations = 0;

      setTimeout(() => {
        const interval = setInterval(() => {
          if (iterations < 10) {
            span.textContent =
              chars[Math.floor(Math.random() * chars.length)];

            span.style.opacity = '1';

            // Temporary cyan colour while morphing
            span.style.color = 'var(--accent-cyan)';
          } else {
            span.textContent = letter;
            span.style.opacity = '1';

            // Remove the inline colour so CSS controls the final colour
            span.style.removeProperty('color');

            clearInterval(interval);
          }

          iterations++;
        }, 50);
      }, index * 100);
    });
  }, [text]);

  return (
    <div
      ref={containerRef}
      className="ascii-morph-text"
      style={{
        fontSize: 'clamp(1.5rem, 5vw, 3rem)',
        letterSpacing: '0.05em',
        textAlign: 'left',
        margin: '0.5rem 0',
      }}
    />
  );
};

export default AsciiMorphText;