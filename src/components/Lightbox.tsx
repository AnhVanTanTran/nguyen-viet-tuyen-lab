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
          <p className="text-[14px] text-white/80" aria-live="polite">
            {many ? `${i + 1} of ${images.length}` : ''}
          </p>
          <button type="button" autoFocus onClick={() => ref.current?.close()} className="border border-white/40 px-4 py-1.5 text-[14px] hover:bg-white/15">
            Close
          </button>
        </div>
        <div className="flex min-h-0 flex-1 items-center justify-center px-3 sm:px-8">
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className={`max-h-full max-w-full object-contain ${img.figure ? 'bg-white p-3' : ''}`}
          />
        </div>
        <div className="wrap flex shrink-0 flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p lang="vi" className="max-w-[70ch] text-[14px] leading-[20px] text-white/85">
            {img.caption}
          </p>
          {many && (
            <div className="flex shrink-0 gap-2">
              <button type="button" onClick={() => go(-1)} className="border border-white/40 px-4 py-1.5 text-[14px] hover:bg-white/15">
                Previous
              </button>
              <button type="button" onClick={() => go(1)} className="border border-white/40 px-4 py-1.5 text-[14px] hover:bg-white/15">
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
