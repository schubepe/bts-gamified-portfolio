import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEventHandler,
} from 'react';
import { createPortal } from 'react-dom';

import bookPhoto1 from '../../assets/book-photo-1.webp';
import bookPhoto2 from '../../assets/book-photo-2.webp';
import bookPhoto3 from '../../assets/book-photo-3.webp';

import './BloomingFlower.css';

interface BloomingFlowerProps {
  toolImages?: string[];
  onClick?: MouseEventHandler<HTMLButtonElement>;
  photoOne?: string;
  photoTwo?: string;
  photoThree?: string;
  aboutTitle?: string;
  aboutText?: string;
}

interface ToolTarget {
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

const DEFAULT_ABOUT_TITLE = 'A little about me';

const DEFAULT_ABOUT_TEXT = "hi, i'm your name! replace this text with a short introduction about what you make, how you work, and what you care about.";
const TOOL_TARGETS: ToolTarget[] = [
  { x: -300, y: -180, rotate: -12, scale: 0.92 },
  { x: -115, y: -250, rotate: -7, scale: 0.84 },
  { x: 120, y: -252, rotate: 7, scale: 0.84 },
  { x: 305, y: -175, rotate: 12, scale: 0.92 },
  { x: -345, y: 68, rotate: -10, scale: 0.84 },
  { x: 350, y: 70, rotate: 10, scale: 0.84 },
  { x: -170, y: 210, rotate: -7, scale: 0.78 },
  { x: 178, y: 210, rotate: 7, scale: 0.78 },
];

const clamp = (value: number) => Math.min(1, Math.max(0, value));

const lerp = (start: number, end: number, amount: number) =>
  start + (end - start) * amount;

const smoothstep = (value: number) =>
  value * value * (3 - 2 * value);

const BloomingFlower = ({
  toolImages = [],
  onClick,
  photoOne = bookPhoto1,
  photoTwo = bookPhoto2,
  photoThree = bookPhoto3,
  aboutTitle = DEFAULT_ABOUT_TITLE,
  aboutText = DEFAULT_ABOUT_TEXT,
}: BloomingFlowerProps) => {
  const sectionRef = useRef<HTMLElement>(null);

  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAboutClosing, setIsAboutClosing] = useState(false);

  const scrollPositionRef = useRef(0);
  const closeTimerRef = useRef<number | null>(null);
  const closingRef = useRef(false);

  const closeAbout = useCallback(() => {
    if (closingRef.current) {
      return;
    }

    closingRef.current = true;
    setIsAboutClosing(true);

    closeTimerRef.current = window.setTimeout(() => {
      setIsAboutOpen(false);
      setIsAboutClosing(false);

      closingRef.current = false;
      closeTimerRef.current = null;
    }, 280);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return;
    }

    const items = Array.from(
      section.querySelectorAll<HTMLElement>('.binder-art-item'),
    );

    let frameId: number | null = null;
    let stopTimer: number | null = null;
    let isNearViewport = false;
    let lastStep = -1;

    const render = () => {
      frameId = null;

      if (!isNearViewport) {
        return;
      }

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const start = viewportHeight * 0.86;
      const end = viewportHeight * 0.14;
      const rawProgress = (start - rect.top) / (start - end);
      const progress = Math.round(clamp(rawProgress) * 96) / 96;

      const step = Math.round(progress * 96);

      if (step === lastStep) {
        return;
      }

      lastStep = step;

      const open = smoothstep(progress);

      section.style.setProperty('--book-open', open.toString());

      section.style.setProperty(
        '--cover-angle',
        `${lerp(0, -176, open)}deg`,
      );

      section.style.setProperty(
        '--scene-x',
        `${lerp(0, 122, open)}px`,
      );

      section.style.setProperty(
        '--book-lift',
        `${lerp(22, -8, open)}px`,
      );

      section.style.setProperty(
        '--magic-opacity',
        `${lerp(0.01, 0.2, open)}`,
      );

      const artProgress = smoothstep(
        clamp((progress - 0.42) / 0.58),
      );

      const responsiveScale =
        window.innerWidth < 600
          ? 0.48
          : window.innerWidth < 900
            ? 0.71
            : 1;

      items.forEach((item, index) => {
        const target = TOOL_TARGETS[index];

        if (!target) {
          return;
        }

        const staggered = smoothstep(
          clamp((artProgress - index * 0.022) / 0.84),
        );

        const x = target.x * responsiveScale * staggered;
        const y = target.y * responsiveScale * staggered;
        const rotate = target.rotate * staggered;
        const scale = lerp(0.38, target.scale, staggered);

        item.style.opacity = `${staggered}`;

        item.style.transform =
          `translate3d(${x}px, ${y}px, 0) ` +
          `rotate(${rotate}deg) scale(${scale})`;
      });
    };

    const schedule = () => {
      section.classList.add('is-scrolling');

      if (stopTimer !== null) {
        window.clearTimeout(stopTimer);
      }

      stopTimer = window.setTimeout(() => {
        section.classList.remove('is-scrolling');
      }, 130);

      if (frameId === null) {
        frameId = window.requestAnimationFrame(render);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isNearViewport = entry.isIntersecting;

        if (isNearViewport) {
          schedule();
        }
      },
      {
        rootMargin: '40% 0px 40% 0px',
        threshold: 0,
      },
    );

    observer.observe(section);

    window.addEventListener('scroll', schedule, {
      passive: true,
    });

    window.addEventListener('resize', schedule, {
      passive: true,
    });

    schedule();

    return () => {
      observer.disconnect();

      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);

      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }

