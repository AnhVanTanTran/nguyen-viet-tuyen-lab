import { useState } from 'react';
import type { Photo } from '../data/types';
import { asset } from '../lib/asset';
import { Lightbox } from './Lightbox';

/** Thumbnails share one 4:3 frame so every album lines up. The full, uncropped photo opens on click. */
export function PhotoGrid({ photos, title, className = '', contain = false }: { photos: Photo[]; title: string; className?: string; contain?: boolean }) {
  const [start, setStart] = useState<number | null>(null);
  return (
    <>
      <ul className={`grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 ${className}`}>
        {photos.map((p, i) => (
          <li key={p.src}>
            <button type="button" onClick={() => setStart(i)} className="block w-full cursor-zoom-in" aria-label={`Open photo ${i + 1} of ${photos.length}: ${title}`}>
              <img src={asset(p.thumb)} alt="" width={p.width} height={p.height} loading="lazy" decoding="async" className={`aspect-[4/3] w-full bg-panel transition-opacity hover:opacity-85 ${contain ? 'object-contain' : 'object-cover'}`} />
            </button>
          </li>
        ))}
      </ul>
      {start !== null && (
        <Lightbox images={photos.map((p) => ({ src: asset(p.src), alt: `Photo: ${title}`, caption: title }))} start={start} onClose={() => setStart(null)} />
      )}
    </>
  );
}
