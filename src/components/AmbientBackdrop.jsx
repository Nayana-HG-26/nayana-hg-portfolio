import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function AmbientBackdrop() {
  const canvasRef = useRef(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return undefined;

    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    let animId = 0;
    let width = 0;
    let height = 0;
    let particles = [];

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      const count = Math.min(52, Math.max(24, Math.floor((width * height) / 28000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.8 + 0.7,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.4 + 0.16,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const isDark = theme === 'dark';

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(125, 211, 252, ${p.alpha})`
          : `rgba(109, 40, 217, ${p.alpha * 0.45})`;
        ctx.fill();
      }

      animId = window.requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      window.cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden transition-colors duration-500"
    >
      {/* Base Atmospheric Gradient */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          theme === 'dark'
            ? 'bg-[radial-gradient(ellipse_80%_60%_at_15%_10%,rgba(99,102,241,0.20),transparent_60%),radial-gradient(ellipse_70%_55%_at_85%_20%,rgba(6,182,212,0.16),transparent_58%),radial-gradient(ellipse_60%_50%_at_50%_95%,rgba(139,92,246,0.14),transparent_65%),linear-gradient(180deg,#050814_0%,#0a1126_55%,#04060f_100%)]'
            : 'bg-[radial-gradient(ellipse_75%_55%_at_12%_8%,rgba(124,58,237,0.10),transparent_60%),radial-gradient(ellipse_70%_55%_at_88%_18%,rgba(6,182,212,0.11),transparent_58%),radial-gradient(ellipse_65%_50%_at_50%_92%,rgba(99,102,241,0.08),transparent_65%),linear-gradient(180deg,#fcfbf8_0%,#f4f2ec_58%,#efede7_100%)]'
        }`}
      />

      {/* Subtle Architectural Dot Grid */}
      <div
        className={`absolute inset-0 ${
          theme === 'dark' ? 'opacity-[0.22]' : 'opacity-[0.35]'
        }`}
        style={{
          backgroundImage:
            theme === 'dark'
              ? 'radial-gradient(rgba(148, 163, 184, 0.35) 1px, transparent 1px)'
              : 'radial-gradient(rgba(27, 27, 30, 0.16) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 45%, black 35%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 85% 75% at 50% 45%, black 35%, transparent 100%)',
        }}
      />

      {/* Floating Ambient Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
