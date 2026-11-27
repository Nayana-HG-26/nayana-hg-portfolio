import { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'motion/react';
import { Github, Heart, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { PortfolioDataProvider, usePortfolioData } from './context/PortfolioDataContext.jsx';
import AmbientBackdrop from './components/AmbientBackdrop.jsx';
import IntroOpening from './components/IntroOpening.jsx';
import PageTransition from './components/PageTransition.jsx';
import TopNavbar from './components/TopNavbar.jsx';
import BackToTop from './components/BackToTop.jsx';
import SectionScrollNavigator from './components/SectionScrollNavigator.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import SkillsPage from './pages/SkillsPage.jsx';
import EducationPage from './pages/EducationPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import {
  CertificationsPage,
  ExperiencePage,
  HobbiesPage,
  ResumePage,
} from './pages/ExperienceCertsPages.jsx';
import ContactPage from './pages/ContactPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

const INTRO_SEEN_KEY = 'nhg_intro_seen';
const VERTICAL_TRANSITION_ROUTES = new Set([
  '/about',
  '/education',
  '/experience',
  '/resume',
  '/hobbies',
]);

function ScrollToTopOnRoute() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const [transitionState, setTransitionState] = useState({
    id: 0,
    variant: 'wipe',
  });

  useEffect(() => {
    if (prevPathRef.current !== location.pathname) {
      prevPathRef.current = location.pathname;
      const variant = VERTICAL_TRANSITION_ROUTES.has(location.pathname) ? 'vertical' : 'wipe';
      setTransitionState((prev) => ({ id: prev.id + 1, variant }));
    }
  }, [location.pathname]);

  return (
    <>
      {transitionState.id > 0 && (
        <PageTransition key={transitionState.id} variant={transitionState.variant} />
      )}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/resume" element={<ResumePage />} />
          <Route path="/hobbies" element={<HobbiesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  const [showOpening, setShowOpening] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.sessionStorage.getItem(INTRO_SEEN_KEY) !== '1';
  });
  const [introExiting, setIntroExiting] = useState(false);
  const [replayCount, setReplayCount] = useState(0);

  const handleStartExit = useCallback(() => {
    setIntroExiting(true);
  }, []);

  const handleEnterPortfolio = useCallback(() => {
    window.sessionStorage.setItem(INTRO_SEEN_KEY, '1');
    setShowOpening(false);
    setIntroExiting(false);
  }, []);

  const handleReplayOpening = () => {
    window.sessionStorage.removeItem(INTRO_SEEN_KEY);
    setIntroExiting(false);
    setReplayCount((prev) => prev + 1);
    setShowOpening(true);
  };

  const revealPortfolio = !showOpening || introExiting;

  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <PortfolioDataProvider>
          <BrowserRouter>
            <ScrollToTopOnRoute />
            <SectionScrollNavigator enabled={!showOpening} />
            <AmbientBackdrop />
            {showOpening && (
              <IntroOpening
                key={replayCount}
                onStartExit={handleStartExit}
                onComplete={handleEnterPortfolio}
              />
            )}

            <motion.div
              animate={{
                scale: revealPortfolio ? 1 : 0.96,
                opacity: revealPortfolio ? 1 : 0.25,
              }}
              transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 flex min-h-screen flex-col text-[#1B1B1E] transition-colors duration-300 dark:text-[#F4F3EF]"
            >
              <TopNavbar />

              <main className="flex-1">
                <AnimatedRoutes />
              </main>

              <BackToTop />

              {/* Minimal Editorial Footer */}
              <PortfolioFooter onReplayOpening={handleReplayOpening} />
            </motion.div>
          </BrowserRouter>
        </PortfolioDataProvider>
      </ThemeProvider>
    </MotionConfig>
  );
}

function PortfolioFooter({ onReplayOpening }: { onReplayOpening: () => void }) {
  const { profile } = usePortfolioData();
  return (
    <footer className="border-t border-black/10 py-8 text-xs text-zinc-600 dark:border-white/10 dark:text-zinc-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
        <p>{new Date().getFullYear()} © {profile.fullName}. All Rights Reserved.</p>

        <p className="inline-flex items-center gap-1.5 font-medium">
          <span>Built with</span>
          <Heart className="h-3.5 w-3.5 fill-violet-600 text-violet-600 dark:fill-cyan-400 dark:text-cyan-400" aria-hidden="true" />
          <span>by {profile.fullName.split(' ')[0] || 'Nayana'}</span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-[#1B1B1E] dark:hover:text-white"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-[#1B1B1E] dark:hover:text-white"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={`mailto:${profile.email}`}
            aria-label="Email"
            className="hover:text-[#1B1B1E] dark:hover:text-white"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={profile.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="hover:text-[#1B1B1E] dark:hover:text-white"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          </a>
          <span aria-hidden="true" className="text-zinc-400">·</span>
          <button
            type="button"
            onClick={onReplayOpening}
            className="font-semibold underline underline-offset-4 hover:text-violet-700 dark:hover:text-cyan-400"
          >
            Replay Intro
          </button>
          <Link
            to="/admin"
            className="font-semibold hover:text-violet-700 dark:hover:text-cyan-400"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
