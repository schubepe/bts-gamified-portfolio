import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  LockKeyhole,
  Menu,
  X,
} from 'lucide-react';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import DarkModeToggle from '../DarkModeToggle';
import { useDarkMode } from '../../contexts/DarkModeContext';
import {
  useThemeColors,
  withAlpha,
} from '../../hooks/useThemeColors';
import { portfolio } from '../../config/portfolio';

const PROJECTS_UNLOCK_EVENT = 'portfolio:projects-unlocked';

const readProjectsUnlocked = () => {
  if (typeof document === 'undefined') {
    return false;
  }

  return document.documentElement.classList.contains(
    'portfolio-projects-unlocked',
  );
};

const Navigation = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [isScrolled, setIsScrolled] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const [projectsUnlocked, setProjectsUnlocked] =
    useState(readProjectsUnlocked);

  const [showProjectWarning, setShowProjectWarning] =
    useState(false);

  const warningTimerRef = useRef<number | null>(null);

  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const themeColors = useThemeColors();

  const navigate = useNavigate();
  const location = useLocation();

  const tabs = useMemo(
    () => [
      {
        id: 'about',
        label: 'About',
      },
      {
        id: 'projects',
        label: 'Projects',
      },
      {
        id: 'skills',
        label: 'Skills',
      },
    ],
    [],
  );

  const hideProjectWarning = () => {
    setShowProjectWarning(false);

    if (warningTimerRef.current !== null) {
      window.clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
  };

  const showProjectsLockedWarning = () => {
    setShowProjectWarning(true);

    if (warningTimerRef.current !== null) {
      window.clearTimeout(warningTimerRef.current);
    }

    warningTimerRef.current = window.setTimeout(() => {
      setShowProjectWarning(false);
      warningTimerRef.current = null;
    }, 4500);
  };

  /*
   * Your InteractiveLanding updates classes on the
   * <html> element when the XP challenge is completed.
   *
   * This keeps Navigation synchronised with that state.
   */
  useEffect(() => {
    const syncProjectsState = () => {
      const unlocked = readProjectsUnlocked();

      setProjectsUnlocked(unlocked);

      if (unlocked) {
        setShowProjectWarning(false);

        if (warningTimerRef.current !== null) {
          window.clearTimeout(
            warningTimerRef.current,
          );

          warningTimerRef.current = null;
        }
      }
    };

    const classObserver = new MutationObserver(
      syncProjectsState,
    );

    classObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    window.addEventListener(
      PROJECTS_UNLOCK_EVENT,
      syncProjectsState,
    );

    syncProjectsState();

    return () => {
      classObserver.disconnect();

      window.removeEventListener(
        PROJECTS_UNLOCK_EVENT,
        syncProjectsState,
      );
    };
  }, []);

  /*
   * Handles the active navigation tab and the
   * transparent navigation background.
   */
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);

      const currentSection = tabs.find((tab) => {
        const element =
          document.getElementById(tab.id);

        if (!element) {
          return false;
        }

        const rect =
          element.getBoundingClientRect();

        return (
          rect.top <= 100 &&
          rect.bottom >= 100
        );
      });

      if (currentSection) {
        setActiveTab(currentSection.id);
      }
    };

    const handleResize = () => {
      if (
        window.innerWidth >= 768 &&
        isMobileMenuOpen
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    handleScroll();

    window.addEventListener(
      'scroll',
      handleScroll,
      {
        passive: true,
      },
    );

    window.addEventListener(
      'resize',
      handleResize,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      );

      window.removeEventListener(
        'resize',
        handleResize,
      );
    };
  }, [tabs, isMobileMenuOpen]);

  /*
   * Clear the warning timer when Navigation unmounts.
   */
  useEffect(() => {
    return () => {
      if (warningTimerRef.current !== null) {
        window.clearTimeout(
          warningTimerRef.current,
        );
      }
    };
  }, []);

  /*
   * Scrolls visitors directly to the three XP cards.
   * It retries briefly when returning from another route.
   */
  const scrollToCreativeScan = (
    attempt = 0,
  ) => {
    const element =
      document.querySelector<HTMLElement>(
        '.lab-module-grid',
      ) ??
      document.querySelector<HTMLElement>(
        '.lab-landing',
      ) ??
      document.getElementById('about');

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });

      return;
    }

    if (attempt < 12) {
      window.setTimeout(() => {
        scrollToCreativeScan(attempt + 1);
      }, 80);
    }
  };

  /*
   * Scrolls to a normal portfolio section.
   * It retries while the homepage renders.
   */
  const scrollToExistingSection = (
    sectionId: string,
    attempt = 0,
  ) => {
    const element =
      document.getElementById(sectionId);

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      setActiveTab(sectionId);
      return;
    }

    if (attempt < 12) {
      window.setTimeout(() => {
        scrollToExistingSection(
          sectionId,
          attempt + 1,
        );
      }, 80);
    }
  };

  const scrollToSection = (
    sectionId: string,
  ) => {
    setIsMobileMenuOpen(false);

    /*
     * Show the warning instead of silently doing nothing
     * when Projects has not been unlocked.
     */
    if (
      sectionId === 'projects' &&
      !projectsUnlocked
    ) {
      showProjectsLockedWarning();

      if (location.pathname !== '/') {
        navigate('/', {
          replace: true,
        });

        window.setTimeout(() => {
          scrollToCreativeScan();
        }, 120);
      } else {
        scrollToCreativeScan();
      }

      return;
    }

    hideProjectWarning();

    if (location.pathname !== '/') {
      navigate('/', {
        replace: true,
      });

      window.setTimeout(() => {
        scrollToExistingSection(sectionId);
      }, 120);

      return;
    }

    scrollToExistingSection(sectionId);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(
      (currentValue) => !currentValue,
    );
  };

  return (
    <nav
      className={`navigation ${
        isScrolled ? 'scrolled' : ''
      }`}
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        top: '0px',
        left: '0px',
        right: '0px',
        width: '100%',
        zIndex: 99999,
        padding: '1rem 0',

        borderBottom: `1px solid ${
          isScrolled
            ? themeColors.navigation
                .borderScrolled
            : themeColors.navigation.border
        }`,

        boxShadow: `0 ${
          isScrolled
            ? '8px 32px'
            : '4px 24px'
        } ${
          isScrolled
            ? themeColors.navigation
                .shadowScrolled
            : themeColors.navigation.shadow
        }`,

        backdropFilter:
          'saturate(200%) blur(30px)',

        WebkitBackdropFilter:
          'saturate(200%) blur(30px)',

        transition: 'all 0.3s ease',

        background: `linear-gradient(
          135deg,
          ${withAlpha(
            isDarkMode
              ? themeColors.colors.dark[950]
              : themeColors.colors.pink[50],
            isScrolled ? 0.7 : 0.5,
          )},
          ${withAlpha(
            isDarkMode
              ? themeColors.colors.dark[900]
              : themeColors.colors.pink[25],
            isScrolled ? 0.7 : 0.5,
          )}
        )`,
      }}
    >
      <div className="nav-container">
        <button
          type="button"
          className="signature-name"
          style={{
            cursor: 'pointer',
            color:
              themeColors.colors.pink[500],
            background: 'none',
            border: 'none',
            outline: 'none',

            WebkitTextFillColor:
              themeColors.colors.pink[500],
          }}
          onClick={() => {
            hideProjectWarning();

            if (location.pathname !== '/') {
              navigate('/');
            }

            window.setTimeout(() => {
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              });
            }, 50);
          }}
          aria-label={`${portfolio.name} — go to homepage`}
        >
          {portfolio.name}
        </button>

        {/* Desktop navigation */}
        <div className="nav-tabs desktop-nav">
          {tabs.map((tab) => {
            const isLockedProject =
              tab.id === 'projects' &&
              !projectsUnlocked;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  scrollToSection(tab.id)
                }
                className={`nav-tab ${
                  activeTab === tab.id
                    ? 'active'
                    : ''
                }`}
                style={{
                  color:
                    themeColors.text.accent,

                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',

                  opacity: isLockedProject
                    ? 0.72
                    : 1,
                }}
                aria-label={
                  isLockedProject
                    ? 'Projects locked — complete the Creative Scan to unlock'
                    : `Navigate to ${tab.label} section`
                }
                aria-haspopup={
                  isLockedProject
                    ? 'dialog'
                    : undefined
                }
              >
                <span>{tab.label}</span>

                {isLockedProject && (
                  <LockKeyhole
                    size={13}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}

          <div className="ml-4">
            <DarkModeToggle
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          className="mobile-menu-btn relative"
          onClick={toggleMobileMenu}
          aria-label={
            isMobileMenuOpen
              ? 'Close menu'
              : 'Open menu'
          }
          aria-expanded={isMobileMenuOpen}
          style={{
            background: isDarkMode
              ? themeColors.colors.dark[800]
              : themeColors.colors.white,

            border: `1px solid ${themeColors.colors.pink[200]}`,

            borderRadius: '12px',
            cursor: 'pointer',
            padding: '10px',
            display: 'none',

            color:
              themeColors.colors.pink[500],

            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '24px',
              height: '24px',
            }}
          >
            <Menu
              size={24}
              style={{
                position: 'absolute',

                transition:
                  'opacity 0.3s ease',

                opacity:
                  isMobileMenuOpen
                    ? 0
                    : 1,
              }}
            />

            <X
              size={24}
              style={{
                position: 'absolute',

                transition:
                  'opacity 0.3s ease',

                opacity:
                  isMobileMenuOpen
                    ? 1
                    : 0,
              }}
            />
          </div>
        </button>
      </div>

      {/* Mobile navigation menu */}
      <div
        className={`mobile-menu ${
          isMobileMenuOpen ? 'open' : ''
        }`}
        style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,

          flexDirection: 'column',
          padding: '1rem',

          background:
            themeColors.navigation.mobile,

          borderTop: `1px solid ${themeColors.navigation.border}`,

          maxHeight: isMobileMenuOpen
            ? '400px'
            : '0',

          overflow: isMobileMenuOpen
            ? 'visible'
            : 'hidden',

          transition:
            'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',

          opacity:
            isMobileMenuOpen ? 1 : 0,

          boxShadow: isMobileMenuOpen
            ? `0 8px 25px ${themeColors.navigation.shadowScrolled}`
            : 'none',

          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter:
            'blur(20px)',
        }}
      >
        {tabs.map((tab, index) => {
          const isLockedProject =
            tab.id === 'projects' &&
            !projectsUnlocked;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                scrollToSection(tab.id)
              }
              className={`mobile-nav-tab ${
                activeTab === tab.id
                  ? 'active'
                  : ''
              }`}
              style={{
                background:
                  activeTab === tab.id
                    ? withAlpha(
                        themeColors.colors
                          .pink[50],
                        isDarkMode
                          ? 0.05
                          : 0.8,
                      )
                    : 'none',

                border:
                  activeTab === tab.id
                    ? `1px solid ${themeColors.colors.pink[200]}`
                    : '1px solid transparent',

                borderRadius: '12px',
                padding:
                  '0.875rem 1.25rem',

                textAlign: 'left',

                color:
                  activeTab === tab.id
                    ? themeColors.colors
                        .pink[500]
                    : themeColors.text
                        .accent,

                fontWeight:
                  activeTab === tab.id
                    ? '600'
                    : '500',

                fontSize: '1rem',
                cursor: 'pointer',

                transition:
                  'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

                opacity: isMobileMenuOpen
                  ? isLockedProject
                    ? 0.72
                    : 1
                  : 0,

                transitionDelay:
                  isMobileMenuOpen
                    ? `${index * 0.1}s`
                    : '0s',

                marginBottom: '0.5rem',
                minHeight: '44px',

                display: 'flex',
                alignItems: 'center',
                justifyContent:
                  'space-between',

                gap: '0.5rem',
                outline: 'none',
                width: '100%',
              }}
              onMouseEnter={(event) => {
                if (
                  activeTab !== tab.id
                ) {
                  event.currentTarget.style.background =
                    withAlpha(
                      themeColors.colors
                        .pink[50],
                      isDarkMode
                        ? 0.03
                        : 0.5,
                    );

                  event.currentTarget.style.borderColor =
                    themeColors.colors
                      .pink[200];
                }
              }}
              onMouseLeave={(event) => {
                if (
                  activeTab !== tab.id
                ) {
                  event.currentTarget.style.background =
                    'none';

                  event.currentTarget.style.borderColor =
                    'transparent';
                }
              }}
              aria-label={
                isLockedProject
                  ? 'Projects locked — complete the Creative Scan to unlock'
                  : `Navigate to ${tab.label} section`
              }
            >
              <span>{tab.label}</span>

              {isLockedProject && (
                <LockKeyhole
                  size={15}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}

        <div
          className="mt-6 px-4"
          style={{
            borderTop: `1px solid ${themeColors.colors.pink[200]}`,

            paddingTop: '1rem',

            opacity:
              isMobileMenuOpen ? 1 : 0,

            transition:
              'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',

            transitionDelay:
              isMobileMenuOpen
                ? '0.4s'
                : '0s',

            position: 'relative',
            zIndex: 10,

            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <DarkModeToggle
            checked={isDarkMode}
            onChange={toggleDarkMode}
          />
        </div>
      </div>

      {/* Locked Projects warning */}
      {showProjectWarning && (
        <div
          role="status"
          aria-live="polite"
          className="projects-locked-warning"
          style={{
            position: 'fixed',
            top: '92px',
            left: '50%',
            zIndex: 100001,

            width:
              'min(calc(100vw - 28px), 465px)',

            display: 'grid',

            gridTemplateColumns:
              'auto minmax(0, 1fr) auto',

            alignItems: 'center',
            gap: '0.8rem',

            padding: '0.85rem 0.9rem',

            transform:
              'translateX(-50%)',

            border: `1px solid ${
              isDarkMode
                ? 'rgba(215, 190, 235, 0.34)'
                : 'rgba(126, 91, 159, 0.42)'
            }`,

            borderRadius: '15px',

            background: isDarkMode
              ? `linear-gradient(
                  135deg,
                  rgba(31, 20, 42, 0.98),
                  rgba(47, 30, 61, 0.98)
                )`
              : `linear-gradient(
                  135deg,
                  rgba(252, 248, 255, 0.99),
                  rgba(235, 224, 248, 0.99)
                )`,

            color: isDarkMode
              ? '#f6eaff'
              : '#513a63',

            boxShadow: isDarkMode
              ? `
                0 18px 44px rgba(0, 0, 0, 0.34),
                0 0 28px rgba(183, 146, 215, 0.14)
              `
              : `
                0 16px 40px rgba(77, 50, 96, 0.18),
                inset 0 1px 0 rgba(255, 255, 255, 0.88)
              `,

            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter:
              'blur(20px)',
          }}
        >
          <span
            style={{
              width: '38px',
              height: '38px',

              display: 'grid',
              placeItems: 'center',

              flexShrink: 0,

              border: `1px solid ${
                isDarkMode
                  ? 'rgba(217, 192, 236, 0.34)'
                  : 'rgba(126, 91, 159, 0.42)'
              }`,

              borderRadius: '11px',

              background: isDarkMode
                ? 'rgba(190, 155, 220, 0.16)'
                : 'rgba(210, 190, 232, 0.42)',

              color: isDarkMode
                ? '#e4ccf3'
                : '#6d4f84',
            }}
          >
            <LockKeyhole
              size={18}
              aria-hidden="true"
            />
          </span>

          <span
            style={{
              minWidth: 0,
              display: 'grid',
              gap: '0.18rem',
              textAlign: 'left',
            }}
          >
            <strong
              style={{
                fontFamily:
                  'var(--font-code, "Space Mono", monospace)',

                fontSize: '0.76rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Projects locked
            </strong>

            <span
              style={{
                fontFamily:
                  'var(--font-body, "DM Mono", monospace)',

                fontSize: '0.72rem',
                lineHeight: 1.5,
                opacity: 0.84,
              }}
            >
              Complete ORIGINATE, ANALYSIS and EXECUTE
              to collect 300 XP and unlock
              Projects.
            </span>
          </span>

          <button
            type="button"
            onClick={hideProjectWarning}
            aria-label="Close Projects warning"
            style={{
              width: '32px',
              height: '32px',

              display: 'grid',
              placeItems: 'center',

              padding: 0,
              border: 0,
              borderRadius: '9px',

              background: 'transparent',
              color: 'inherit',
              cursor: 'pointer',
            }}
          >
            <X
              size={16}
              aria-hidden="true"
            />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
