import { useEffect, useState } from 'react';

interface TypewriterCarouselProps {
  roles: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

const TypewriterCarousel = ({
  roles,
  typingSpeed = 45,
  deletingSpeed = 25,
  pauseDuration = 900,
  className = '',
}: TypewriterCarouselProps) => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentRole = roles[currentRoleIndex];

    if (!currentRole) return;

    if (isPaused) {
      const pauseTimeout = window.setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseDuration);

      return () => window.clearTimeout(pauseTimeout);
    }

    if (!isDeleting) {
      if (displayText.length < currentRole.length) {
        const typingTimeout = window.setTimeout(() => {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        }, typingSpeed);

        return () => window.clearTimeout(typingTimeout);
      }

      setIsPaused(true);
      return;
    }

    if (displayText.length > 0) {
      const deletingTimeout = window.setTimeout(() => {
        setDisplayText(displayText.slice(0, -1));
      }, deletingSpeed);

      return () => window.clearTimeout(deletingTimeout);
    }

    setIsDeleting(false);
    setCurrentRoleIndex(
      (previousIndex) => (previousIndex + 1) % roles.length,
    );
  }, [
    displayText,
    isDeleting,
    isPaused,
    currentRoleIndex,
    roles,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
  ]);

  return (
    <span className={`typewriter ${className}`}>
      {displayText}
      <span className="cursor">|</span>
    </span>
  );
};

export default TypewriterCarousel;