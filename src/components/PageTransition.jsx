import { motion } from 'motion/react';

export default function PageTransition({ variant = 'wipe' }) {
  if (variant === 'vertical') {
    return (
      <>
        <motion.div
          aria-hidden="true"
          initial={{ y: '0%' }}
          animate={{ y: '-100%' }}
          transition={{ duration: 0.52, ease: [0.77, 0, 0.175, 1] }}
          className="pointer-events-none fixed inset-0 z-[70] bg-[#1B1B1E] dark:bg-[#050814]"
        />
        <motion.div
          aria-hidden="true"
          initial={{ y: '0%' }}
          animate={{ y: '-100%' }}
          transition={{ duration: 0.56, delay: 0.1, ease: [0.77, 0, 0.175, 1] }}
          className="pointer-events-none fixed inset-0 z-[69] accent-gradient-bg opacity-90"
        />
        <motion.div
          aria-hidden="true"
          initial={{ y: '0%' }}
          animate={{ y: '-100%' }}
          transition={{ duration: 0.58, delay: 0.18, ease: [0.77, 0, 0.175, 1] }}
          className="pointer-events-none fixed inset-0 z-[68] bg-[#f8f6f0] dark:bg-[#0b1126]"
        />
      </>
    );
  }

  if (variant === 'wipe-left') {
    return (
      <>
        <motion.div
          aria-hidden="true"
          initial={{ x: '0%' }}
          animate={{ x: '-100%' }}
          transition={{ duration: 0.52, ease: [0.77, 0, 0.175, 1] }}
          className="pointer-events-none fixed inset-0 z-[70] bg-[#1B1B1E] dark:bg-[#050814]"
        />
        <motion.div
          aria-hidden="true"
          initial={{ x: '0%' }}
          animate={{ x: '-100%' }}
          transition={{ duration: 0.56, delay: 0.1, ease: [0.77, 0, 0.175, 1] }}
          className="pointer-events-none fixed inset-0 z-[69] accent-gradient-bg opacity-90"
        />
        <motion.div
          aria-hidden="true"
          initial={{ x: '0%' }}
          animate={{ x: '-100%' }}
          transition={{ duration: 0.58, delay: 0.18, ease: [0.77, 0, 0.175, 1] }}
          className="pointer-events-none fixed inset-0 z-[68] bg-[#f8f6f0] dark:bg-[#0b1126]"
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        aria-hidden="true"
        initial={{ x: '0%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 0.52, ease: [0.77, 0, 0.175, 1] }}
        className="pointer-events-none fixed inset-0 z-[70] bg-[#1B1B1E] dark:bg-[#050814]"
      />
      <motion.div
        aria-hidden="true"
        initial={{ x: '0%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 0.56, delay: 0.1, ease: [0.77, 0, 0.175, 1] }}
        className="pointer-events-none fixed inset-0 z-[69] accent-gradient-bg opacity-90"
      />
      <motion.div
        aria-hidden="true"
        initial={{ x: '0%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 0.58, delay: 0.18, ease: [0.77, 0, 0.175, 1] }}
        className="pointer-events-none fixed inset-0 z-[68] bg-[#f8f6f0] dark:bg-[#0b1126]"
      />
    </>
  );
}
