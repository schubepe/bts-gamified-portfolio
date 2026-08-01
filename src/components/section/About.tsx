import { useEffect, useState } from 'react';

import { useDarkMode } from '../../contexts/DarkModeContext';
import InteractiveLanding from './InteractiveLanding';
import CassetteAbout from './CassetteAbout';
import { portfolio } from '../../config/portfolio';

const FULL_ASCII_ART = `⠀⠀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢠⣾⠟⠉⠉⠛⠿⢶⣤⣀⠀⣀⣀⣀⣀⣀⣀⡀⠀⠀⠀⠀⣀⣠⣴⠶⠶⢶⣦⡀
⢸⡇⠀⠀⠀⠀⠀⠀⠈⠛⡛⠙⠉⡹⠙⠛⠋⠟⠛⠶⣶⡿⠋⠉⠀⠀⠀⠀⢹⣧
⢸⡇⠀⠀⠀⠀⠀⠀⠀⢰⠁⡄⠀⡇⢸⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⡇
⠘⠿⠀⠀⠀⠀⠀⠀⠀⠀⠉⠁⠀⠀⠀⠀⠈⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⠃
⠀⠀⠀⢀⣠⣤⣤⣤⣄⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠿⠏⠀
⠀⠀⣰⡟⠁⠀⠀⠙⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⢀⣤⡴⠛⠛⠻⣷⣦⡀⠀⠀⠀
⠀⠀⣿⣇⠀⠀⢀⣰⣿⣿⣿⡄⠀⠀⠀⠀⠀⢀⣾⡏⠀⠀⠀⠀⢈⣿⣿⠀⠀⠀
⠀⠀⢿⣿⣿⣿⣿⣿⣿⣿⣿⡧⠀⠀⠀⠀⠀⣼⣿⣧⣤⣤⣤⣴⣿⣿⣿⠀⠀⠀
⢀⠂⠉⡻⢿⣿⣿⣿⣏⢹⣿⠇⠀⠀⠀⠀⠀⣿⣿⣿⣿⡟⢿⣿⣿⣿⠃⣀⠀⠀
⠀⠉⠙⠿⣦⣍⡛⠛⠛⠉⠁⠀⠀⠀⠀⠀⠀⠈⠛⠿⠿⠷⢟⣛⣽⡧⠤⠔⠀⠀
⠀⠀⠀⠀⠈⠙⠛⢿⣶⣶⣦⣤⡀⠀⣀⣀⣤⣀⣤⣤⣴⡾⠟⠛⠉⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠘⣿⡆⠀⠙⠿⠿⠛⠉⣉⣽⡿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠸⣧⣠⣴⠶⢶⣤⣴⡿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⠛⠃⠀⠀⠛⠋⠀⠀`;

const About = () => {
  const { isDarkMode } = useDarkMode();
  const [asciiText, setAsciiText] = useState('');

  useEffect(() => {
    let currentIndex = 0;
    let typingTimer: number | null = null;

    const typeNextCharacter = () => {
      currentIndex += 1;
      setAsciiText(FULL_ASCII_ART.slice(0, currentIndex));

      if (currentIndex < FULL_ASCII_ART.length) {
        typingTimer = window.setTimeout(typeNextCharacter, 3);
      }
    };

    const startTimer = window.setTimeout(typeNextCharacter, 500);

    return () => {
      window.clearTimeout(startTimer);
      if (typingTimer !== null) window.clearTimeout(typingTimer);
    };
  }, []);

  return (
    <section
      id="about"
      className="min-h-screen"
      style={{
        width: '100%',
        maxWidth: '100vw',
        contain: 'layout',
        transition: 'background 0.3s ease-in-out',
        background: isDarkMode
          ? `radial-gradient(circle at 16% 10%, rgba(191, 163, 225, 0.15) 0%, transparent 30%),
             radial-gradient(circle at 84% 16%, rgba(176, 190, 242, 0.12) 0%, transparent 32%),
             radial-gradient(circle at 52% 78%, rgba(241, 190, 220, 0.08) 0%, transparent 34%),
             linear-gradient(160deg, #130C1B 0%, #1B1125 52%, #160E20 100%)`
          : `radial-gradient(circle at 14% 10%, rgba(238, 199, 226, 0.28) 0%, transparent 30%),
             radial-gradient(circle at 84% 16%, rgba(195, 202, 244, 0.28) 0%, transparent 32%),
             radial-gradient(circle at 52% 78%, rgba(221, 205, 243, 0.24) 0%, transparent 34%),
             linear-gradient(160deg, #FBF7FF 0%, #F1EAF9 52%, #F7F2FC 100%)`,
      }}
    >
      <InteractiveLanding asciiArt={asciiText} />
      <CassetteAbout title={`Meet ${portfolio.name}`} lines={[...portfolio.intro]} />
    </section>
  );
};

export default About;
