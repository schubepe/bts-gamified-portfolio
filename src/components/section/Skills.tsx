import type { CSSProperties } from 'react';

import {
  useDarkMode,
} from '../../contexts/DarkModeContext';

import {
  useThemeColors,
  withAlpha,
} from '../../hooks/useThemeColors';

import { techStackArray } from '../../assets/techstack';

// Group the skills into three labeled categories.
// The `names` must match the `name` values in assets/techstack/index.ts.
const CATEGORIES = [
  {
    label: 'Finance',
    accent: '#8f6ab7',
    names: [
      'M&A',
      'Financial Modeling',
      'Comparable Company Analysis',
      'Cash Flow Analysis',
      'Financial Statement Analysis',
      'PitchBook',
    ],
  },
  {
    label: 'Tech & Programming',
    accent: '#5b7fbf',
    names: [
      'Excel',
      'PowerPoint',
      'Power Automate',
      'Python',
      'C++',
      'AI-Assisted Development',
    ],
  },
  {
    label: 'Languages',
    accent: '#c9a84c',
    names: [
      'English',
      'German',
      'Chinese',
      'Spanish',
    ],
  },
];

const findIcon = (name: string) =>
  techStackArray.find((item) => item.name === name)?.icon ?? '';

const Skills = () => {
  const { isDarkMode } = useDarkMode();
  const themeColors = useThemeColors();

  const background =
    themeColors.background.sections?.skills ??
    themeColors.background.gradient;

  return (
    <section
      id="skills"
      className="relative overflow-hidden"
      style={{
        scrollMarginTop: '84px',
        minHeight: 'clamp(620px, 80vh, 780px)',
        paddingTop: 'clamp(76px, 8vh, 96px)',
        paddingBottom: 'clamp(48px, 6vh, 72px)',
        background,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDarkMode
            ? `radial-gradient(
                circle at 50% 40%,
                ${withAlpha(themeColors.primary, 0.12)},
                transparent 66%
              )`
            : `radial-gradient(
                circle at 50% 40%,
                ${withAlpha(themeColors.primary, 0.07)},
                transparent 66%
              )`,
        }}
      />

      <div
        className="container mx-auto px-4 relative z-10"
        style={{
          maxWidth: '1100px',
        }}
      >
        <h2
          className="text-center font-bold"
          style={{
            position: 'relative',
            zIndex: 20,
            margin: 0,
            color: isDarkMode
              ? themeColors.colors.white
              : themeColors.colors.dark[700],
            fontSize: 'clamp(2rem, 3vw, 3rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
          }}
        >
          Skills
        </h2>

        <div className="skills-grid">
          <style>{`
            .skills-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: clamp(1rem, 2.5vw, 2rem);
              margin-top: clamp(2rem, 4vh, 3rem);
            }

            .skills-col {
              display: flex;
              flex-direction: column;
              gap: 0.85rem;
              padding: 1.3rem 1.1rem;
              border: 2px solid var(--col-accent);
              border-radius: 16px;
              background: ${
                isDarkMode
                  ? 'rgba(255, 255, 255, 0.04)'
                  : 'rgba(255, 255, 255, 0.55)'
              };
            }

            .skills-col__header {
              display: flex;
              align-items: center;
              gap: 0.5rem;
              margin-bottom: 0.35rem;
              padding-bottom: 0.6rem;
              border-bottom: 2px solid var(--col-accent);
              font-weight: 700;
              font-size: 0.95rem;
              letter-spacing: 0.02em;
              color: ${isDarkMode ? '#ffffff' : '#3d294c'};
            }

            .skills-col__dot {
              width: 12px;
              height: 12px;
              border-radius: 50%;
              background: var(--col-accent);
              flex-shrink: 0;
            }

            .skills-item {
              display: flex;
              align-items: center;
              gap: 0.7rem;
            }

            .skills-item img {
              width: 34px;
              height: 34px;
              border-radius: 7px;
              object-fit: contain;
              flex-shrink: 0;
              background: #ffffff;
              padding: 3px;
              border: 1px solid rgba(0, 0, 0, 0.06);
            }

            .skills-item span {
              font-size: 0.82rem;
              line-height: 1.2;
              color: ${isDarkMode ? '#e8e8e8' : '#4a3a58'};
            }

            @media (max-width: 820px) {
              .skills-grid {
                grid-template-columns: 1fr;
              }
            }
          `}</style>

          {CATEGORIES.map((category) => (
            <div
              key={category.label}
              className="skills-col"
              style={
                {
                  '--col-accent': category.accent,
                } as CSSProperties
              }
            >
              <div className="skills-col__header">
                <span className="skills-col__dot" />
                {category.label}
              </div>

              {category.names.map((name) => (
                <div key={name} className="skills-item">
                  <img src={findIcon(name)} alt={name} />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;