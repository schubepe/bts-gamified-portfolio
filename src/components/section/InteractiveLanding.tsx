import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import "./InteractiveLanding.css";
import "./InteractiveLandingMagicObjects.css";

import armyBombArtifact from "../../assets/magic-shop/army-bomb.svg";
import codeMark from "../../assets/magic-shop/code-mark.svg";
import cassetteArtifact from "../../assets/magic-shop/cassette.svg";
import shopFamiliarDolphin from "../../assets/magic-shop/shop-familiar-dolphin.png";

type ModuleId = "form" | "code" | "story";

interface InteractiveLandingProps {
  asciiArt: string;
}

interface SkillModule {
  id: ModuleId;
  number: string;
  title: string;
  objectName: string;
  homeName: string;
  summary: string;
  proof: string;
  tools: string[];
  accent: string;
}

interface Position {
  x: number;
  y: number;
}

type Positions = Record<ModuleId, Position>;

const ArtifactArtwork = ({ id }: { id: ModuleId }) => (
  <span className="pixel-object-art magic-shop-object-art" aria-hidden="true">
    {id === "form" && (
      <img
        className="magic-shop-object-image magic-shop-object-image-form"
        src={armyBombArtifact}
        alt=""
        draggable={false}
      />
    )}

    {id === "code" && (
      <span className="magic-shop-code-screen">
        <span className="magic-shop-code-screen__bar">
          <i />
          <i />
          <i />
        </span>
        <span className="magic-shop-code-screen__display">
          <img src={codeMark} alt="" draggable={false} />
        </span>
        <span className="magic-shop-code-screen__base" />
      </span>
    )}

    {id === "story" && (
      <img
        className="magic-shop-object-image magic-shop-object-image-story"
        src={cassetteArtifact}
        alt=""
        draggable={false}
      />
    )}
  </span>
);

const MODULES: SkillModule[] = [
  {
    id: "form",
    number: "01",
    title: "ORIGINATE",
    objectName: "LIGHT STICK",
    homeName: "ORIGINATE STATION",
    summary:
      "I map deal ecosystems and build stakeholder networks to surface opportunities early.",
    proof:
      "M&A ecosystem mapping · 20+ stakeholder interviews · PwC partnership validation · AWS CPG vertical",
    tools: ["Stakeholder Mapping", "Market Sizing", "Partner Strategy", "Deal Sourcing"],
    accent: "#b99ade",
  },
  {
    id: "code",
    number: "02",
    title: "ANALYSIS",
    objectName: "CODE SCREEN",
    homeName: "ANALYSIS STATION",
    summary:
      "I turn raw financial and market data into decision-ready insight.",
    proof:
      "300 transactions/week reconciliation · bottom-up pipeline sizing · M&A playbook · CPG vertical model",
    tools: ["Financial Analysis", "Pipeline Modeling", "Excel", "Data Reconciliation"],
    accent: "#aebcf0",
  },
  {
    id: "story",
    number: "03",
    title: "EXECUTE",
    objectName: "CASSETTE TAPE",
    homeName: "EXECUTE STATION",
    summary:
      "I convert frameworks into deployed tools that measurably change how people work.",
    proof:
      "Power Automate pilot · AI competitive-intelligence agent · 50+ hrs/analyst saved · ~50% prep time reduction",
    tools: ["Power Automate", "AI-Assisted Development", "Prompt Engineering", "Process Design"],
    accent: "#8f72bb",
  },
];

const INITIAL_POSITIONS: Positions = {
  // The three artifacts begin on the shop's display shelf.
  // Their matching FORM, CODE and STORY stations are all below.
  form: { x: 16, y: 32 },
  code: { x: 50, y: 32 },
  story: { x: 84, y: 32 },
};

// Fallback positions used before the DOM measurements are available.
// The live placement function below calculates the true centre of each house.
const HOME_POSITIONS: Positions = {
  form: { x: 16.5, y: 76 },
  code: { x: 50, y: 76 },
  story: { x: 83.5, y: 76 },
};

const STORAGE_KEY = "portfolio-magic-shop-quest-v1";
const LEGACY_STORAGE_KEYS = [
  "portfolio-magic-shop-quest-v0",
];

