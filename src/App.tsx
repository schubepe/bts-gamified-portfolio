import {
  lazy,
  Suspense,
} from "react";

import {
  Routes,
  Route,
} from "react-router-dom";

import {
  DarkModeProvider,
} from "./contexts/DarkModeContext";

import Navigation from "./components/section/Navigation";
import About from "./components/section/About";

import "./App.css";
import "./MagicShopFinalPolish.css";

// Lazy-loaded pages
const Contact = lazy(
  () => import("./pages/Contact"),
);

// Lazy-loaded homepage sections
const Projects = lazy(
  () => import("./components/section/Projects"),
);

const Skills = lazy(
  () => import("./components/section/Skills"),
);

const Certifications = lazy(
  () => import("./components/section/Certifications"),
);

const Footer = lazy(
  () => import("./components/Footer"),
);

const SectionLoader = ({
  height = "h-64",
}: {
  height?: string;
}) => (
  <div
    className={`${height} flex items-center justify-center`}
    style={{
      background: "transparent",
      color: "var(--site-text, #5b426e)",
    }}
  >
    Loading...
  </div>
);

function HomePage() {
  return (
    <>
      <About />

      <Suspense
        fallback={
          <SectionLoader height="h-screen" />
        }
      >
        <Projects />
      </Suspense>

      <Suspense
        fallback={
          <SectionLoader height="h-screen" />
        }
      >
        <Skills />
      </Suspense>

      <Suspense
        fallback={
          <SectionLoader height="h-64" />
        }
      >
        <Certifications />
      </Suspense>
    </>
  );
}

function AppContent() {
  return (
    <>
      <Navigation />

      <div
        className="app transition-colors duration-300"
        style={{
          background: "transparent",
          backgroundColor: "transparent",
        }}
      >
        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>

        <main
          id="main-content"
          className="main-content"
          style={{
            background: "transparent",
            backgroundColor: "transparent",
          }}
        >
          <Suspense
            fallback={
              <SectionLoader height="min-h-screen" />
            }
          >
            <Routes>
              <Route
                path="/"
                element={<HomePage />}
              />

              <Route
                path="/contact"
                element={<Contact />}
              />
            </Routes>
          </Suspense>
        </main>

        <Suspense
          fallback={
            <SectionLoader height="h-32" />
          }
        >
          <Footer />
        </Suspense>
      </div>
    </>
  );
}

function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  );
}

export default App;
