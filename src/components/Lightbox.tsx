import { useCallback, useEffect, useRef, useState } from 'react';

export interface LightboxImage {
  src: string;
  alt: string;
  caption?: string;
  /** Scientific figures sit on white and are never cropped. */
  figure?: boolean;
}

export function Lightbox({
  images,
  start,
  onClose,
}: {
  images: LightboxImage[];
  start: number;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(start);
  const many = images.length > 1;
  const go = useCallback((d: number) => setI((v) => (v + d + images.length) % images.length), [images.length]);

  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
    return () => el?.close();
  }, []);

  const img = images[i];
  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label="Image viewer"
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' && many) go(1);
        if (e.key === 'ArrowLeft' && many) go(-1);
      }}
    >
      <div className="flex h-full flex-col">
        <div className="wrap flex h-16 shrink-0 items-center justify-between">
          <p className="text-[0.9rem] text-graphite" aria-live="polite">
            {many ? `${i + 1} of ${images.length}` : ''}
          </p>
          <button type="button" autoFocus onClick={() => ref.current?.close()} className="rounded-full border border-mist px-4 py-1.5 text-[0.9rem] hover:border-graphite">
            Close
          </button>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center px-3 sm:px-8">
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className={`max-h-full max-w-full rounded-lg object-contain ${img.figure ? 'bg-white p-3' : ''}`}
          />
        </div>
        <div className="wrap flex shrink-0 flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p lang="vi" className="max-w-[60ch] font-serif text-[1rem] leading-snug text-graphite">
            {img.caption}
          </p>
          {many && (
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => go(-1)} className="rounded-full border border-mist px-4 py-1.5 text-[0.9rem] hover:border-graphite">
                Previous
              </button>
              <button type="button" onClick={() => go(1)} className="rounded-full border border-mist px-4 py-1.5 text-[0.9rem] hover:border-graphite">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
