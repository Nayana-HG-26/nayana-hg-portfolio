import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SECTION_FLOW = [
  '/',
  '/about',
  '/skills',
  '/education',
  '/projects',
  '/experience',
  '/certifications',
  '/resume',
  '/hobbies',
  '/contact',
];

const COOLDOWN_MS = 1000;
const WHEEL_THRESHOLD = 55;
const WHEEL_RESET_MS = 320;
const HORIZONTAL_SWIPE_PX = 65;
const VERTICAL_SWIPE_PX = 75;

function isInteractiveBlocked(target) {
  if (document.querySelector('[role="dialog"], [aria-modal="true"]')) {
    return true;
  }
  if (!(target instanceof Element)) {
    return false;
  }
  return Boolean(
    target.closest('input, textarea, select, [contenteditable="true"], [data-no-section-swipe]')
  );
}

export default function SectionScrollNavigator({ enabled = true }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const cooldownUntilRef = useRef(0);
  const wheelAccumRef = useRef(0);
  const wheelDirectionRef = useRef(0);
  const lastWheelTimeRef = useRef(0);
  const touchStartRef = useRef(null);

  useEffect(() => {
    cooldownUntilRef.current = Date.now() + 850;
    wheelAccumRef.current = 0;
    wheelDirectionRef.current = 0;
  }, [pathname]);

  useEffect(() => {
    if (!enabled || pathname === '/about') return undefined;

    const currentIndex = SECTION_FLOW.indexOf(pathname);
    if (currentIndex === -1) return undefined;

    const goToStep = (step) => {
      const nextIndex = currentIndex + step;
      if (nextIndex < 0 || nextIndex >= SECTION_FLOW.length) return;
      cooldownUntilRef.current = Date.now() + COOLDOWN_MS;
      wheelAccumRef.current = 0;
      wheelDirectionRef.current = 0;
      navigate(SECTION_FLOW[nextIndex]);
    };

    const handleWheel = (event) => {
      if (event.ctrlKey || event.metaKey || isInteractiveBlocked(event.target)) {
        return;
      }

      const now = Date.now();
      if (now < cooldownUntilRef.current) {
        wheelAccumRef.current = 0;
        return;
      }

      if (Math.abs(event.deltaY) < Math.abs(event.deltaX) || Math.abs(event.deltaY) < 4) {
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);

      const atTop = scrollTop <= 4;
      const atBottom = scrollTop >= maxScroll - 4;

      if ((direction > 0 && !atBottom) || (direction < 0 && !atTop)) {
        wheelAccumRef.current = 0;
        wheelDirectionRef.current = 0;
        return;
      }

      if (
        wheelDirectionRef.current !== direction ||
        now - lastWheelTimeRef.current > WHEEL_RESET_MS
      ) {
        wheelAccumRef.current = 0;
        wheelDirectionRef.current = direction;
      }

      lastWheelTimeRef.current = now;
      wheelAccumRef.current += Math.abs(event.deltaY);

      if (wheelAccumRef.current >= WHEEL_THRESHOLD) {
        goToStep(direction);
      }
    };

    const handleTouchStart = (event) => {
      if (event.touches.length !== 1 || isInteractiveBlocked(event.target)) {
        touchStartRef.current = null;
        return;
      }
      const touch = event.touches[0];
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight);

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
        atTop: scrollTop <= 6,
        atBottom: scrollTop >= maxScroll - 6,
      };
    };

    const handleTouchEnd = (event) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;
      if (!start || event.changedTouches.length !== 1) return;
      if (Date.now() < cooldownUntilRef.current) return;
      if (Date.now() - start.time > 800) return;

      const touch = event.changedTouches[0];
      const dx = touch.clientX - start.x;
      const dy = touch.clientY - start.y;

      // Horizontal swipe anywhere on page moves forward/backward across sections
      if (Math.abs(dx) >= HORIZONTAL_SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.35) {
        goToStep(dx < 0 ? 1 : -1);
        return;
      }

      // Vertical swipe at top/bottom boundary moves to previous/next section
      if (Math.abs(dy) >= VERTICAL_SWIPE_PX && Math.abs(dy) > Math.abs(dx) * 1.4) {
        if (dy < 0 && start.atBottom) {
          goToStep(1);
        } else if (dy > 0 && start.atTop) {
          goToStep(-1);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, navigate, pathname]);

  return null;
}
