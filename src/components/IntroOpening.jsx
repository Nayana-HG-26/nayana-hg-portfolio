import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Code2, User } from 'lucide-react';
import { PORTFOLIO_PROFILE } from '../data/portfolioData.js';

export default function IntroOpening({ onStartExit, onComplete }) {
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [imgSrc, setImgSrc] = useState(PORTFOLIO_PROFILE.profileImagePrimary);
  const [imgFailed, setImgFailed] = useState(false);
  const exitTimerRef = useRef(null);

  const handleImageError = () => {
    if (imgSrc !== PORTFOLIO_PROFILE.profileImageFallback) {
      setImgSrc(PORTFOLIO_PROFILE.profileImageFallback);
    } else {
      setImgFailed(true);
    }
  };

  const triggerExit = useCallback(() => {
    if (exiting) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      onStartExit?.();
      onComplete();
      return;
    }

    setExiting(true);
    onStartExit?.();
    exitTimerRef.current = window.setTimeout(() => {
      onComplete();
    }, 850);
  }, [exiting, onComplete, onStartExit]);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 700);
    const onKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === 'Escape') {
        triggerExit();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(timer);
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [triggerExit]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      aria-label="Introductory Opening Experience"
      className={`fixed inset-0 z-[100] overflow-hidden ${
        exiting ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
    >
      {/* Left Split Curtain Panel */}
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: exiting ? '-102%' : '0%' }}
        transition={{ duration: 0.82, delay: exiting ? 0.08 : 0, ease: [0.77, 0, 0.175, 1] }}
        className="absolute inset-y-0 left-0 w-1/2 overflow-hidden border-r border-violet-500/25 bg-[radial-gradient(circle_at_90%_50%,rgba(124,58,237,0.16),transparent_65%),linear-gradient(180deg,#fcfbf8_0%,#f3f1eb_100%)] shadow-[16px_0_60px_rgba(124,58,237,0.22)] dark:border-cyan-400/25 dark:bg-[radial-gradient(circle_at_90%_50%,rgba(99,102,241,0.26),transparent_65%),linear-gradient(180deg,#050814_0%,#0a1126_55%,#04060f_100%)]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 w-1 bg-gradient-to-b from-transparent via-violet-500/70 to-transparent dark:via-cyan-400/70"
        />
      </motion.div>

      {/* Right Split Curtain Panel */}
      <motion.div
        initial={{ x: '0%' }}
        animate={{ x: exiting ? '102%' : '0%' }}
        transition={{ duration: 0.82, delay: exiting ? 0.08 : 0, ease: [0.77, 0, 0.175, 1] }}
        className="absolute inset-y-0 right-0 w-1/2 overflow-hidden border-l border-cyan-500/25 bg-[radial-gradient(circle_at_10%_50%,rgba(6,182,212,0.16),transparent_65%),linear-gradient(180deg,#fcfbf8_0%,#f3f1eb_100%)] shadow-[-16px_0_60px_rgba(6,182,212,0.22)] dark:border-violet-400/25 dark:bg-[radial-gradient(circle_at_10%_50%,rgba(6,182,212,0.24),transparent_65%),linear-gradient(180deg,#050814_0%,#0a1126_55%,#04060f_100%)]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-transparent via-cyan-500/70 to-transparent dark:via-violet-400/70"
        />
      </motion.div>

      {/* Center Stage Content + Profile Picture Reveal */}
      <motion.div
        animate={{
          opacity: exiting ? 0 : 1,
          scale: exiting ? 0.92 : 1,
          y: exiting ? -16 : 0,
        }}
        transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 text-center text-[#1B1B1E] dark:text-[#F4F3EF]"
      >
        {/* Expanding Concentric Orbit Accents */}
        <motion.div
          aria-hidden="true"
          initial={{ scale: 0.65, opacity: 0 }}
          animate={{ scale: exiting ? 1.25 : 1, opacity: exiting ? 0 : 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute h-[410px] w-[410px] rounded-full border border-[#1B1B1E]/10 dark:border-sky-400/20"
        />
        <motion.div
          aria-hidden="true"
          initial={{ scale: 0.55, opacity: 0 }}
          animate={{ scale: exiting ? 1.35 : 1, opacity: exiting ? 0 : 1 }}
          transition={{ duration: 0.95, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute h-[590px] w-[590px] rounded-full border border-[#1B1B1E]/5 dark:border-violet-400/12"
        />

        {/* Animated Circular Profile Picture Frame */}
        <motion.div
          initial={{ scale: 0.68, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* Rotating Luminous Outer Halo */}
          <div
            aria-hidden="true"
            className="hire-spin absolute -inset-2 rounded-full bg-gradient-to-tr from-violet-500/45 via-sky-400/35 to-cyan-400/45 blur-md"
          />

          <div className="relative h-32 w-32 rounded-full bg-gradient-to-tr from-violet-600 via-sky-400 to-cyan-400 p-[3px] shadow-[0_0_48px_rgba(99,102,241,0.45)] sm:h-36 sm:w-36">
            <div className="h-full w-full overflow-hidden rounded-full border-[3px] border-[#FAF9F6] bg-zinc-200 dark:border-[#050814] dark:bg-[#0b1126]">
              {!imgFailed ? (
                <motion.img
                  src={imgSrc}
                  alt="Portrait of Nayana H G"
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  initial={{ scale: 1.18, opacity: 0.4 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sky-400">
                  <User className="h-12 w-12" />
                </div>
              )}
            </div>
          </div>

          {/* Crisp Monogram Tag */}
          <span className="absolute -bottom-2 inline-flex items-center gap-0.5 rounded-full border border-black/10 bg-[#1B1B1E] px-3 py-0.5 font-mono text-[10px] font-bold tracking-widest text-[#FAF9F6] shadow-md dark:border-cyan-400/40 dark:bg-[#0d1530] dark:text-cyan-300">
            <span>N</span>
            <svg
              viewBox="0 0 10 8"
              aria-hidden="true"
              className="h-1.5 w-2 shrink-0 fill-violet-400 dark:fill-cyan-300"
            >
              <polygon points="0,0 10,0 5,8" />
            </svg>
            <span>HG</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          className="mt-7 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-zinc-500 dark:text-sky-300"
        >
          <Code2 className="h-3.5 w-3.5 text-violet-600 dark:text-cyan-400" aria-hidden="true" />
          <span>WELCOME TO MY DEV WORLD</span>
        </motion.div>

        <div className="mt-3 overflow-hidden">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl font-extrabold tracking-tight sm:text-6xl"
          >
            {PORTFOLIO_PROFILE.fullName}
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.34 }}
          className="mt-3.5 max-w-lg text-base font-medium leading-relaxed text-zinc-600 dark:text-slate-300 sm:text-lg"
        >
          Exploring technology, building applications, and{' '}
          <span className="accent-gradient-text font-semibold">
            creating solutions through code
          </span>
          .
        </motion.p>

        {/* Subtle Loading Sweep */}
        <div className="mt-6 h-[2px] w-48 overflow-hidden rounded-full bg-zinc-300 dark:bg-white/15">
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '0%' }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="h-full w-full accent-gradient-bg"
          />
        </div>

        {/* Prominent Enter Portfolio CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: ready ? 1 : 0.7, y: 0 }}
          transition={{ duration: 0.4, delay: 0.42 }}
          className="mt-7 flex flex-col items-center gap-3 sm:flex-row"
        >
          <button
            type="button"
            onClick={triggerExit}
            className="group inline-flex min-h-[50px] items-center gap-2.5 rounded-full bg-[#1B1B1E] px-8 py-3.5 text-sm font-semibold text-[#FAF9F6] shadow-lg transition-all hover:-translate-y-0.5 hover:bg-violet-700 dark:bg-gradient-to-r dark:from-indigo-500 dark:via-blue-500 dark:to-cyan-500 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <span>🌙 Step Into My Space</span>
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="mt-4 font-mono text-[11px] text-zinc-500 dark:text-slate-400"
        >
          MCA Student · Sir M. Visveshvaraya Institute of Technology, Banglore
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
