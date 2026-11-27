import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ChevronDown, Github, Linkedin, Menu, Moon, Sun, X } from 'lucide-react';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const PRIMARY_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Skills', path: '/skills' },
  { label: 'Education', path: '/education' },
  { label: 'Projects', path: '/projects' },
];

const MORE_LINKS = [
  { label: 'Experience & Internship', path: '/experience' },
  { label: 'Certifications', path: '/certifications' },
  { label: 'Resume', path: '/resume' },
  { label: 'Hobbies & Interests', path: '/hobbies' },
  { label: 'Contact', path: '/contact' },
  { label: 'Admin Panel', path: '/admin' },
];

export default function TopNavbar() {
  const { profile } = usePortfolioData();
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const moreRef = useRef(null);
  const closeTimerRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onOutside = (e) => {
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const openMore = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setMoreOpen(true);
  };

  const scheduleCloseMore = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setMoreOpen(false), 180);
  };

  const isMoreActive = MORE_LINKS.some((item) => item.path === location.pathname);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'bg-[#fcfbf8]/85 dark:bg-[#050814]/88 backdrop-blur-md border-b border-black/10 dark:border-white/10'
          : 'bg-transparent backdrop-blur-[2px]'
      }`}
    >
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Left: Editorial Navigation Links */}
        <nav aria-label="Primary Navigation" className="hidden lg:flex items-center gap-4 xl:gap-6">
          {PRIMARY_LINKS.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) =>
                `group relative py-1 text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-[#1B1B1E] dark:text-white'
                    : 'text-zinc-600 hover:text-[#1B1B1E] dark:text-zinc-400 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full accent-gradient-bg transition-transform duration-200 origin-left ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}

          {/* More Dropdown for Experience, Certifications, Resume, Hobbies, Contact, Admin */}
          <div
            ref={moreRef}
            className="relative"
            onMouseEnter={openMore}
            onMouseLeave={scheduleCloseMore}
          >
            <button
              type="button"
              onClick={() => (moreOpen ? setMoreOpen(false) : openMore())}
              aria-expanded={moreOpen}
              className={`relative inline-flex items-center gap-1 py-1 text-sm font-medium whitespace-nowrap transition-colors ${
                isMoreActive || moreOpen
                  ? 'text-[#1B1B1E] dark:text-white'
                  : 'text-zinc-600 hover:text-[#1B1B1E] dark:text-zinc-400 dark:hover:text-white'
              }`}
            >
              <span>More</span>
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-150 ${
                  moreOpen ? 'rotate-180' : ''
                }`}
                aria-hidden="true"
              />
              {isMoreActive && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full accent-gradient-bg"
                />
              )}
            </button>

            {moreOpen && (
              <div
                onMouseEnter={openMore}
                onMouseLeave={scheduleCloseMore}
                className="absolute left-0 top-full pt-2.5"
              >
                <div className="editorial-card w-56 rounded-2xl p-2">
                  {MORE_LINKS.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMoreOpen(false)}
                      className={({ isActive }) =>
                        `block rounded-xl px-3.5 py-2 text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#1B1B1E] text-white dark:bg-[#F4F3EF] dark:text-[#121318]'
                            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-white/10'
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Left Hamburger */}
        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/15 text-[#1B1B1E] dark:border-white/15 dark:text-white lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        {/* Center: Rounded N▼HG Logo */}
        <Link
          to="/"
          aria-label="Nayana H G Home"
          className="flex h-12 min-w-[3.25rem] items-center justify-center gap-0.5 rounded-full border-2 border-[#1B1B1E] bg-[#1B1B1E] px-2 text-xs font-bold tracking-wider text-[#FAF9F6] transition-transform duration-200 hover:scale-105 dark:border-[#F4F3EF] dark:bg-[#F4F3EF] dark:text-[#121318] lg:absolute lg:left-1/2 lg:-translate-x-1/2"
        >
          <span>N</span>
          <svg
            viewBox="0 0 10 8"
            aria-hidden="true"
            className="h-2 w-2.5 shrink-0 fill-violet-400 dark:fill-violet-600"
          >
            <polygon points="0,0 10,0 5,8" />
          </svg>
          <span>HG</span>
        </Link>

        {/* Right: LinkedIn, GitHub & Light/Dark Theme Switch */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            title="LinkedIn"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/12 text-zinc-700 transition-all hover:-translate-y-0.5 hover:border-violet-600 hover:text-violet-700 dark:border-white/15 dark:text-zinc-300 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
          >
            <Linkedin className="h-4 w-4" aria-hidden="true" />
          </a>

          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            title="GitHub"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/12 text-zinc-700 transition-all hover:-translate-y-0.5 hover:border-violet-600 hover:text-violet-700 dark:border-white/15 dark:text-zinc-300 dark:hover:border-cyan-400 dark:hover:text-cyan-400"
          >
            <Github className="h-4 w-4" aria-hidden="true" />
          </a>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="inline-flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[#1B1B1E] text-[#FAF9F6] transition-transform hover:scale-105 dark:bg-[#F4F3EF] dark:text-[#121318]"
          >
            {theme === 'light' ? (
              <Moon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Sun className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Responsive Mobile Navigation Drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile Navigation"
          className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-black/10 bg-[#fcfbf8]/95 px-4 py-5 backdrop-blur-md dark:border-white/10 dark:bg-[#050814]/95 lg:hidden"
        >
          <div className="grid grid-cols-2 gap-2.5">
            {[...PRIMARY_LINKS, ...MORE_LINKS].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `flex min-h-[44px] items-center rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#1B1B1E] text-white dark:bg-[#F4F3EF] dark:text-[#121318]'
                      : 'border border-black/10 text-zinc-700 dark:border-white/10 dark:text-zinc-300'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 border-t border-black/10 pt-4 dark:border-white/10">
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-300"
            >
              LinkedIn
            </a>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-300"
            >
              GitHub
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="text-xs font-medium text-zinc-600 hover:text-violet-600 dark:text-zinc-300"
            >
              Email
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
