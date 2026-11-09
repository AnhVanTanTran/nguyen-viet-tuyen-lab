import { useEffect, useRef, useState } from 'react';
import { asset } from '../lib/asset';
import { prefersReducedMotion } from '../lib/motion';

/** A card image that plays a short muted loop while its `.group` parent is hovered or focused. `video` has no file extension. */
export function HoverLoop({ poster, video, width, height, className }: { poster: string; video: string; width: number; height: number; className: string }) {
  const el = useRef<HTMLVideoElement>(null);
  const [live] = useState(() => !prefersReducedMotion() && window.matchMedia('(hover: hover)').matches);

  useEffect(() => {
    const v = el.current;
    const host = v?.closest<HTMLElement>('.group');
    if (!v || !host) return;
    const play = () => {
      v.play().catch(() => undefined);
    };
    const stop = () => {
      v.pause();
      v.currentTime = 0;
    };
    host.addEventListener('mouseenter', play);
    host.addEventListener('mouseleave', stop);
    host.addEventListener('focusin', play);
    host.addEventListener('focusout', stop);
    return () => {
      host.removeEventListener('mouseenter', play);
      host.removeEventListener('mouseleave', stop);
      host.removeEventListener('focusin', play);
      host.removeEventListener('focusout', stop);
    };
  }, [live]);

  if (!live) return <img src={asset(poster)} alt="" width={width} height={height} loading="lazy" className={className} />;
  return (
    <video ref={el} poster={asset(poster)} width={width} height={height} muted loop playsInline preload="none" aria-hidden="true" className={className}>
      <source src={asset(`${video}.webm`)} type="video/webm" />
      <source src={asset(`${video}.mp4`)} type="video/mp4" />
    </video>
  );
}
