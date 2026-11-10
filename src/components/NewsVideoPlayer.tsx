import type { NewsVideo } from '../data/types';
import { asset } from '../lib/asset';

/** Plays only on the visitor's click, with sound and the browser's own controls. */
export function NewsVideoPlayer({ video, title, className = '' }: { video: NewsVideo; title: string; className?: string }) {
  return (
    <video
      controls
      playsInline
      preload="metadata"
      poster={asset(video.poster)}
      width={video.width}
      height={video.height}
      aria-label={`Video: ${title}`}
      className={`block aspect-video w-full bg-black ${className}`}
    >
      <source src={asset(video.src)} type="video/mp4" />
    </video>
  );
}
