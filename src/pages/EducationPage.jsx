import { useRef } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { GraduationCap, MapPin } from 'lucide-react';
import PageShell from '../components/PageShell.jsx';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';

export default function EducationPage() {
  const { education } = usePortfolioData();
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 60%'],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  return (
    <PageShell
      kicker="03 · Academic Timeline"
      title="Education."
      subtitle="Postgraduate MCA studies in Bangalore built upon a BCA foundation in Tumakuru."
    >
      <div ref={timelineRef} className="relative mx-auto max-w-4xl pl-8 sm:pl-14">
        {/* Static Track Line */}
        <div
          aria-hidden="true"
          className="absolute left-3 top-2 bottom-2 w-[2px] bg-zinc-200 dark:bg-zinc-800 sm:left-6"
        />

        {/* Animated Purple-to-Cyan Scroll Progress Line */}
        <motion.div
          aria-hidden="true"
          style={{ scaleY }}
          className="absolute left-3 top-2 bottom-2 w-[2px] origin-top accent-gradient-bg sm:left-6"
        />

        <div className="space-y-10">
          {education.map((edu, index) => (
            <motion.article
              key={edu.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="relative"
            >
              {/* Timeline Circular Indicator */}
              <span
                aria-hidden="true"
                className="absolute -left-[29px] top-6 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#1B1B1E] bg-[#FAF9F6] dark:border-[#F4F3EF] dark:bg-[#121318] sm:-left-[41px]"
              >
                <span className="h-2 w-2 rounded-full accent-gradient-bg" />
              </span>

              <div className="editorial-card rounded-3xl p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-violet-700 dark:text-cyan-400">
                    <GraduationCap className="h-4 w-4" aria-hidden="true" />
                    {edu.status}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-xs text-zinc-500 dark:text-zinc-400">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    {edu.location}
                  </span>
                </div>

                <h2 className="accent-gradient-text mt-3 text-xl font-extrabold tracking-tight sm:text-2xl">
                  {edu.degree}
                </h2>
                <p className="mt-1 text-sm font-semibold text-[#1B1B1E] dark:text-zinc-200 sm:text-base">
                  {edu.institution}
                </p>

                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  {edu.highlights.map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-600 dark:bg-cyan-400"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
