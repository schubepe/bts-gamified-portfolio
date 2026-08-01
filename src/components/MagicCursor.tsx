import {
  useEffect,
  useRef,
} from "react";

import armyBombCursor from "../assets/magic-shop/army-bomb-cursor.png";

import "./MagicCursor.css";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "[role='button']",
  "[draggable='true']",
  ".pixel-drag-object",
  ".cassette-about__tape",
].join(",");

const MagicCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    if (!cursor) {
      return;
    }

    const finePointer =
      window.matchMedia("(pointer: fine)");

    if (!finePointer.matches) {
      return;
    }

    const root = document.documentElement;

    /*
     * Add this style after every other stylesheet.
     * This guarantees the normal arrow / pointer cannot
     * reappear when hovering buttons such as the theme toggle.
     */
    const nativeCursorStyle =
      document.createElement("style");

    nativeCursorStyle.dataset.magicCursor =
      "native-cursor-hide";

    nativeCursorStyle.textContent = `
      html.has-magic-cursor,
      html.has-magic-cursor body,
      html.has-magic-cursor body *,
      html.has-magic-cursor body *::before,
      html.has-magic-cursor body *::after
    `;

    document.head.appendChild(
      nativeCursorStyle,
    );

    root.classList.add(
      "has-magic-cursor",
    );

    let animationFrame = 0;
    let pointerX = -100;
    let pointerY = -100;

    const renderCursor = () => {
      /*
       * Fixed hotspot:
       * the pointer position stays in the same place whether
       * it is over normal text or an interactive button.
       */
      cursor.style.transform = `translate3d(
        ${pointerX - 16}px,
        ${pointerY - 16}px,
        0
      )`;
    };

    const handlePointerMove = (
      event: PointerEvent,
    ) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      cursor.classList.add(
        "is-visible",
      );

      const target = event.target;

      const isInteractive =
        target instanceof Element
        && Boolean(
          target.closest(
            INTERACTIVE_SELECTOR,
          ),
        );

      cursor.classList.toggle(
        "is-interactive",
        isInteractive,
      );

      cancelAnimationFrame(
        animationFrame,
      );

      animationFrame =
        requestAnimationFrame(
          renderCursor,
        );
    };

    const handlePointerDown = () => {
      cursor.classList.add(
        "is-pressed",
      );
    };

    const handlePointerUp = () => {
      cursor.classList.remove(
        "is-pressed",
      );
    };

    const handlePointerLeave = () => {
      cursor.classList.remove(
        "is-visible",
      );
    };

    const handlePointerEnter = () => {
      cursor.classList.add(
        "is-visible",
      );
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true },
    );

    window.addEventListener(
      "pointerdown",
      handlePointerDown,
      { passive: true },
    );

    window.addEventListener(
      "pointerup",
      handlePointerUp,
      { passive: true },
    );

    document.documentElement.addEventListener(
      "mouseleave",
      handlePointerLeave,
    );

    document.documentElement.addEventListener(
      "mouseenter",
      handlePointerEnter,
    );

    return () => {
      cancelAnimationFrame(
        animationFrame,
      );

      root.classList.remove(
        "has-magic-cursor",
      );

      nativeCursorStyle.remove();

      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );

      window.removeEventListener(
        "pointerdown",
        handlePointerDown,
      );

      window.removeEventListener(
        "pointerup",
        handlePointerUp,
      );

      document.documentElement.removeEventListener(
        "mouseleave",
        handlePointerLeave,
      );

      document.documentElement.removeEventListener(
        "mouseenter",
        handlePointerEnter,
      );
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="magic-cursor"
      aria-hidden="true"
    >
      <span
        className="magic-cursor__glow"
      />

      <img
        src={armyBombCursor}
        alt=""
        draggable={false}
      />
    </div>
  );
};

export default MagicCursor;
