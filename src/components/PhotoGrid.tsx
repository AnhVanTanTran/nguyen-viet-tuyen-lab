import { useState } from 'react';
import type { Photo } from '../data/types';
import { asset } from '../lib/asset';
import { Lightbox } from './Lightbox';

/**
 * By default thumbnails share one 4:3 frame so every list lines up.
 * With `whole`, nothing is cropped: photos sit in rows of equal height and each takes the width
 * its own shape needs (a lone photo is shown large). The full photo opens on click either way.
 */
export function PhotoGrid({
  photos,
  title,
  className = '',
  contain = false,
  whole = false
}: {
  photos: Photo[];
  title: string;
  className?: string;
  contain?: boolean;
  whole?: boolean;
}) {
  const [start, setStart] = useState<number | null>(null);
  const label = (i: number) => `Open photo ${i + 1} of ${photos.length}: ${title}`;

  let body;
  if (whole && photos.length === 1) {
    const p = photos[0];
    body = (
      <button type="button" onClick={() => setStart(0)} className={`block max-w-full cursor-zoom-in ${className}`} aria-label={label(0)}>
        <img src={asset(p.src)} alt="" width={p.width} height={p.height} decoding="async" className="block h-auto max-h-[80vh] w-auto max-w-full bg-panel transition-opacity hover:opacity-85" />
      </button>
    );
  } else if (whole) {
    body = (
      <ul className={`flex flex-wrap gap-2 [--rh:120px] after:grow-[1000] after:content-[''] sm:[--rh:170px] md:gap-3 lg:[--rh:220px] ${className}`}>
        {photos.map((p, i) => {
          const r = p.width / p.height;
          return (
            <li key={p.src} className="min-w-0" style={{ flexGrow: r, flexBasis: `calc(var(--rh) * ${r.toFixed(4)})` }}>
              <button type="button" onClick={() => setStart(i)} className="block w-full cursor-zoom-in" aria-label={label(i)}>
                <img src={asset(p.thumb)} alt="" width={p.width} height={p.height} loading="lazy" decoding="async" className="block h-auto w-full bg-panel transition-opacity hover:opacity-85" />
              </button>
            </li>
          );
        })}
      </ul>
    );
  } else {
    body = (
      <ul className={`grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4 ${className}`}>
        {photos.map((p, i) => (
          <li key={p.src}>
            <button type="button" onClick={() => setStart(i)} className="block w-full cursor-zoom-in" aria-label={label(i)}>
              <img src={asset(p.thumb)} alt="" width={p.width} height={p.height} loading="lazy" decoding="async" className={`aspect-[4/3] w-full bg-panel transition-opacity hover:opacity-85 ${contain ? 'object-contain' : 'object-cover'}`} />
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      {body}
      {start !== null && (
        <Lightbox images={photos.map((p) => ({ src: asset(p.src), alt: `Photo: ${title}`, caption: title }))} start={start} onClose={() => setStart(null)} />
      )}
    </>
  );
}
