const line = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export function Chevron({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 8 14" aria-hidden="true" className={className}>
      <path d="M1 1l6 6-6 6" strokeWidth="1.5" {...line} />
    </svg>
  );
}

export function CircleArrow({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" className={className}>
      <circle cx="16" cy="16" r="14.5" strokeWidth="1.5" {...line} />
      <path d="M9 16h14M17 10l6 6-6 6" strokeWidth="1.5" {...line} />
    </svg>
  );
}

export function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <circle cx="8" cy="8" r="6" strokeWidth="2" {...line} />
      <path d="M13 13l6 6" strokeWidth="2.4" {...line} />
    </svg>
  );
}

export function MenuIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 18 14" aria-hidden="true" className={className}>
      <path d="M1 1.5h16M1 7h16M1 12.5h16" strokeWidth="1.8" {...line} />
    </svg>
  );
}
