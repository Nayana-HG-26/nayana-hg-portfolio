import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, ChevronLeft, ChevronRight, User } from 'lucide-react';
import PageShell from '../components/PageShell.jsx';
import PageTransition from '../components/PageTransition.jsx';
import SkillsPage from './SkillsPage.jsx';
import EducationPage from './EducationPage.jsx';
import ProjectsPage from './ProjectsPage.jsx';
import {
  CertificationsPage,
  ExperiencePage,
  HobbiesPage,
  ResumePage,
} from './ExperienceCertsPages.jsx';
import ContactPage from './ContactPage.jsx';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';

function AboutSectionSlide() {
  const { profile, about } = usePortfolioData();
  const [imgSrc, setImgSrc] = useState(profile.profileImagePrimary);
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgSrc(profile.profileImagePrimary);
    setImgFailed(false);
  }, [profile.profileImagePrimary]);

  const handleImageError = () => {
    if (imgSrc !== profile.profileImageFallback) {
      setImgSrc(profile.profileImageFallback);
    } else {
      setImgFailed(true);
    }
  };

  return (
    <PageShell
      kicker="01 · Biography"
      title={about.heading}
      subtitle={about.tagline || 'A Journey of Learning, Creating and Growing'}
    >
      {/* Spacious 2-Column Layout: Biography on Left + Dedicated Framed Image Space Beside It */}
      <div className="grid items-center gap-10 md:grid-cols-12 lg:gap-14">
        {/* Left: Biography & Technology Journey */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-5 md:col-span-7"
        >
          <h2 className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-cyan-400">
            Biography
          </h2>
          {about.paragraphs.map((text, pIdx) => (
            <p
              key={`${pIdx}-${text.slice(0, 20)}`}
              className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 sm:text-base"
            >
              {text}
            </p>
          ))}
        </motion.div>

        {/* Right: Generous Dedicated Frame for Portrait Beside Biography */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.08 }}
          className="flex justify-center md:col-span-5 md:justify-end"
        >
          <div className="relative w-full max-w-[380px]">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[2.2rem] bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/20 blur-xl"
            />
            <div className="editorial-frame relative w-full rounded-[2rem] p-3.5">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] bg-zinc-200 dark:bg-zinc-800">
                {!imgFailed ? (
                  <img
                    src={imgSrc}
                    alt={`Portrait of ${profile.fullName}`}
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="h-full w-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-zinc-500">
                    <User className="h-16 w-16" />
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-between px-2 pb-1 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                <span>{profile.fullName}</span>
                <span className="text-violet-700 dark:text-cyan-400">Sir MVIT · Bangalore</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Verified Highlights Row */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className="mt-14 grid grid-cols-2 gap-6 border-y border-black/10 py-8 dark:border-white/10 sm:grid-cols-4"
      >
        {about.stats.map((stat) => (
          <div key={stat.label} className="text-center sm:text-left">
            <div className="accent-gradient-text text-3xl font-extrabold tracking-tight sm:text-4xl">
              {stat.value}
            </div>
            <p className="mt-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {stat.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Career Objective & Personal Strengths */}
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        <div className="editorial-card rounded-3xl p-7">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-cyan-400">
            Career Objective
          </p>
          <p className="mt-4 text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
            {about.careerObjective}
          </p>
        </div>

        <div className="editorial-card rounded-3xl p-7">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-cyan-400">
            Personal Strengths
          </p>
          <ul className="mt-4 space-y-3">
            {about.strengths.map((strength) => (
              <li
                key={strength}
                className="flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300"
              >
                <CheckCircle2
                  className="mt-0.5 h-4 w-4 shrink-0 text-violet-700 dark:text-cyan-400"
                  aria-hidden="true"
                />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PageShell>
  );
}

const SLIDES = [
  { id: 'about', num: '01', label: 'About', Component: AboutSectionSlide },
  { id: 'skills', num: '02', label: 'Skills', Component: SkillsPage },
  { id: 'education', num: '03', label: 'Education', Component: EducationPage },
  { id: 'projects', num: '04', label: 'Projects', Component: ProjectsPage },
  { id: 'experience', num: '05', label: 'Experience', Component: ExperiencePage },
  { id: 'certifications', num: '06', label: 'Certifications', Component: CertificationsPage },
  { id: 'resume', num: '07', label: 'Resume', Component: ResumePage },
  { id: 'hobbies', num: '08', label: 'Hobbies', Component: HobbiesPage },
  { id: 'contact', num: '09', label: 'Contact', Component: ContactPage },
];

const SLIDE_VARIANTS = {
  enter: (dir) => ({
    x: dir >= 0 ? 110 : -110,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (dir) => ({
    x: dir >= 0 ? -110 : 110,
    opacity: 0,
  }),
};

const COOLDOWN_MS = 900;
const WHEEL_THRESHOLD = 55;
const WHEEL_RESET_MS = 320;
const HORIZONTAL_SWIPE_PX = 65;
const VERTICAL_SWIPE_PX = 75;

function isInteractionBlocked(target) {
  if (document.querySelector('[role="dialog"], [aria-modal="true"]')) {
    return true;
  }
  if (!(target instanceof Element)) {
    return false;
  }
  return Boolean(
    target.closest('input, textarea, select, [contenteditable="true"], [data-no-section-swipe]')
  );
}

export default function AboutPage() {
  const navigate = useNavigate();
  const [slideIndex, setSlideIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [wipeState, setWipeState] = useState({ id: 0, variant: 'wipe' });

  const cooldownUntilRef = useRef(0);
  const wheelAccumRef = useRef(0);
  const wheelDirectionRef = useRef(0);
  const lastWheelTimeRef = useRef(0);
  const touchStartRef = useRef(null);
  const tabRefs = useRef([]);

  useEffect(() => {
    const activeTab = tabRefs.current[slideIndex];
    if (activeTab && typeof activeTab.scrollIntoView === 'function') {
      activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [slideIndex]);

  const goToSlide = useCallback(
    (targetIndex) => {
      if (targetIndex < 0) {
        cooldownUntilRef.current = Date.now() + COOLDOWN_MS;
        navigate('/');
        return;
      }
      if (targetIndex >= SLIDES.length || targetIndex === slideIndex) return;

      const dir = targetIndex > slideIndex ? 1 : -1;
      cooldownUntilRef.current = Date.now() + COOLDOWN_MS;
      wheelAccumRef.current = 0;
      wheelDirectionRef.current = 0;

      setDirection(dir);
      setWipeState((prev) => ({
        id: prev.id + 1,
        variant: dir > 0 ? 'wipe' : 'wipe-left',
      }));
      setSlideIndex(targetIndex);
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [navigate, slideIndex]
  );

  useEffect(() => {
    cooldownUntilRef.current = Date.now() + 750;
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (isInteractionBlocked(event.target)) return;
      if (event.key === 'ArrowRight') {
        if (slideIndex < SLIDES.length - 1) {
          event.preventDefault();
          goToSlide(slideIndex + 1);
        }
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToSlide(slideIndex - 1);
      }
    };

    const onWheel = (event) => {
      if (event.ctrlKey || event.metaKey || isInteractionBlocked(event.target)) return;

      const now = Date.now();
      if (now < cooldownUntilRef.current) {
        wheelAccumRef.current = 0;
        return;
      }

      if (Math.abs(event.deltaY) < Math.abs(event.deltaX) || Math.abs(event.deltaY) < 4) {
        return;
      }

      const dir = event.deltaY > 0 ? 1 : -1;
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);

      const atTop = scrollTop <= 4;
      const atBottom = scrollTop >= maxScroll - 4;

      if ((dir > 0 && !atBottom) || (dir < 0 && !atTop)) {
        wheelAccumRef.current = 0;
        wheelDirectionRef.current = 0;
        return;
      }

      if (wheelDirectionRef.current !== dir || now - lastWheelTimeRef.current > WHEEL_RESET_MS) {
        wheelAccumRef.current = 0;
        wheelDirectionRef.current = dir;
      }

      lastWheelTimeRef.current = now;
      wheelAccumRef.current += Math.abs(event.deltaY);

      if (wheelAccumRef.current >= WHEEL_THRESHOLD) {
        if (dir > 0 && slideIndex < SLIDES.length - 1) {
          goToSlide(slideIndex + 1);
        } else if (dir < 0) {
          goToSlide(slideIndex - 1);
        }
      }
    };

    const onTouchStart = (event) => {
      if (event.touches.length !== 1 || isInteractionBlocked(event.target)) {
        touchStartRef.current = null;
        return;
      }
      const touch = event.touches[0];
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
        atTop: scrollTop <= 6,
        atBottom: scrollTop >= maxScroll - 6,
      };
    };

    const onTouchEnd = (event) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!start || event.changedTouches.length !== 1) return;
      if (Date.now() < cooldownUntilRef.current) return;
      if (Date.now() - start.time > 800) return;

      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;

      if (Math.abs(dx) >= HORIZONTAL_SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.35) {
        if (dx < 0 && slideIndex < SLIDES.length - 1) {
          goToSlide(slideIndex + 1);
        } else if (dx > 0) {
          goToSlide(slideIndex - 1);
        }
        return;
      }

      if (Math.abs(dy) >= VERTICAL_SWIPE_PX && Math.abs(dy) > Math.abs(dx) * 1.4) {
        if (dy < 0 && start.atBottom && slideIndex < SLIDES.length - 1) {
          goToSlide(slideIndex + 1);
        } else if (dy > 0 && start.atTop) {
          goToSlide(slideIndex - 1);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [goToSlide, slideIndex]);

  const currentSlide = SLIDES[slideIndex];
  const prevSlide = slideIndex > 0 ? SLIDES[slideIndex - 1] : null;
  const nextSlide = slideIndex < SLIDES.length - 1 ? SLIDES[slideIndex + 1] : null;
  const ActiveSlideComponent = currentSlide.Component;

  return (
    <div className="relative overflow-x-hidden">
      {wipeState.id > 0 && (
        <PageTransition key={wipeState.id} variant={wipeState.variant} />
      )}

      {/* Side-by-Side Slideshow Strip — Mobile & Desktop Friendly */}
      <div className="mx-auto max-w-6xl px-4 pt-4 sm:px-6">
        <div
          data-no-section-swipe
          className="editorial-card flex flex-col gap-2.5 rounded-2xl px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4"
        >
          <div className="flex items-center justify-between gap-2 sm:contents">
            <button
              type="button"
              onClick={() => goToSlide(slideIndex - 1)}
              aria-label={prevSlide ? `Previous: ${prevSlide.label}` : 'Back to Home'}
              className="inline-flex min-h-[38px] shrink-0 items-center gap-1 rounded-xl border border-black/15 px-3 py-1.5 text-xs font-semibold text-[#1B1B1E] transition-colors hover:border-violet-600 hover:text-violet-700 dark:border-white/15 dark:text-white dark:hover:border-cyan-400 dark:hover:text-cyan-400 sm:order-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{prevSlide ? prevSlide.label : 'Home'}</span>
            </button>

            <span className="font-mono text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 sm:hidden">
              {currentSlide.num} / {String(SLIDES.length).padStart(2, '0')} · {currentSlide.label}
            </span>

            <button
              type="button"
              disabled={!nextSlide}
              onClick={() => goToSlide(slideIndex + 1)}
              aria-label={nextSlide ? `Next: ${nextSlide.label}` : 'End of Slideshow'}
              className="inline-flex min-h-[38px] shrink-0 items-center gap-1 rounded-xl border border-black/15 px-3 py-1.5 text-xs font-semibold text-[#1B1B1E] transition-colors hover:border-violet-600 hover:text-violet-700 disabled:opacity-40 dark:border-white/15 dark:text-white dark:hover:border-cyan-400 dark:hover:text-cyan-400 sm:order-3"
            >
              <span>{nextSlide ? nextSlide.label : 'End'}</span>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="no-scrollbar flex w-full min-w-0 items-center gap-1.5 overflow-x-auto px-0.5 py-0.5 sm:order-2 sm:flex-1 sm:justify-start lg:justify-center">
            {SLIDES.map((slide, idx) => {
              const active = idx === slideIndex;
              return (
                <button
                  key={slide.id}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  type="button"
                  onClick={() => goToSlide(idx)}
                  aria-current={active ? 'step' : undefined}
                  className={`min-h-[32px] shrink-0 rounded-full px-3 py-1 font-mono text-[11px] font-semibold transition-all ${
                    active
                      ? 'accent-gradient-bg text-white shadow-sm'
                      : 'text-zinc-600 hover:bg-black/5 hover:text-[#1B1B1E] dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white'
                  }`}
                >
                  {slide.num} {slide.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Wide-Desktop Side Arrow Controls (2xl+ so content never overlaps on laptops) */}
      <button
        type="button"
        onClick={() => goToSlide(slideIndex - 1)}
        aria-label={prevSlide ? `Previous slide: ${prevSlide.label}` : 'Back to Home'}
        className="fixed left-5 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-[#FAF9F6]/85 text-[#1B1B1E] shadow-md backdrop-blur-md transition-all hover:scale-105 hover:border-violet-600 hover:text-violet-700 dark:border-white/15 dark:bg-[#0b1126]/85 dark:text-white dark:hover:border-cyan-400 dark:hover:text-cyan-400 2xl:inline-flex"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      {nextSlide && (
        <button
          type="button"
          onClick={() => goToSlide(slideIndex + 1)}
          aria-label={`Next slide: ${nextSlide.label}`}
          className="fixed right-5 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/15 bg-[#FAF9F6]/85 text-[#1B1B1E] shadow-md backdrop-blur-md transition-all hover:scale-105 hover:border-violet-600 hover:text-violet-700 dark:border-white/15 dark:bg-[#0b1126]/85 dark:text-white dark:hover:border-cyan-400 dark:hover:text-cyan-400 2xl:inline-flex"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      )}

      {/* Side-by-Side Animated Slideshow Stage */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide.id}
          custom={direction}
          variants={SLIDE_VARIANTS}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
        >
          <ActiveSlideComponent />
        </motion.div>
      </AnimatePresence>

      {/* Bottom Side-by-Side Slide Footer Bar */}
      <div className="mx-auto max-w-6xl px-4 pb-12 sm:px-6">
        <div className="flex flex-col items-stretch justify-between gap-3 border-t border-black/10 pt-6 dark:border-white/10 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            onClick={() => goToSlide(slideIndex - 1)}
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-black/15 px-4 py-2 text-xs font-semibold text-[#1B1B1E] transition-colors hover:border-violet-600 hover:text-violet-700 dark:border-white/15 dark:text-white dark:hover:border-cyan-400 dark:hover:text-cyan-400"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span>{prevSlide ? `Previous · ${prevSlide.label}` : 'Back to Home'}</span>
          </button>

          <span className="text-center font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
            Slide {currentSlide.num} / {String(SLIDES.length).padStart(2, '0')} · Scroll or swipe to switch
          </span>

          {nextSlide ? (
            <button
              type="button"
              onClick={() => goToSlide(slideIndex + 1)}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#1B1B1E] px-5 py-2 text-xs font-semibold text-[#FAF9F6] transition-all hover:bg-violet-700 dark:bg-[#F4F3EF] dark:text-[#121318] dark:hover:bg-cyan-400"
            >
              <span>Next · {nextSlide.label}</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goToSlide(0)}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-black/15 px-4 py-2 text-xs font-semibold text-[#1B1B1E] transition-colors hover:border-violet-600 hover:text-violet-700 dark:border-white/15 dark:text-white dark:hover:border-cyan-400 dark:hover:text-cyan-400"
            >
              <span>Back to Slide 01</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