const PROJECT_LINK_SELECTOR = [
  'a[href="#projects"]',
  'a[href="/projects"]',
  'a[href$="/projects"]',
  '[data-section="projects"]',
  '[data-target="projects"]',
].join(",");

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const InteractiveLanding = ({ asciiArt }: InteractiveLandingProps) => {
  // Start clean on every page load while the game is still being refined.
  // This prevents an old saved artifact from appearing inside a room.
  const [completed, setCompleted] = useState<ModuleId[]>([]);

  const [positions, setPositions] = useState<Positions>({
    form: { ...INITIAL_POSITIONS.form },
    code: { ...INITIAL_POSITIONS.code },
    story: { ...INITIAL_POSITIONS.story },
  });

  const [selectedId, setSelectedId] = useState<ModuleId | null>(null);

  const [carriedId, setCarriedId] = useState<ModuleId | null>(null);
  const [draggingId, setDraggingId] = useState<ModuleId | null>(null);
  const [hoveredHomeId, setHoveredHomeId] = useState<ModuleId | null>(null);
  const [rewardId, setRewardId] = useState<ModuleId | null>(null);
  const [wrongDropId, setWrongDropId] = useState<ModuleId | null>(null);
  const [gateNudge, setGateNudge] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);

  const homeRefs = useRef<Record<ModuleId, HTMLButtonElement | null>>({
    form: null,
    code: null,
    story: null,
  });

  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const pointerStartRef = useRef({ x: 0, y: 0 });
  const dragMovedRef = useRef(false);

  const rewardTimerRef = useRef<number | null>(null);
  const wrongDropTimerRef = useRef<number | null>(null);
  const gateTimerRef = useRef<number | null>(null);
  const alignmentFrameRef = useRef<number | null>(null);

  const progress = completed.length;
  const xp = progress * 100;
  const isComplete = progress === MODULES.length;

  const selectedModule = useMemo(
    () => MODULES.find((module) => module.id === selectedId) ?? null,
    [selectedId],
  );

  const progressMessage = useMemo(() => {
    if (isComplete) return "EUPHORIA COLLECTION COMPLETE // PROJECT PORTAL OPEN";
    if (progress === 0) return "RETURN EACH ARTIFACT TO ITS MATCHING STATION";

    return `${MODULES.length - progress} ARTIFACT${
      MODULES.length - progress === 1 ? "" : "S"
    } LEFT TO RETURN`;
  }, [isComplete, progress]);

  const getHomeAnchorPosition = useCallback((id: ModuleId): Position => {
    const stage = stageRef.current;
    const home = homeRefs.current[id];

    if (
      !stage ||
      !home ||
      stage.clientWidth === 0 ||
      stage.clientHeight === 0
    ) {
      return HOME_POSITIONS[id];
    }

    const homeBody = home.querySelector<HTMLElement>(".pixel-home-body");

    // Centre the placed card on the visible house body, not on the
    // entire button area that also contains the title and status label.
    const centreX = home.offsetLeft + home.offsetWidth / 2;
    const centreY = homeBody
      ? home.offsetTop + homeBody.offsetTop + homeBody.offsetHeight / 2
      : home.offsetTop + home.offsetHeight / 2;

    return {
      x: clamp((centreX / stage.clientWidth) * 100, 0, 100),
      y: clamp((centreY / stage.clientHeight) * 100, 0, 100),
    };
  }, []);

  const triggerReward = (id: ModuleId) => {
    setRewardId(id);

    if (rewardTimerRef.current !== null) {
      window.clearTimeout(rewardTimerRef.current);
    }

    rewardTimerRef.current = window.setTimeout(() => {
      setRewardId(null);
      rewardTimerRef.current = null;
    }, 1050);
  };

  const placeModule = (id: ModuleId) => {
    setCompleted((current) => {
      if (current.includes(id)) return current;

      triggerReward(id);
      return [...current, id];
    });

    const centredPosition = getHomeAnchorPosition(id);

    setPositions((current) => ({
      ...current,
      [id]: centredPosition,
    }));

    setSelectedId(id);
    setCarriedId(null);
  };

  const resetModulePosition = (id: ModuleId) => {
    setPositions((current) => ({
      ...current,
      [id]: INITIAL_POSITIONS[id],
    }));

    setWrongDropId(id);

    if (wrongDropTimerRef.current !== null) {
      window.clearTimeout(wrongDropTimerRef.current);
    }

    wrongDropTimerRef.current = window.setTimeout(() => {
      setWrongDropId(null);
      wrongDropTimerRef.current = null;
    }, 620);
  };

  const resetQuest = () => {
    if (rewardTimerRef.current !== null) {
      window.clearTimeout(rewardTimerRef.current);
      rewardTimerRef.current = null;
    }

    if (wrongDropTimerRef.current !== null) {
      window.clearTimeout(wrongDropTimerRef.current);
      wrongDropTimerRef.current = null;
    }

    if (gateTimerRef.current !== null) {
      window.clearTimeout(gateTimerRef.current);
      gateTimerRef.current = null;
    }

    if (alignmentFrameRef.current !== null) {
      window.cancelAnimationFrame(alignmentFrameRef.current);
      alignmentFrameRef.current = null;
    }

    setCompleted([]);
    setPositions({
      form: { ...INITIAL_POSITIONS.form },
      code: { ...INITIAL_POSITIONS.code },
      story: { ...INITIAL_POSITIONS.story },
    });
    setSelectedId(null);
    setCarriedId(null);
    setDraggingId(null);
    setHoveredHomeId(null);
    setRewardId(null);
    setWrongDropId(null);
    setGateNudge(false);

    dragMovedRef.current = false;
    dragOffsetRef.current = { x: 0, y: 0 };
    pointerStartRef.current = { x: 0, y: 0 };

    const stage = stageRef.current;

    if (stage) {
      stage.style.setProperty("--scene-far-x", "0px");
      stage.style.setProperty("--scene-far-y", "0px");
      stage.style.setProperty("--scene-mid-x", "0px");
      stage.style.setProperty("--scene-mid-y", "0px");
      stage.style.setProperty("--scene-near-x", "0px");
      stage.style.setProperty("--scene-near-y", "0px");
      stage.style.setProperty("--scene-light-x", "0px");
      stage.style.setProperty("--scene-light-y", "0px");
    }

    [...LEGACY_STORAGE_KEYS, STORAGE_KEY].forEach((key) =>
      window.sessionStorage.removeItem(key),
    );
  };

  useEffect(() => {
    const alignCompletedObjects = () => {
      if (completed.length === 0) return;

      setPositions((current) => {
        const next = { ...current };

        completed.forEach((id) => {
          next[id] = getHomeAnchorPosition(id);
        });

        return next;
      });
    };

    // Measure after layout, then repeat if the window size changes.
    alignmentFrameRef.current = window.requestAnimationFrame(() => {
      alignCompletedObjects();
      alignmentFrameRef.current = null;
    });
    window.addEventListener("resize", alignCompletedObjects);

    return () => {
      if (alignmentFrameRef.current !== null) {
        window.cancelAnimationFrame(alignmentFrameRef.current);
        alignmentFrameRef.current = null;
      }
      window.removeEventListener("resize", alignCompletedObjects);
    };
  }, [completed, getHomeAnchorPosition]);

  useEffect(() => {
    // Remove every older saved quest state once on mount. Progress intentionally
    // does not persist yet, so RESET and refresh always return all artifacts.
    [...LEGACY_STORAGE_KEYS, STORAGE_KEY].forEach((key) =>
      window.sessionStorage.removeItem(key),
    );
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const projectsSection = document.querySelector<HTMLElement>("#projects");

    root.classList.toggle("portfolio-projects-locked", !isComplete);
    root.classList.toggle("portfolio-projects-unlocked", isComplete);

    if (projectsSection) {
      if (isComplete) {
        projectsSection.removeAttribute("inert");
        projectsSection.removeAttribute("aria-hidden");
      } else {
        projectsSection.setAttribute("inert", "");
        projectsSection.setAttribute("aria-hidden", "true");
      }
    }

    const stopLockedProjectNavigation = (event: MouseEvent) => {
      if (isComplete) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const projectTrigger = target.closest(PROJECT_LINK_SELECTOR);
      if (!projectTrigger) return;

      event.preventDefault();
      event.stopPropagation();

      document.querySelector(".pixel-garden-game")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      setGateNudge(true);

      if (gateTimerRef.current !== null) {
        window.clearTimeout(gateTimerRef.current);
      }

      gateTimerRef.current = window.setTimeout(() => {
        setGateNudge(false);
        gateTimerRef.current = null;
      }, 800);
    };

    document.addEventListener("click", stopLockedProjectNavigation, true);

    if (isComplete) {
      window.dispatchEvent(new CustomEvent("portfolio:projects-unlocked"));
    }

    return () => {
      document.removeEventListener("click", stopLockedProjectNavigation, true);

      root.classList.remove(
        "portfolio-projects-locked",
        "portfolio-projects-unlocked",
      );

      projectsSection?.removeAttribute("inert");
      projectsSection?.removeAttribute("aria-hidden");
    };
  }, [isComplete]);

  useEffect(() => {
    return () => {
      if (rewardTimerRef.current !== null) {
        window.clearTimeout(rewardTimerRef.current);
      }

      if (wrongDropTimerRef.current !== null) {
        window.clearTimeout(wrongDropTimerRef.current);
      }

      if (gateTimerRef.current !== null) {
        window.clearTimeout(gateTimerRef.current);
      }

      if (alignmentFrameRef.current !== null) {
        window.cancelAnimationFrame(alignmentFrameRef.current);
      }
    };
  }, []);

  const findHomeUnderObject = (objectElement: HTMLElement): ModuleId | null => {
    const objectRect = objectElement.getBoundingClientRect();
    const centreX = objectRect.left + objectRect.width / 2;
    const centreY = objectRect.top + objectRect.height / 2;

    for (const module of MODULES) {
      const home = homeRefs.current[module.id];
      if (!home) continue;

      const homeRect = home.getBoundingClientRect();

      if (
        centreX >= homeRect.left &&
        centreX <= homeRect.right &&
        centreY >= homeRect.top &&
        centreY <= homeRect.bottom
      ) {
        return module.id;
      }
    }

    return null;
  };

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLButtonElement>,
    id: ModuleId,
  ) => {
    setSelectedId(id);

    if (completed.includes(id)) return;

    const stage = stageRef.current;
    if (!stage) return;

    const objectRect = event.currentTarget.getBoundingClientRect();

    dragOffsetRef.current = {
      x: event.clientX - (objectRect.left + objectRect.width / 2),
      y: event.clientY - (objectRect.top + objectRect.height / 2),
    };

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    dragMovedRef.current = false;

    event.currentTarget.setPointerCapture(event.pointerId);
    setDraggingId(id);
    setCarriedId(id);
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLButtonElement>,
    id: ModuleId,
  ) => {
    if (draggingId !== id) return;

    const stage = stageRef.current;
    if (!stage) return;

    const travelledDistance = Math.hypot(
      event.clientX - pointerStartRef.current.x,
      event.clientY - pointerStartRef.current.y,
    );

    if (travelledDistance > 4) {
      dragMovedRef.current = true;
    }

    const stageRect = stage.getBoundingClientRect();
    const objectRect = event.currentTarget.getBoundingClientRect();

    const halfWidth = objectRect.width / 2;
    const halfHeight = objectRect.height / 2;

    const centreX = clamp(
      event.clientX - dragOffsetRef.current.x - stageRect.left,
      halfWidth,
      stageRect.width - halfWidth,
    );

    const centreY = clamp(
      event.clientY - dragOffsetRef.current.y - stageRect.top,
      halfHeight,
      stageRect.height - halfHeight,
    );

    setPositions((current) => ({
      ...current,
      [id]: {
        x: (centreX / stageRect.width) * 100,
        y: (centreY / stageRect.height) * 100,
      },
    }));

    setHoveredHomeId(findHomeUnderObject(event.currentTarget));
  };

  const handlePointerEnd = (
    event: ReactPointerEvent<HTMLButtonElement>,
    id: ModuleId,
  ) => {
    if (draggingId !== id) return;

    const droppedHomeId = findHomeUnderObject(event.currentTarget);

    if (droppedHomeId === id) {
      placeModule(id);
    } else if (dragMovedRef.current) {
      resetModulePosition(id);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDraggingId(null);
    setHoveredHomeId(null);
  };

  const handleObjectClick = (id: ModuleId) => {
    if (dragMovedRef.current) {
      dragMovedRef.current = false;
      return;
    }

    setSelectedId(id);

    if (!completed.includes(id)) {
      setCarriedId(id);
    }
  };

  const handleHomeClick = (homeId: ModuleId) => {
    setSelectedId(homeId);

    if (completed.includes(homeId)) return;

    if (carriedId === homeId) {
      placeModule(homeId);
      return;
    }

    if (carriedId !== null) {
      resetModulePosition(carriedId);
    }
  };

  const resetSceneParallax = () => {
    const stage = stageRef.current;
    if (!stage) return;

    stage.style.setProperty("--scene-far-x", "0px");
    stage.style.setProperty("--scene-far-y", "0px");
    stage.style.setProperty("--scene-mid-x", "0px");
    stage.style.setProperty("--scene-mid-y", "0px");
    stage.style.setProperty("--scene-near-x", "0px");
    stage.style.setProperty("--scene-near-y", "0px");
    stage.style.setProperty("--scene-light-x", "0px");
    stage.style.setProperty("--scene-light-y", "0px");
  };

  const handleStagePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (
      event.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const stage = stageRef.current;
    if (!stage) return;

    const stageRect = stage.getBoundingClientRect();

    const horizontal =
      ((event.clientX - stageRect.left) / stageRect.width - 0.5) * 2;

    const vertical =
      ((event.clientY - stageRect.top) / stageRect.height - 0.5) * 2;

    const clampedHorizontal = clamp(horizontal, -1, 1);
    const clampedVertical = clamp(vertical, -1, 1);

    stage.style.setProperty("--scene-far-x", `${clampedHorizontal * -12}px`);
    stage.style.setProperty("--scene-far-y", `${clampedVertical * -7}px`);
    stage.style.setProperty("--scene-mid-x", `${clampedHorizontal * -6}px`);
    stage.style.setProperty("--scene-mid-y", `${clampedVertical * -4}px`);
    stage.style.setProperty("--scene-near-x", `${clampedHorizontal * 5}px`);
    stage.style.setProperty("--scene-near-y", `${clampedVertical * 3}px`);
    stage.style.setProperty("--scene-light-x", `${clampedHorizontal * 18}px`);
    stage.style.setProperty("--scene-light-y", `${clampedVertical * 12}px`);
  };

  const handleStagePointerLeave = () => {
    if (draggingId !== null) return;
    resetSceneParallax();
  };

  const enterProjects = () => {
    document.getElementById("projects")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="pixel-garden-game">
      <div className="pixel-game-shell">
        <header className="pixel-game-hud">
          <div>
            <span>YOUR MAGIC SHOP</span>
            <small>DESIGN × TECHNOLOGY</small>
          </div>

          <div className="pixel-hud-progress">
            <span>EUPHORIA LEVEL</span>
            <strong>{xp}/300</strong>

            <div aria-hidden="true">
              <i style={{ width: `${(progress / 3) * 100}%` }} />
            </div>
          </div>

          <div className="pixel-hud-actions">
            <span className={isComplete ? "is-online" : ""}>
              {isComplete ? "PORTAL OPEN" : "PORTAL SEALED"}
            </span>

            <button
              type="button"
              className="pixel-reset-button"
              onPointerDown={(event) => {
                event.stopPropagation();
              }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                resetQuest();
              }}
            >
              RESET
            </button>
          </div>
        </header>

        <div className="pixel-game-layout">
          <section className="pixel-quest-panel">
            <span className="pixel-panel-label">SHOP QUEST // 01</span>

            <h1>
              Build a<span> creative world.</span>
            </h1>

            <p>
              Return ORIGINATE, ANALYSIS and EXECUTE to the Magic Shop terminal.
              ORIGINATE finds the opportunity. ANALYSIS turns data into insight. EXECUTE delivers the solution.
            </p>

            <div className="pixel-quest-status" aria-live="polite">
              <span>{progressMessage}</span>

              <div aria-hidden="true">
                {MODULES.map((module) => (
                  <i
                    key={module.id}
                    className={
                      completed.includes(module.id) ? "is-complete" : ""
                    }
                  />
                ))}
              </div>
            </div>

            <div className="pixel-fox-message pixel-familiar-message">
              <img
                src={shopFamiliarDolphin}
                alt="Purple pixel dolphin, the Magic Shop familiar"
                className="pixel-familiar-dolphin"
                draggable={false}
              />

              <p>
                Drag an artifact or click it, then
                choose its matching station.
              </p>
            </div>

            <button
              type="button"
              className={`pixel-project-button ${
                isComplete ? "is-unlocked" : ""
              } ${gateNudge ? "is-nudged" : ""}`}
              onClick={
                isComplete
                  ? enterProjects
                  : () =>
                      document
                        .querySelector(".pixel-garden-stage")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        })
              }
            >
              {isComplete
                ? "OPEN PROJECT PORTAL →"
                : `GATHER ${300 - xp} MORE EUPHORIA`}
            </button>
          </section>

          <section className="pixel-game-window">
            <div className="pixel-window-topbar">
              <span>MAGIC_SHOP.MAP</span>
              <span>EUPHORIA DRAG: ON</span>
            </div>

            <div
              ref={stageRef}
              className="pixel-garden-stage"
              aria-label="Interactive pastel magic shop portfolio game"
              onPointerMove={handleStagePointerMove}
              onPointerLeave={handleStagePointerLeave}
            >
              <div className="pixel-scene-light" aria-hidden="true" />

              <div className="pixel-main-shop" aria-hidden="true">
                <span className="pixel-main-shop__roof" />
                <span className="pixel-main-shop__body">
                  <span className="pixel-main-shop__sign">
                    <small>YOUR</small>
                    <strong>MAGIC SHOP</strong>
                    <small>ORIGINATE · ANALYSIS · EXECUTE</small>
                  </span>
                  <span className="pixel-main-shop__window pixel-main-shop__window--left" />
                  <span className="pixel-main-shop__window pixel-main-shop__window--right" />
                  <span className="pixel-main-shop__door" />
                  <span className="pixel-main-shop__shelf" />
                </span>
              </div>

              <i
                className="pixel-shop-lantern pixel-shop-lantern-left"
                aria-hidden="true"
              />
              <i
                className="pixel-shop-lantern pixel-shop-lantern-right"
                aria-hidden="true"
              />

              <div className="pixel-shop-sparkles" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <div className="pixel-sky" aria-hidden="true">
                <i className="pixel-cloud pixel-cloud-one" />
                <i className="pixel-cloud pixel-cloud-two" />
                <i className="pixel-sun" />
              </div>

              <div className="pixel-background-city" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>

              <div className="pixel-vines" aria-hidden="true">
                <i className="pixel-vine pixel-vine-left" />
                <i className="pixel-vine pixel-vine-right" />
              </div>

              <div className="pixel-ground" aria-hidden="true">
                <i className="pixel-grass pixel-grass-one" />
                <i className="pixel-grass pixel-grass-two" />
                <i className="pixel-flower-bed" />
              </div>

              <div className="pixel-ground-depth" aria-hidden="true" />

              {MODULES.map((module) => {
                const isCompleted = completed.includes(module.id);

                const isHovered = hoveredHomeId === module.id;

                return (
                  <button
                    key={`home-${module.id}`}
                    ref={(element) => {
                      homeRefs.current[module.id] = element;
                    }}
                    type="button"
                    className={`pixel-skill-home pixel-home-${module.id} ${
                      isCompleted ? "is-complete" : ""
                    } ${isHovered ? "is-hovered" : ""}`}
                    onClick={() => handleHomeClick(module.id)}
                    aria-label={`${module.homeName}. ${
                      isCompleted
                        ? "Completed. Click to show details."
                        : `Drop ${module.objectName} here.`
                    }`}
                  >
                    <span className="pixel-home-roof" aria-hidden="true" />
                    <span className="pixel-home-body">
                      <span className="pixel-home-window" />
                      <span className="pixel-home-door" />
                      <span className="pixel-home-decoration" />
                      {isCompleted && (
                        <span
                          className="pixel-restored-object"
                          style={
                            { "--object-accent": module.accent } as CSSProperties
                          }
                        >
                          <ArtifactArtwork id={module.id} />
                          <span className="pixel-restored-object__title">
                            {module.title}
                          </span>
                          <span className="pixel-restored-object__status">
                            RETURNED
                          </span>
                        </span>
                      )}
                    </span>

                    <strong>{module.homeName}</strong>
                    <small>
                      {isCompleted
                        ? "✓ RESTORED"
                        : module.id === carriedId
                          ? "PLACE HERE"
                          : "RETURN HERE"}
                    </small>
                  </button>
                );
              })}

              {MODULES.map((module) => {
                const position = positions[module.id];
                const isCompleted = completed.includes(module.id);

                if (isCompleted) return null;

                return (
                  <button
                    key={`object-${module.id}`}
                    type="button"
                    className={`pixel-drag-object pixel-object-${module.id} ${
                      draggingId === module.id ? "is-dragging" : ""
                    } ${wrongDropId === module.id ? "is-wrong-drop" : ""} ${
                      carriedId === module.id ? "is-carried" : ""
                    }`}
                    style={
                      {
                        "--object-x": `${position.x}%`,
                        "--object-y": `${position.y}%`,
                        "--object-accent": module.accent,
                      } as CSSProperties
                    }
                    onPointerDown={(event) =>
                      handlePointerDown(event, module.id)
                    }
                    onPointerMove={(event) =>
                      handlePointerMove(event, module.id)
                    }
                    onPointerUp={(event) => handlePointerEnd(event, module.id)}
                    onPointerCancel={(event) =>
                      handlePointerEnd(event, module.id)
                    }
                    onClick={() => handleObjectClick(module.id)}
                    aria-label={`${module.objectName}, ${module.title} skill object`}
                  >
                    <ArtifactArtwork id={module.id} />

                    <strong>{module.title}</strong>
                    <small>
                      {draggingId === module.id ? "FLOATING" : "DRAG ME"}
                    </small>
                  </button>
                );
              })}

              {rewardId && (
                <div className="pixel-reward-popup" aria-live="polite">
                  <strong>+100 EUPHORIA</strong>
                  <span>
                    {MODULES.find((module) => module.id === rewardId)?.title}{" "}
                    ROOM RESTORED
                  </span>
                </div>
              )}
            </div>

            <div className="pixel-window-bottombar">
              <span>
                {carriedId
                  ? `HOLDING: ${carriedId.toUpperCase()}`
                  : "SELECT OBJECT"}
              </span>

              <span>
                {selectedModule
                  ? `READING: ${selectedModule.title}`
                  : "NO ARTIFACT SELECTED"}
              </span>
            </div>
          </section>

          <aside className="pixel-details-panel" aria-live="polite">
            <div className="pixel-details-header">
              <span>ARTIFACT_INFO.TXT</span>
              <span>{selectedModule ? selectedModule.number : "--"}</span>
            </div>

            {selectedModule ? (
              <>
                <div
                  className={`pixel-detail-icon pixel-detail-icon-${selectedModule.id}`}
                  aria-hidden="true"
                >
                  {selectedModule.id === "form" && "▣"}
                  {selectedModule.id === "code" && "</>"}
                  {selectedModule.id === "story" && "✦"}
                </div>

                <span className="pixel-details-status">
                  {completed.includes(selectedModule.id)
                    ? "ROOM RESTORED // +100 EUPHORIA"
                    : "ARTIFACT OUT OF PLACE"}
                </span>

                <h2>{selectedModule.title}</h2>

                {completed.includes(selectedModule.id) ? (
                  <>
                    <p>{selectedModule.summary}</p>

                    <div className="pixel-tool-list">
                      <span>INGREDIENTS</span>

                      <div>
                        {selectedModule.tools.map((tool) => (
                          <i key={tool}>{tool}</i>
                        ))}
                      </div>
                    </div>

                    <div className="pixel-proof-box">
                      <span>CREATIVE SPELL</span>
                      <p>{selectedModule.proof}</p>
                    </div>

                    {selectedModule.id === "code" && (
                      <pre className="pixel-mini-ascii">{asciiArt}</pre>
                    )}
                  </>
                ) : (
                  <div className="pixel-locked-details">
                    <span aria-hidden="true">▧</span>
                    <strong>SPELL SEALED</strong>
                    <p>
                      Return this artifact to <b>{selectedModule.homeName}</b>.
                      Its tools, process and creative spell will appear here
                      after it arrives home.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="pixel-empty-details">
                <span>?</span>
                <h2>Choose an artifact</h2>
                <p>Its tools and creative powers will appear here.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default InteractiveLanding;
