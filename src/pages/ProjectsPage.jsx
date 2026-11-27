import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, ExternalLink, FolderGit2, Globe, X } from 'lucide-react';
import PageShell from '../components/PageShell.jsx';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';

export default function ProjectsPage() {
  const { projects } = usePortfolioData();
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!selected) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setSelected(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selected]);

  const featuredProject = projects[0];
  const remainingProjects = projects.slice(1);

  return (
    <PageShell
      kicker="04 · Editorial Showcase"
      title="Imagination Trumps Knowledge!"
      subtitle="Selected software engineering and academic projects designed with practical architecture and clean user interfaces."
    >
      {/* Featured Editorial Project Spread */}
      {featuredProject && (
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="editorial-frame mb-12 grid items-center gap-8 rounded-[2rem] p-6 sm:p-8 lg:grid-cols-12"
        >
          <div className="overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800 lg:col-span-6">
            <img
              src={featuredProject.image}
              alt={featuredProject.title}
              referrerPolicy="no-referrer"
              className="aspect-[16/10] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
            />
          </div>

          <div className="lg:col-span-6">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-violet-700 dark:text-cyan-400">
              {featuredProject.number} · Featured · {featuredProject.category}
            </p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#1B1B1E] dark:text-white sm:text-3xl">
              {featuredProject.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-base">
              {featuredProject.description}
            </p>

            {featuredProject.features?.length > 0 && (
              <ul className="mt-4 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-300 sm:text-sm">
                {featuredProject.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2">
                    <Check
                      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-violet-700 dark:text-cyan-400"
                      aria-hidden="true"
                    />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              {featuredProject.techStack.join(' · ')}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {featuredProject.githubUrl && (
                <a
                  href={featuredProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-[#1B1B1E] px-5 py-2 text-xs font-semibold text-[#FAF9F6] transition-colors hover:bg-violet-700 dark:bg-[#F4F3EF] dark:text-[#121318] dark:hover:bg-cyan-400"
                >
                  <FolderGit2 className="h-4 w-4" aria-hidden="true" />
                  GitHub Repository
                </a>
              )}
              {featuredProject.liveUrl && (
                <a
                  href={featuredProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-black/20 px-4 py-2 text-xs font-semibold text-[#1B1B1E] hover:border-violet-600 dark:border-white/20 dark:text-white dark:hover:border-cyan-400"
                >
                  <Globe className="h-4 w-4" aria-hidden="true" />
                  {featuredProject.liveLabel || 'Live Demo'}
                </a>
              )}
              <button
                type="button"
                onClick={() => setSelected(featuredProject)}
                className="px-3 py-2 text-xs font-semibold underline decoration-violet-500/60 underline-offset-4 hover:text-violet-700 dark:hover:text-cyan-400"
              >
                Case Study Details
              </button>
            </div>
          </div>
        </motion.article>
      )}

      {/* Editorial Grid for Remaining Projects */}
      <div className="grid gap-8 md:grid-cols-2">
        {remainingProjects.map((project, idx) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            className="editorial-card flex flex-col justify-between overflow-hidden rounded-[1.75rem] p-6"
          >
            <div>
              <div className="overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800">
                <img
                  src={project.image}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="aspect-[16/10] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </div>

              <p className="mt-5 font-mono text-xs font-semibold uppercase tracking-[0.16em] text-violet-700 dark:text-cyan-400">
                {project.number} · {project.category}
              </p>
              <h2 className="mt-2 text-xl font-extrabold tracking-tight text-[#1B1B1E] dark:text-white sm:text-2xl">
                {project.title}
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                {project.description}
              </p>
              <p className="mt-4 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                {project.techStack.join(' · ')}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-black/10 pt-4 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-3">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`GitHub repository for ${project.title}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1B1B1E] hover:text-violet-700 dark:text-white dark:hover:text-cyan-400"
                  >
                    <FolderGit2 className="h-4 w-4" aria-hidden="true" />
                    GitHub
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 hover:underline dark:text-cyan-400"
                  >
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    {project.liveLabel || 'Live Demo'}
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelected(project)}
                className="rounded-lg border border-black/15 px-3.5 py-1.5 text-xs font-semibold text-[#1B1B1E] transition-colors hover:border-violet-600 hover:text-violet-700 dark:border-white/15 dark:text-white dark:hover:border-cyan-400 dark:hover:text-cyan-400"
              >
                View Details
              </button>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Case Study Modal */}
      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="editorial-card relative max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close project details"
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/15 text-[#1B1B1E] hover:bg-zinc-100 dark:border-white/15 dark:text-white dark:hover:bg-white/10 sm:right-5 sm:top-5"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="pr-10 font-mono text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-cyan-400">
              {selected.number} · {selected.category}
            </p>
            <h2
              id="project-modal-title"
              className="mt-2 pr-8 text-xl font-extrabold text-[#1B1B1E] dark:text-white sm:text-2xl"
            >
              {selected.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
              {selected.description}
            </p>

            {selected.features?.length > 0 && (
              <div className="mt-5">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Key Features
                </h3>
                <ul className="mt-2.5 space-y-2 text-sm text-zinc-700 dark:text-zinc-200">
                  {selected.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-violet-700 dark:text-cyan-400"
                        aria-hidden="true"
                      />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <p className="mt-5 font-mono text-xs text-zinc-500 dark:text-zinc-400">
              Stack: {selected.techStack.join(' · ')}
            </p>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-black/10 pt-5 dark:border-white/10">
              {selected.githubUrl && (
                <a
                  href={selected.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-lg bg-[#1B1B1E] px-5 py-2 text-xs font-semibold text-[#FAF9F6] dark:bg-[#F4F3EF] dark:text-[#121318]"
                >
                  <FolderGit2 className="h-4 w-4" aria-hidden="true" />
                  GitHub Repository
                </a>
              )}
              {selected.liveUrl && (
                <a
                  href={selected.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-black/20 px-4 py-2 text-xs font-semibold text-[#1B1B1E] dark:border-white/20 dark:text-white"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  {selected.liveLabel || 'Live Demo'}
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
