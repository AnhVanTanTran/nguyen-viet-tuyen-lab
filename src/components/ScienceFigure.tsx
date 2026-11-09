import { useState } from 'react';
import type { ResearchFigure } from '../data/types';
import { asset } from '../lib/asset';
import { Lightbox } from './Lightbox';

/** Shows a research figure whole: no cropping, original proportions, opens at full size. */
export function ScienceFigure({ figure, label, className = '' }: { figure: ResearchFigure; label: string; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <figure className={className}>
      <button type="button" onClick={() => setOpen(true)} className="block w-full cursor-zoom-in border border-panel bg-white p-3" aria-label={`Open ${label} at full size`}>
        <img src={asset(figure.src)} alt={figure.alt} width={figure.width} height={figure.height} loading="lazy" className="h-auto w-full" />
      </button>
      <figcaption className="mt-2 text-[12.6px] leading-[18px] text-muted">{label}</figcaption>
      {open && <Lightbox images={[{ src: asset(figure.src), alt: figure.alt, caption: label, figure: true }]} start={0} onClose={() => setOpen(false)} />}
    </figure>
  );
}
