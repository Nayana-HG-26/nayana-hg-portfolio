import { motion } from 'motion/react';

export default function PageShell({ kicker, title, subtitle, children }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-6xl px-4 pt-8 pb-20 sm:px-6 sm:pt-14"
    >
      <header className="mb-10 max-w-4xl sm:mb-12">
        {kicker && (
          <motion.p
            initial={{ opacity: 0, x: -14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-cyan-400"
          >
            {kicker}
          </motion.p>
        )}

        <div className="mt-3 overflow-hidden pb-1.5">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl font-extrabold leading-tight tracking-tight text-[#1B1B1E] dark:text-[#F4F3EF] sm:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>
        </div>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </header>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.48, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </motion.section>
  );
}
