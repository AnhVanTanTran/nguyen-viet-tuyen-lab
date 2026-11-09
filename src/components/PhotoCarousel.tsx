import { useCallback, useEffect, useRef, useState } from 'react';
import type { Photo } from '../data/types';
import { asset } from '../lib/asset';
import { Chevron } from './Icons';
import { Lightbox } from './Lightbox';

/** A row of photos that advances by one screenful. Three across on a computer, one on a phone. */
export function PhotoCarousel({ photos, title }: { photos: Photo[]; title: string }) {
  const track = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const [held, setHeld] = useState(false);

  const move = useCallback((dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const end = el.scrollWidth - el.clientWidth;
    let next = el.scrollLeft + dir * (el.clientWidth + 20);
    if (dir === 1 && el.scrollLeft >= end - 4) next = 0;
    if (dir === -1 && el.scrollLeft <= 4) next = end;
    el.scrollTo({ left: next, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (held || open !== null || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => move(1), 5000);
    return () => window.clearInterval(timer);
  }, [held, open, move]);

  const arrow = 'absolute top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center bg-black/55 text-white hover:bg-black/75';

  return (
    <section aria-label={title} className="relative" onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)} onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
      <ul ref={track} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto">
        {photos.map((p, i) => (
          <li key={p.src} className="w-full shrink-0 snap-start sm:w-[calc((100%-20px)/2)] lg:w-[calc((100%-40px)/3)]">
            <button type="button" onClick={() => setOpen(i)} className="block w-full cursor-zoom-in" aria-label={`Open photo ${i + 1} of ${photos.length}: ${title}`}>
              <img src={asset(p.src)} alt="" width={p.width} height={p.height} loading={i < 3 ? 'eager' : 'lazy'} decoding="async" className="aspect-[4/3] w-full bg-panel object-cover" />
            </button>
          </li>
        ))}
      </ul>
      <button type="button" onClick={() => move(-1)} aria-label="Previous photos" className={`${arrow} left-0`}>
        <Chevron className="h-[16px] w-[9px] rotate-180" />
      </button>
      <button type="button" onClick={() => move(1)} aria-label="Next photos" className={`${arrow} right-0`}>
        <Chevron className="h-[16px] w-[9px]" />
      </button>
      {open !== null && (
        <Lightbox images={photos.map((p) => ({ src: asset(p.src), alt: `Photo: ${title}`, caption: title }))} start={open} onClose={() => setOpen(null)} />
      )}
    </section>
  );
}
