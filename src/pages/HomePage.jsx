import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, ExternalLink, User } from 'lucide-react';
import HireMeBadge from '../components/HireMeBadge.jsx';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';

export default function HomePage() {
  const { profile } = usePortfolioData();
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden"
    >
      {/* Subtle Programming-Themed Decorative Glyphs */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none font-mono text-xs font-semibold text-violet-600/35 dark:text-cyan-400/30"
      >
        <span className="glyph-float absolute left-[6%] top-14 hidden lg:block">
          {'{ code: "clean" }'}
        </span>
        <span
          className="glyph-float absolute right-[8%] top-20 hidden lg:block"
          style={{ animationDelay: '1.4s' }}
        >
          {'<Developer />'}
        </span>
        <span
          className="glyph-float absolute right-[12%] bottom-36 hidden xl:block"
          style={{ animationDelay: '2.6s' }}
        >
          {'01 · MERN'}
        </span>
      </div>

      {/* Main Editorial Hero */}
      <section className="mx-auto flex min-h-[calc(100vh-140px)] max-w-6xl flex-col justify-center px-4 pt-6 pb-12 sm:px-6 sm:py-12 lg:py-16">
        <div className="grid items-center gap-8 sm:gap-12 lg:grid-cols-12">
          {/* Left: Framed Portrait Photograph */}
          <motion.div
            initial={{ opacity: 0, x: -22 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex justify-center lg:col-span-5"
          >
            <div className="relative w-full max-w-[270px] sm:max-w-[340px] lg:max-w-[360px]">
              {/* Purple-to-Cyan Ambient Backing */}
              <div
                aria-hidden="true"
                className="absolute -inset-3 rounded-[2.2rem] bg-gradient-to-br from-violet-500/20 via-transparent to-cyan-500/20 blur-xl"
              />

              <div className="editorial-frame relative overflow-hidden rounded-[2rem] p-2.5 sm:p-3">
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
                  <span className="text-violet-700 dark:text-cyan-400">MCA · Bangalore</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Editorial Headline, Introduction & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="text-center lg:col-span-7 lg:text-left"
          >
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-cyan-400 sm:text-xs sm:tracking-[0.22em]">
              {profile.tagline}
            </p>

            <h1 className="mt-3 text-3xl font-extrabold leading-[1.14] tracking-tight text-[#1B1B1E] dark:text-[#F4F3EF] sm:mt-4 sm:text-5xl xl:text-6xl">
              {profile.heroHeadline === 'Turning Ideas Into Code, Building Experiences That Matter.' ? (
                <>
                  Turning Ideas Into Code,{' '}
                  <span className="accent-gradient-text">
                    Building Experiences That Matter.
                  </span>
                </>
              ) : (
                <span className="accent-gradient-text">{profile.heroHeadline}</span>
              )}
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:mt-6 sm:text-base lg:mx-0">
              {profile.heroIntro}
            </p>

            {/* Primary & Secondary Buttons */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <a
                href={profile.resumePdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-[#1B1B1E] px-6 py-3 text-sm font-semibold text-[#FAF9F6] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-violet-700 dark:bg-[#F4F3EF] dark:text-[#121318] dark:hover:bg-cyan-400"
              >
                <span>Resume</span>
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
              </a>

              <Link
                to="/contact"
                className="inline-flex min-h-[48px] items-center gap-2 rounded-lg border border-[#1B1B1E]/25 px-6 py-3 text-sm font-semibold text-[#1B1B1E] transition-all hover:-translate-y-0.5 hover:border-violet-600 hover:text-violet-700 dark:border-white/25 dark:text-[#F4F3EF] dark:hover:border-cyan-400 dark:hover:text-cyan-400"
              >
                <span>Contact</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>

              <Link
                to="/about"
                className="px-2 py-2 text-sm font-semibold underline decoration-violet-500/60 underline-offset-4 transition-colors hover:text-violet-700 dark:hover:text-cyan-400"
              >
                Read My Story
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Rotating Circular Hire Me Badge */}
        <div className="mt-10 flex justify-center lg:justify-end">
          <HireMeBadge className="shrink-0" />
        </div>
      </section>
    </motion.div>
  );
}
