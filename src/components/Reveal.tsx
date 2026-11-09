import { useEffect, useRef, useState, type ReactNode } from 'react';
import { prefersReducedMotion } from '../lib/motion';

/** Fades a block in the first time it scrolls into view. Stays put after that. */
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(() => prefersReducedMotion() || !('IntersectionObserver' in window));

  useEffect(() => {
    if (seen || !box.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setSeen(true);
      },
      { rootMargin: '0px 0px -6% 0px' },
    );
    io.observe(box.current);
    return () => io.disconnect();
  }, [seen]);

  return (
    <div ref={box} className={`reveal ${seen ? 'is-in' : ''} ${className}`}>
      {children}
    </div>
  );
}
