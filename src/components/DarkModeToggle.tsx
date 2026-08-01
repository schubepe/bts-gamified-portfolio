import { Moon, Sun } from "lucide-react";

import "./DarkModeToggle.css";

interface DarkModeToggleProps {
  checked: boolean;
  onChange: () => void;
}

const DarkModeToggle = ({
  checked,
  onChange,
}: DarkModeToggleProps) => {
  const isDarkMode = checked;

  return (
    <button
      type="button"
      className={`theme-toggle ${
        isDarkMode
          ? "theme-toggle--dark"
          : "theme-toggle--light"
      }`}
      onClick={onChange}
      aria-pressed={isDarkMode}
      aria-label={
        isDarkMode
          ? "Dark mode is on. Switch to light mode."
          : "Light mode is on. Switch to dark mode."
      }
      title={
        isDarkMode
          ? "Dark mode on — switch to light"
          : "Light mode on — switch to dark"
      }
    >
      <span
        className="theme-toggle__glow"
        aria-hidden="true"
      />

      <span
        className="theme-toggle__expand"
        aria-hidden="true"
      >
        {isDarkMode ? (
          <Moon
            className="theme-toggle__icon"
            size={24}
            strokeWidth={2}
          />
        ) : (
          <Sun
            className="theme-toggle__icon"
            size={25}
            strokeWidth={2}
          />
        )}
      </span>

      <span className="sr-only">
        {isDarkMode ? "Dark mode" : "Light mode"}
      </span>
    </button>
  );
};

export default DarkModeToggle;
