import DomeGallery from './DomeGallery';

import {
  useDarkMode,
} from '../../contexts/DarkModeContext';

import {
  useThemeColors,
  withAlpha,
} from '../../hooks/useThemeColors';

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
        minHeight: 'clamp(760px, 96vh, 920px)',
        paddingTop: 'clamp(76px, 8vh, 96px)',
        paddingBottom: 'clamp(28px, 4vh, 44px)',
        background,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDarkMode
            ? `radial-gradient(
                circle at 50% 46%,
                ${withAlpha(themeColors.primary, 0.12)},
                transparent 66%
              )`
            : `radial-gradient(
                circle at 50% 46%,
                ${withAlpha(themeColors.primary, 0.07)},
                transparent 66%
              )`,
        }}
      />

      <div
        className="container mx-auto px-4 relative z-10"
        style={{
          maxWidth: '1180px',
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

            // Matches the visual size of “Certifications & Credentials”.
            fontSize: 'clamp(2rem, 3vw, 3rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.025em',
          }}
        >
          Skills
        </h2>

        <div className="skills-first-orbit">
          <style>{`
            .skills-first-orbit {
              position: relative;
              width: 100%;
              height: clamp(540px, 66vh, 690px);
              margin-top: 4px;
              isolation: isolate;
            }

            .skills-first-orbit__line {
              position: absolute;
              left: 50%;
              top: 48%;
              z-index: 0;
              width: min(94%, 1050px);
              height: 50%;
              border: 1.5px dashed rgba(75, 101, 69, 0.42);
              border-radius: 50%;
              transform-origin: center;
              pointer-events: none;
            }

            .skills-first-orbit__line--one {
              transform:
                translate(-50%, -50%)
                rotate(15deg);
            }

            .skills-first-orbit__line--two {
              transform:
                translate(-50%, -50%)
                rotate(-15deg);
            }

            .skills-first-orbit__gallery {
              position: absolute;
              inset: 0 0 38px;
              z-index: 2;
            }

            .skills-first-orbit__caption {
              position: absolute;
              left: 50%;
              bottom: 8px;
              z-index: 4;
              margin: 0;
              transform: translateX(-50%);
              white-space: nowrap;
              pointer-events: none;
              color: rgba(65, 84, 61, 0.78);
              font-family:
                ui-monospace,
                SFMono-Regular,
                Menlo,
                Monaco,
                Consolas,
                "Liberation Mono",
                monospace;
              font-size: clamp(0.68rem, 1vw, 0.82rem);
              letter-spacing: 0.14em;
            }

            @media (max-width: 760px) {
              .skills-first-orbit {
                height: clamp(440px, 59vh, 540px);
              }

              .skills-first-orbit__line {
                top: 47%;
                width: 98%;
                height: 48%;
              }

              .skills-first-orbit__gallery {
                inset: 0 0 34px;
              }

              .skills-first-orbit__caption {
                bottom: 6px;
                font-size: 0.62rem;
                letter-spacing: 0.1em;
              }
            }
          `}</style>

          <div
            className="skills-first-orbit__line skills-first-orbit__line--one"
            aria-hidden="true"
          />

          <div
            className="skills-first-orbit__line skills-first-orbit__line--two"
            aria-hidden="true"
          />

          <div className="skills-first-orbit__gallery">
            <DomeGallery />
          </div>

          <p
            className="skills-first-orbit__caption"
            aria-hidden="true"
          >
            360° DRAG&nbsp;&nbsp; EXPLORE THE ORBIT
          </p>
        </div>
      </div>
    </section>
  );
};

export default Skills;
