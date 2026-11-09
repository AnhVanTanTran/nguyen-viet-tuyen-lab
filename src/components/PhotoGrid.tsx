import { useState } from 'react';
import type { Photo } from '../data/types';
import { asset } from '../lib/asset';
import { Lightbox } from './Lightbox';

export function PhotoGrid({ photos, title, limit, className = '' }: { photos: Photo[]; title: string; limit?: number; className?: string }) {
  const [start, setStart] = useState<number | null>(null);
  const shown = limit ? photos.slice(0, limit) : photos;
  const hidden = photos.length - shown.length;
  return (
    <>
      <ul className={className}>
        {shown.map((p, i) => (
          <li key={p.src} className="relative mb-2.5 break-inside-avoid">
            <button type="button" onClick={() => setStart(i)} className="block w-full cursor-zoom-in overflow-hidden rounded-xl" aria-label={`Open photo ${i + 1} of ${photos.length}: ${title}`}>
              <img src={asset(p.thumb)} alt="" width={p.width} height={p.height} loading="lazy" decoding="async" className="h-auto w-full bg-mist" />
            </button>
            {hidden > 0 && i === shown.length - 1 && (
              <span className="pointer-events-none absolute inset-0 grid place-items-center rounded-xl bg-ink/55 text-[1.05rem] text-white">
                {hidden} more
              </span>
            )}
          </li>
        ))}
      </ul>
      {start !== null && (
        <Lightbox images={photos.map((p) => ({ src: asset(p.src), alt: `Photo: ${title}`, caption: title }))} start={start} onClose={() => setStart(null)} />
      )}
    </>
  );
}
