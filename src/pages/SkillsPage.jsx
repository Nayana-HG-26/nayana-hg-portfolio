import { useState } from 'react';
import { motion } from 'motion/react';
import PageShell from '../components/PageShell.jsx';
import { SKILL_CATEGORIES } from '../data/portfolioData.js';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';

const RING_RADII = {
  1: { rx: 19, ry: 17 },
  2: { rx: 30, ry: 28 },
  3: { rx: 40, ry: 39 },
};

export default function SkillsPage() {
  const { skills } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeSkill, setActiveSkill] = useState(null);

  return (
    <PageShell
      kicker="02 · Capabilities"
      title="Skills & Technology Orbit."
      subtitle="Interactive map of programming languages, frontend interfaces, backend servers, databases, and engineering tools."
    >
      {/* Category Filter Strip */}
      <div className="mb-8 flex flex-wrap items-center gap-2 sm:gap-2.5">
        {SKILL_CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => {
                setSelectedCategory(cat.key);
                setActiveSkill(null);
              }}
              className={`min-h-[38px] rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                active
                  ? 'bg-[#1B1B1E] text-[#FAF9F6] dark:bg-[#F4F3EF] dark:text-[#121318]'
                  : 'border border-black/15 text-zinc-700 hover:border-violet-600 dark:border-white/15 dark:text-zinc-300 dark:hover:border-cyan-400'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Concentric Elliptical Orbit Visualization — Proportioned for Mobile & Desktop */}
      <div className="editorial-card relative mx-auto overflow-hidden rounded-[2rem] p-3 sm:p-8">
        <div className="relative mx-auto aspect-square w-full max-w-[820px] min-h-[320px] sm:aspect-[4/3] sm:min-h-[420px]">
          {/* Concentric Elliptical SVG Rings */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <ellipse
              cx="50"
              cy="50"
              rx="19"
              ry="17"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.24"
              strokeDasharray="1.2 1.2"
              className="text-zinc-400/70 dark:text-zinc-600"
            />
            <ellipse
              cx="50"
              cy="50"
              rx="30"
              ry="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.24"
              className="text-zinc-300 dark:text-zinc-700"
            />
            <ellipse
              cx="50"
              cy="50"
              rx="40"
              ry="39"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.24"
              strokeDasharray="1.5 1.2"
              className="text-zinc-400/60 dark:text-zinc-600"
            />
          </svg>

          {/* Central Node: Technology */}
          <motion.button
            type="button"
            whileHover={{ scale: 1.07 }}
            onClick={() => {
              setSelectedCategory('all');
              setActiveSkill(null);
            }}
            className="absolute left-1/2 top-1/2 z-20 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#1B1B1E] text-[10px] font-bold tracking-wide text-[#FAF9F6] shadow-xl ring-4 ring-violet-500/20 dark:bg-[#F4F3EF] dark:text-[#121318] dark:ring-cyan-400/25 sm:h-24 sm:w-24 sm:text-sm"
          >
            Technology
          </motion.button>

          {/* Floating Orbital Skill Pills */}
          {skills.map((skill, idx) => {
            const radii = RING_RADII[skill.ring] || RING_RADII[2];
            const rad = (skill.angle * Math.PI) / 180;
            const leftPct = 50 + radii.rx * Math.cos(rad);
            const topPct = 50 + radii.ry * Math.sin(rad);
            const matchesFilter =
              selectedCategory === 'all' || skill.category === selectedCategory;
            const isSelected = activeSkill?.id === skill.id;

            return (
              <motion.button
                key={skill.id}
                type="button"
                onClick={() => setActiveSkill(skill)}
                onMouseEnter={() => setActiveSkill(skill)}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{
                  opacity: matchesFilter ? 1 : 0.22,
                  scale: isSelected ? 1.12 : 1,
                  y: [0, idx % 2 === 0 ? -4 : 4, 0],
                }}
                transition={{
                  opacity: { duration: 0.25 },
                  scale: { duration: 0.2 },
                  y: {
                    duration: 3.4 + (idx % 4) * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
                style={{
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                }}
                className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap shadow-sm transition-colors sm:px-4 sm:py-2 sm:text-xs ${
                  isSelected
                    ? 'accent-gradient-bg text-white shadow-md'
                    : 'border border-black/15 bg-[#1B1B1E] text-[#FAF9F6] hover:bg-violet-700 dark:border-white/20 dark:bg-[#F4F3EF] dark:text-[#121318] dark:hover:bg-cyan-400'
                }`}
              >
                {skill.name}
              </motion.button>
            );
          })}
        </div>

        {/* Selected Skill Detail Bar */}
        <div className="mt-5 flex flex-col items-start justify-between gap-3 border-t border-black/10 px-2 pt-5 dark:border-white/10 sm:mt-6 sm:flex-row sm:items-center sm:px-0">
          {activeSkill ? (
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-violet-700 dark:text-cyan-400">
                {activeSkill.category}
              </p>
              <p className="mt-0.5 text-base font-bold text-[#1B1B1E] dark:text-white">
                {activeSkill.name}
              </p>
              <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
                {activeSkill.note}
              </p>
            </div>
          ) : (
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Tap or hover any orbiting technology label above to inspect its role.
            </p>
          )}
        </div>
      </div>
    </PageShell>
  );
}
