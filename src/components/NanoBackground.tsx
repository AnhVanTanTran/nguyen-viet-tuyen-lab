import { useEffect, useRef } from 'react';
import { createNanoScene, type NanoScene } from '../lib/nanoScene';

/** Fixed decorative layer behind every page. `intensity` runs from 0 (off) to 1. */
export function NanoBackground({ intensity }: { intensity: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const scene = useRef<NanoScene | null>(null);

  useEffect(() => {
    scene.current = createNanoScene(canvas.current!, intensity);
    return () => scene.current?.destroy();
    // The scene is created once; later changes go through setIntensity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scene.current?.setIntensity(intensity);
  }, [intensity]);

  return <canvas ref={canvas} aria-hidden="true" className="nano-bg" />;
}