      if (stopTimer !== null) {
        window.clearTimeout(stopTimer);
      }
    };
  }, []);

  useEffect(() => {
    if (!isAboutOpen) {
      return;
    }

    const body = document.body;
    const html = document.documentElement;
    const savedScrollPosition = scrollPositionRef.current;

    const previousBodyStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };

    const previousHtmlStyles = {
      overflow: html.style.overflow,
      scrollBehavior: html.style.scrollBehavior,
    };

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    html.style.overflow = 'hidden';
    html.style.scrollBehavior = 'auto';

    body.style.position = 'fixed';
    body.style.top = `-${savedScrollPosition}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeAbout();
      }
    };

    window.addEventListener('keydown', closeWithEscape);

    return () => {
      body.style.position = previousBodyStyles.position;
      body.style.top = previousBodyStyles.top;
      body.style.left = previousBodyStyles.left;
      body.style.right = previousBodyStyles.right;
      body.style.width = previousBodyStyles.width;
      body.style.overflow = previousBodyStyles.overflow;
      body.style.paddingRight = previousBodyStyles.paddingRight;

      html.style.overflow = previousHtmlStyles.overflow;
      html.style.scrollBehavior = 'auto';

      window.removeEventListener('keydown', closeWithEscape);

      window.scrollTo(0, savedScrollPosition);

      window.requestAnimationFrame(() => {
        html.style.scrollBehavior =
          previousHtmlStyles.scrollBehavior;
      });
    };
  }, [isAboutOpen, closeAbout]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const handleBookClick: MouseEventHandler<HTMLButtonElement> = (
    event,
  ) => {
    event.preventDefault();

    scrollPositionRef.current = window.scrollY;
    closingRef.current = false;

    setIsAboutClosing(false);
    setIsAboutOpen(true);

    event.currentTarget.blur();
    onClick?.(event);
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="binder-book-section"
        aria-label="About me scrapbook"
      >
        <div
          className="binder-book-aura"
          aria-hidden="true"
        />

        <div
          className="binder-art-layer"
          aria-hidden="true"
        >
          {toolImages
            .slice(0, TOOL_TARGETS.length)
            .map((image, index) => (
              <span
                key={`${image}-${index}`}
                className="binder-art-item"
                style={
                  {
                    '--float-delay': `${index * -0.42}s`,
                  } as CSSProperties
                }
              >
                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
              </span>
            ))}
        </div>

        <button
          type="button"
          className="binder-book"
          onClick={handleBookClick}
          aria-label="Open the about me scrapbook"
        >
          <span className="binder-book__float">
            <span
              className="binder-book__shadow"
              aria-hidden="true"
            />

            <span className="binder-book__scene">
              <span
                className="binder-book__back-cover"
                aria-hidden="true"
              >
                <span className="binder-book__stitching" />

                <span className="binder-book__corner binder-book__corner--tl" />
                <span className="binder-book__corner binder-book__corner--tr" />
                <span className="binder-book__corner binder-book__corner--bl" />
                <span className="binder-book__corner binder-book__corner--br" />
              </span>

              <span
                className="binder-book__page-block"
                aria-hidden="true"
              >
                <span className="binder-book__page-edge" />
              </span>

              <span className="binder-book__right-page">
                <span className="binder-book__grid" />

                <span className="binder-book__page-heading">
                  {aboutTitle}
                </span>

                <span className="binder-book__about-copy">
                  {aboutText}
                </span>

                <span className="binder-book__portrait binder-book__portrait--right">
                  <img
                    src={photoThree}
                    alt=""
                    draggable={false}
                  />

                  <span className="binder-book__photo-tape" />
                </span>

                <span
                  className="binder-book__badge"
                  aria-hidden="true"
                >
                  HELLO!
                </span>

                <span
                  className="binder-book__tiny-doodles"
                  aria-hidden="true"
                >
                  ✦ ☘︎ ✿
                </span>

                <span
                  className="binder-book__tabs"
                  aria-hidden="true"
                >
                  <span className="binder-book__tab binder-book__tab--coral" />
                  <span className="binder-book__tab binder-book__tab--gold" />
                  <span className="binder-book__tab binder-book__tab--green" />
                  <span className="binder-book__tab binder-book__tab--blue" />
                  <span className="binder-book__tab binder-book__tab--pink" />
                </span>
              </span>

              <span
                className="binder-book__front-cover"
                aria-hidden="true"
              >
                <span className="binder-book__face binder-book__face--cover">
                  <span className="binder-book__stitching" />

                  <span className="binder-book__corner binder-book__corner--tl" />
                  <span className="binder-book__corner binder-book__corner--tr" />
                  <span className="binder-book__corner binder-book__corner--bl" />
                  <span className="binder-book__corner binder-book__corner--br" />

                  <span className="binder-book__cover-title">
                    YOUR FIELD NOTES
                  </span>

                  <span
                    className="binder-book__fox-medallion"
                    aria-hidden="true"
                  >
                    <span className="binder-book__fox-wreath">
                      <i className="binder-book__wreath-leaf binder-book__wreath-leaf--one" />
                      <i className="binder-book__wreath-leaf binder-book__wreath-leaf--two" />
                      <i className="binder-book__wreath-leaf binder-book__wreath-leaf--three" />
                      <i className="binder-book__wreath-leaf binder-book__wreath-leaf--four" />

                      <b className="binder-book__wreath-flower binder-book__wreath-flower--one" />
                      <b className="binder-book__wreath-flower binder-book__wreath-flower--two" />
                      <b className="binder-book__wreath-flower binder-book__wreath-flower--three" />
                      <b className="binder-book__wreath-flower binder-book__wreath-flower--four" />
                    </span>

                    <span className="binder-book__fox-body" />

                    <span className="binder-book__fox-tail">
                      <span />
                    </span>

                    <span className="binder-book__fox-head">
                      <i className="binder-book__fox-ear binder-book__fox-ear--left" />
                      <i className="binder-book__fox-ear binder-book__fox-ear--right" />

                      <span className="binder-book__fox-face-marking" />

                      <span className="binder-book__fox-eye binder-book__fox-eye--left" />
                      <span className="binder-book__fox-eye binder-book__fox-eye--right" />

                      <span className="binder-book__fox-nose" />
                    </span>

                    <span className="binder-book__fox-sparkle binder-book__fox-sparkle--one" />
                    <span className="binder-book__fox-sparkle binder-book__fox-sparkle--two" />
                  </span>

                  <span className="binder-book__strap">
                    <span />
                  </span>
                </span>

                <span className="binder-book__face binder-book__face--inside">
                  <span className="binder-book__grid" />

                  <span className="binder-book__portrait binder-book__portrait--left-main">
                    <img
                      src={photoOne}
                      alt=""
                      draggable={false}
                    />

                    <span className="binder-book__photo-tape" />
                  </span>

                  <span className="binder-book__portrait binder-book__portrait--left-small">
                    <img
                      src={photoTwo}
                      alt=""
                      draggable={false}
                    />

                    <span className="binder-book__photo-tape" />
                  </span>

                  <span className="binder-book__note">
                    FORM
                    <br />
                    CODE
                    <br />
                    STORY
                  </span>

                  <span
                    className="binder-book__stamp"
                    aria-hidden="true"
                  >
                    MADE
                    <br />
                    WITH
                    <br />
                    CURIOSITY
                  </span>
                </span>
              </span>

              <span
                className="binder-book__rings"
                aria-hidden="true"
              >
                {Array.from({ length: 6 }, (_, index) => (
                  <span key={index}>
                    <i />
                  </span>
                ))}
              </span>

              <span
                className="binder-book__magic"
                aria-hidden="true"
              />
            </span>
          </span>
        </button>
      </section>

      {isAboutOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className={`scrapbook-modal ${
              isAboutClosing
                ? 'is-closing'
                : 'is-opening'
            }`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="scrapbook-modal-title"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeAbout();
              }
            }}
          >
            <div className="scrapbook-modal__motion">
              <div
                className="scrapbook-modal__paper"
                onMouseDown={(event) =>
                  event.stopPropagation()
                }
              >
                <button
                  type="button"
                  className="scrapbook-modal__close"
                  onClick={closeAbout}
                  aria-label="Close about me"
                >
                  ×
                </button>

                <div className="scrapbook-modal__photos">
                  <figure className="scrapbook-modal__photo scrapbook-modal__photo--one">
                    <span
                      className="scrapbook-modal__tape"
                      aria-hidden="true"
                    />

                    <img
                      src={photoOne}
                      alt="Profile portrait one"
                    />
                  </figure>

                  <figure className="scrapbook-modal__photo scrapbook-modal__photo--two">
                    <span
                      className="scrapbook-modal__tape"
                      aria-hidden="true"
                    />

                    <img
                      src={photoTwo}
                      alt="Profile portrait two"
                    />
                  </figure>
                </div>

                <div className="scrapbook-modal__writing">
                  <span className="scrapbook-modal__eyebrow">
                    ABOUT ME
                  </span>

                  <h2 id="scrapbook-modal-title">
                    {aboutTitle}
                  </h2>

                  <p>{aboutText}</p>

                  <span
                    className="scrapbook-modal__doodle"
                    aria-hidden="true"
                  >
                    ✿ ･ﾟ✧ ☘︎
                  </span>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

export default BloomingFlower;
