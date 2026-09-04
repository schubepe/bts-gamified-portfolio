import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { useDarkMode } from "../../contexts/DarkModeContext";

import profile1 from "../../assets/photo_1.jpg";
import profile2 from "../../assets/photo_2.jpg";
import profile3 from "../../assets/photo_3.jpg";

import cassetteImage from "../../assets/magic-shop/cassette.svg";
import codeMark from "../../assets/magic-shop/code-mark.svg";

import "./MagicShopPalette.css";
import "./CassetteAbout.css";

interface CassetteAboutProps {
  title?: string;
  lines?: string[];
  photos?: string[];
}

interface Position {
  x: number;
  y: number;
}

const DEFAULT_LINES = [
  "hey, i'm your name! i love making ideas tangible",
  'i like turning a sketch into something you can hold, wear, or click through',
  'i work across 3d design, code, and fashion, mostly because i have never been able to pick just one, and honestly, the best ideas usually need all three anyway',
];

const DEFAULT_PHOTOS = [
  profile1,
  profile2,
  profile3,
];

const START_POSITION: Position = {
  x: 17,
  y: 76,
};

/*
 * The file already lives inside public/audio, so its browser path
 * begins at /audio rather than /public/audio.
 */
// Add an audio file in public/audio and set its path here, or leave blank.
const AUDIO_SOURCE = "/Audio/track_1.mp3";

/*
 * Change these two numbers to choose the exact part of the track.
 * This example plays the first 30 seconds.
 */
const AUDIO_START_SECONDS = 0;
const AUDIO_END_SECONDS = 29;

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
) => Math.min(maximum, Math.max(minimum, value));

