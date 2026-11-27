import { Link } from 'react-router-dom';

export default function HireMeBadge({ className = '' }) {
  return (
    <div className={`relative flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32 ${className}`}>
      {/* Rotating Circular SVG Typography Ring */}
      <svg
        viewBox="0 0 120 120"
        aria-hidden="true"
        className="hire-spin h-full w-full fill-current text-[#1B1B1E] dark:text-[#F4F3EF]"
      >
        <defs>
          <path
            id="hireCirclePath"
            d="M 60, 60 m -44, 0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
          />
        </defs>
        <text className="font-mono text-[10.4px] font-semibold uppercase tracking-[2.5px]">
          <textPath href="#hireCirclePath" startOffset="0%">
            SOFTWARE & AI ENTHUSIASTIC • WEB DEVELOPER •
          </textPath>
        </text>
      </svg>

      {/* Center Circular Action */}
      <Link
        to="/contact"
        className="absolute flex h-14 w-14 items-center justify-center rounded-full border border-[#1B1B1E] bg-[#1B1B1E] text-center text-[10px] font-bold leading-tight text-[#FAF9F6] shadow-md transition-all hover:scale-105 hover:bg-violet-700 hover:border-violet-700 dark:border-[#F4F3EF] dark:bg-[#F4F3EF] dark:text-[#121318] dark:hover:bg-cyan-400 dark:hover:border-cyan-400 sm:h-16 sm:w-16 sm:text-[11px]"
      >
        Hire Me
      </Link>
    </div>
  );
}