const CassetteAbout = ({
  title = "Meet Perlita",
  lines = DEFAULT_LINES,
  photos = DEFAULT_PHOTOS,
}: CassetteAboutProps) => {
  const { isDarkMode } = useDarkMode();

  const stageRef = useRef<HTMLDivElement>(null);
  const cassetteRef = useRef<HTMLButtonElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const pointerIdRef = useRef<number | null>(null);
  const pointerOffsetRef = useRef({
    x: 0,
    y: 0,
  });
  const pointerStartRef = useRef({
    x: 0,
    y: 0,
  });
  const draggedRef = useRef(false);

  const [position, setPosition] =
    useState<Position>(START_POSITION);

  const [isDragging, setIsDragging] =
    useState(false);

  const [isInserted, setIsInserted] =
    useState(false);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [visibleLines, setVisibleLines] =
    useState(0);

  const [isDropReady, setIsDropReady] =
    useState(false);

  const [activePhotoIndex, setActivePhotoIndex] =
    useState(0);

  const safePhotos = useMemo(
    () => photos.filter(Boolean),
    [photos],
  );

  useEffect(() => {
    if (
      !isPlaying
      || !isInserted
      || visibleLines >= lines.length
    ) {
      return;
    }

    const timer = window.setTimeout(() => {
      setVisibleLines((current) =>
        Math.min(lines.length, current + 1),
      );
    }, visibleLines === 0 ? 380 : 1100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [
    isInserted,
    isPlaying,
    lines.length,
    visibleLines,
  ]);

  /*
   * Change the displayed photo naturally as each About line
   * appears. Visitors can also click a photo dot manually.
   */
  useEffect(() => {
    if (
      !isInserted
      || safePhotos.length === 0
      || visibleLines === 0
    ) {
      return;
    }

    setActivePhotoIndex(
      (visibleLines - 1) % safePhotos.length,
    );
  }, [
    isInserted,
    safePhotos.length,
    visibleLines,
  ]);

  const getSlotPosition = useCallback(
    (): Position => {
      const stage = stageRef.current;
      const slot = slotRef.current;

      if (
        !stage
        || !slot
        || stage.clientWidth === 0
        || stage.clientHeight === 0
      ) {
        return {
          x: 50,
          y: 20,
        };
      }

      const stageRect =
        stage.getBoundingClientRect();

      const slotRect =
        slot.getBoundingClientRect();

      return {
        x:
          (
            slotRect.left
            + slotRect.width / 2
            - stageRect.left
          )
          / stageRect.width
          * 100,

        y:
          (
            slotRect.top
            + slotRect.height / 2
            - stageRect.top
          )
          / stageRect.height
          * 100,
      };
    },
    [],
  );

  const cassetteOverlapsSlot =
    useCallback(() => {
      const cassette =
        cassetteRef.current;

      const slot =
        slotRef.current;

      if (!cassette || !slot) {
        return false;
      }

      const cassetteRect =
        cassette.getBoundingClientRect();

      const slotRect =
        slot.getBoundingClientRect();

      const overlapWidth = Math.max(
        0,
        Math.min(
          cassetteRect.right,
          slotRect.right + 34,
        )
        - Math.max(
          cassetteRect.left,
          slotRect.left - 34,
        ),
      );

      const overlapHeight = Math.max(
        0,
        Math.min(
          cassetteRect.bottom,
          slotRect.bottom + 34,
        )
        - Math.max(
          cassetteRect.top,
          slotRect.top - 34,
        ),
      );

      const overlapArea =
        overlapWidth * overlapHeight;

      const cassetteArea =
        cassetteRect.width
        * cassetteRect.height;

      return (
        cassetteArea > 0
        && overlapArea / cassetteArea >= 0.18
      );
    }, []);

  const pointerIsOverSlot = useCallback(
    (
      clientX: number,
      clientY: number,
    ) => {
      const slot = slotRef.current;

      if (!slot) {
        return false;
      }

      const slotRect =
        slot.getBoundingClientRect();

      return (
        clientX >= slotRect.left - 48
        && clientX <= slotRect.right + 48
        && clientY >= slotRect.top - 48
        && clientY <= slotRect.bottom + 48
      );
    },
    [],
  );

  const startTrack = useCallback(
    async (
      restartFromBeginning = false,
    ) => {
      const audio = audioRef.current;

      if (!AUDIO_SOURCE) {
        setIsPlaying(true);
        return;
      }

      if (!audio) {
        return;
      }

      /*
       * Restart when the cassette is first inserted or when the
       * selected audio section has already finished.
       */
      if (
        restartFromBeginning
        || audio.currentTime < AUDIO_START_SECONDS
        || audio.currentTime >= AUDIO_END_SECONDS
      ) {
        try {
          audio.currentTime =
            AUDIO_START_SECONDS;
        } catch {
          /*
           * The metadata may still be loading. Starting at zero
           * is always safe, and the loadedmetadata handler below
           * will correct non-zero start times.
           */
        }
      }

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        /*
         * Browsers can reject playback if it was not triggered
         * by a user action. Dragging or clicking the cassette
         * normally counts as the required user action.
         */
        console.error(
          "Could not play cassette audio:",
          error,
        );

        setIsPlaying(false);
      }
    },
    [],
  );

  const pauseTrack = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    setIsPlaying(false);
  }, []);

  const resetTrack = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();

    try {
      audio.currentTime =
        AUDIO_START_SECONDS;
    } catch {
      // The metadata has not loaded yet.
    }

    setIsPlaying(false);
  }, []);

  const insertCassette = useCallback(() => {
    setPosition(getSlotPosition());
    setIsDropReady(false);
    setIsDragging(false);
    setIsInserted(true);
    setVisibleLines(0);
    setActivePhotoIndex(0);

    /*
     * This is called directly from the visitor's drag/click
     * interaction, which allows the browser to start audio.
     */
    void startTrack(true);
  }, [
    getSlotPosition,
    startTrack,
  ]);

  const ejectCassette = useCallback(() => {
    resetTrack();

    setIsInserted(false);
    setVisibleLines(0);
    setIsDropReady(false);
    setActivePhotoIndex(0);
    setPosition(START_POSITION);
  }, [resetTrack]);

  const togglePlayback = useCallback(() => {
    if (!isInserted) {
      return;
    }

    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (audio.paused) {
      void startTrack(false);
    } else {
      pauseTrack();
    }
  }, [
    isInserted,
    pauseTrack,
    startTrack,
  ]);

  /*
   * Keep the React UI synchronized with the real audio element
   * and stop playback at AUDIO_END_SECONDS.
   */
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    const handleLoadedMetadata = () => {
      if (AUDIO_START_SECONDS > 0) {
        audio.currentTime =
          Math.min(
            AUDIO_START_SECONDS,
            Math.max(
              0,
              audio.duration - 0.05,
            ),
          );
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

        const handleTimeUpdate = () => {
      if (
        audio.currentTime
        >= AUDIO_END_SECONDS
      ) {
        try {
          audio.currentTime =
            AUDIO_START_SECONDS;
          audio.play();
        } catch {
          // Ignore a seek error while metadata is changing.
        }
      }
  
    };

    audio.addEventListener(
      "loadedmetadata",
      handleLoadedMetadata,
    );

    audio.addEventListener(
      "play",
      handlePlay,
    );

    audio.addEventListener(
      "pause",
      handlePause,
    );

    audio.addEventListener(
      "ended",
      handlePause,
    );

    audio.addEventListener(
      "timeupdate",
      handleTimeUpdate,
    );

    return () => {
      audio.pause();

      audio.removeEventListener(
        "loadedmetadata",
        handleLoadedMetadata,
      );

      audio.removeEventListener(
        "play",
        handlePlay,
      );

      audio.removeEventListener(
        "pause",
        handlePause,
      );

      audio.removeEventListener(
        "ended",
        handlePause,
      );

      audio.removeEventListener(
        "timeupdate",
        handleTimeUpdate,
      );
    };
  }, [lines.length]);

  const updatePosition = useCallback(
    (
      clientX: number,
      clientY: number,
    ) => {
      const stage = stageRef.current;
      const cassette =
        cassetteRef.current;

      if (!stage || !cassette) {
        return;
      }

      const stageRect =
        stage.getBoundingClientRect();

      const cassetteRect =
        cassette.getBoundingClientRect();

      const left =
        clientX
        - stageRect.left
        - pointerOffsetRef.current.x;

      const top =
        clientY
        - stageRect.top
        - pointerOffsetRef.current.y;

      const x =
        (
          left
          + cassetteRect.width / 2
        )
        / stageRect.width
        * 100;

      const y =
        (
          top
          + cassetteRect.height / 2
        )
        / stageRect.height
        * 100;

      setPosition({
        x: clamp(x, 7, 93),
        y: clamp(y, 10, 90),
      });

      setIsDropReady(
        pointerIsOverSlot(
          clientX,
          clientY,
        ),
      );
    },
    [pointerIsOverSlot],
  );

  const finishDrag = useCallback(
    (shouldInsert: boolean) => {
      if (!isDragging || isInserted) {
        return;
      }

      setIsDragging(false);
      setIsDropReady(false);
      pointerIdRef.current = null;

      if (shouldInsert) {
        insertCassette();
      } else {
        setPosition(START_POSITION);
      }
    },
    [
      insertCassette,
      isDragging,
      isInserted,
    ],
  );

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const onPointerMove = (
      event: PointerEvent,
    ) => {
      if (
        pointerIdRef.current
        !== event.pointerId
      ) {
        return;
      }

      const moved =
        Math.abs(
          event.clientX
          - pointerStartRef.current.x,
        ) > 3
        || Math.abs(
          event.clientY
          - pointerStartRef.current.y,
        ) > 3;

      if (moved) {
        draggedRef.current = true;
      }

      updatePosition(
        event.clientX,
        event.clientY,
      );
    };

    const onPointerUp = (
      event: PointerEvent,
    ) => {
      if (
        pointerIdRef.current
        !== event.pointerId
      ) {
        return;
      }

      const shouldInsert =
        pointerIsOverSlot(
          event.clientX,
          event.clientY,
        )
        || cassetteOverlapsSlot();

      finishDrag(shouldInsert);
    };

    window.addEventListener(
      "pointermove",
      onPointerMove,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "pointerup",
      onPointerUp,
    );

    window.addEventListener(
      "pointercancel",
      onPointerUp,
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        onPointerMove,
      );

      window.removeEventListener(
        "pointerup",
        onPointerUp,
      );

      window.removeEventListener(
        "pointercancel",
        onPointerUp,
      );
    };
  }, [
    cassetteOverlapsSlot,
    finishDrag,
    isDragging,
    pointerIsOverSlot,
    updatePosition,
  ]);

  useEffect(() => {
    if (!isInserted) {
      return;
    }

    const alignToSlot = () => {
      setPosition(getSlotPosition());
    };

    const frame =
      window.requestAnimationFrame(
        alignToSlot,
      );

    window.addEventListener(
      "resize",
      alignToSlot,
    );

    return () => {
      window.cancelAnimationFrame(frame);

      window.removeEventListener(
        "resize",
        alignToSlot,
      );
    };
  }, [
    getSlotPosition,
    isInserted,
  ]);

  const handlePointerDown = (
    event:
      ReactPointerEvent<HTMLButtonElement>,
  ) => {
    if (isInserted) {
      return;
    }

    const cassette =
      cassetteRef.current;

    if (!cassette) {
      return;
    }

    event.preventDefault();

    const cassetteRect =
      cassette.getBoundingClientRect();

    pointerIdRef.current =
      event.pointerId;

    pointerOffsetRef.current = {
      x:
        event.clientX
        - cassetteRect.left,

      y:
        event.clientY
        - cassetteRect.top,
    };

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    draggedRef.current = false;
    setIsDragging(true);
  };

  const handleCassetteClick = () => {
    /*
     * Keyboard/click fallback.
     * A real drag uses the global listeners above.
     */
    if (
      !isInserted
      && !draggedRef.current
    ) {
      insertCassette();
    }

    draggedRef.current = false;
  };

  return (
    <section
      className={`cassette-about ${
        isDarkMode
          ? "is-dark"
          : "is-light"
      }`}
      aria-labelledby="cassette-about-title"
    >
      {AUDIO_SOURCE && (
        <audio ref={audioRef} src={AUDIO_SOURCE} preload="auto" />
      )}

      <div className="cassette-about__shell">
        <header className="cassette-about__heading">
          <span>
            MAGIC_SHOP.TRACK_01
          </span>

          <h2 id="cassette-about-title">
            About me, now playing.
          </h2>

          <p>
            Drag the cassette into the
            player to start the track.
          </p>
        </header>

        <div
          ref={stageRef}
          className="cassette-about__stage"
        >
          <div
            className="cassette-about__player"
            aria-label="Cassette player"
          >
            <div className="cassette-about__player-topbar">
              <span>
                YOUR MAGIC SHOP
              </span>

              <span>
                {isPlaying
                  ? "PLAYING"
                  : "STANDBY"}
              </span>
            </div>

            <div
              ref={slotRef}
              className={`cassette-about__slot ${
                isInserted
                  ? "is-loaded"
                  : ""
              } ${
                isDropReady
                  ? "is-drop-ready"
                  : ""
              }`}
            >
              <span>
                {isInserted
                  ? "TAPE LOADED"
                  : "DROP TAPE HERE"}
              </span>

              <i aria-hidden="true" />
            </div>

            <div className="cassette-about__display">
              <div className="cassette-about__display-title">
                <img
                  src={codeMark}
                  alt=""
                  aria-hidden="true"
                />

                <div>
                  <span>NOW PLAYING</span>
                  <strong>{title}</strong>
                </div>
              </div>

              <div className="cassette-about__content">
                <div
                  className="cassette-about__lyrics"
                  aria-live="polite"
                >
                  {lines.map(
                    (line, index) => (
                      <p
                        key={`${line}-${index}`}
                        className={
                          index < visibleLines
                            ? "is-visible"
                            : ""
                        }
                      >
                        <span>
                          {String(
                            index + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        {line}
                      </p>
                    ),
                  )}

                  {!isInserted && (
                    <div className="cassette-about__waiting">
                      INSERT CASSETTE TO
                      READ TRACK
                    </div>
                  )}
                </div>

                <aside
                  className={`cassette-about__photos ${
                    isInserted
                      ? "is-visible"
                      : ""
                  }`}
                  aria-label="Profile photos"
                >
                  {safePhotos.length > 0 ? (
                    <>
                      <div className="cassette-about__photo-frame">
                        <span>
                          PHOTO{" "}
                          {String(
                            activePhotoIndex + 1,
                          ).padStart(
                            2,
                            "0",
                          )}
                        </span>

                        <img
                          src={
                            safePhotos[
                              activePhotoIndex
                            ]
                          }
                          alt={`Profile photo ${
                            activePhotoIndex + 1
                          }`}
                        />
                      </div>

                      <div className="cassette-about__photo-controls">
                        {safePhotos.map(
                          (
                            photo,
                            index,
                          ) => (
                            <button
                              key={`${photo}-${index}`}
                              type="button"
                              className={
                                index
                                === activePhotoIndex
                                  ? "is-active"
                                  : ""
                              }
                              onClick={() => {
                                setActivePhotoIndex(
                                  index,
                                );
                              }}
                              aria-label={`Show photo ${
                                index + 1
                              }`}
                              aria-pressed={
                                index
                                === activePhotoIndex
                              }
                            >
                              <img
                                src={photo}
                                alt=""
                                aria-hidden="true"
                              />
                            </button>
                          ),
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="cassette-about__photo-empty">
                      ADD YOUR PHOTOS
                    </div>
                  )}
                </aside>
              </div>

              <div className="cassette-about__transport">
                <button
                  type="button"
                  onClick={togglePlayback}
                  disabled={!isInserted}
                >
                  {isPlaying
                    ? "PAUSE"
                    : "PLAY"}
                </button>

                <button
                  type="button"
                  onClick={ejectCassette}
                  disabled={!isInserted}
                >
                  EJECT
                </button>

                <div
                  className="cassette-about__equalizer"
                  aria-hidden="true"
                >
                  {Array.from({
                    length: 8,
                  }).map(
                    (_, index) => (
                      <i
                        key={index}
                        className={
                          isPlaying
                            ? "is-playing"
                            : ""
                        }
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            ref={cassetteRef}
            type="button"
            className={`cassette-about__tape ${
              isDragging
                ? "is-dragging"
                : ""
            } ${
              isInserted
                ? "is-inserted"
                : ""
            }`}
            style={
              {
                "--cassette-x":
                  `${position.x}%`,

                "--cassette-y":
                  `${position.y}%`,
              } as CSSProperties
            }
            onPointerDown={
              handlePointerDown
            }
            onClick={
              handleCassetteClick
            }
            aria-label={
              isInserted
                ? "Cassette is inserted and playing"
                : "Drag cassette to the player"
            }
          >
            <img
              src={cassetteImage}
              alt="Pastel purple cassette tape"
              draggable={false}
            />

            <span>
              {isInserted
                ? "NOW PLAYING"
                : "DRAG TO PLAYER"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default CassetteAbout;
