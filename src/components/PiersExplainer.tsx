import { useId, useMemo, useState, type CSSProperties } from 'react';
import { prefersReducedMotion } from '../lib/motion';

const PEAKS: [number, number, number][] = [
  [0.14, 0.32, 0.012],
  [0.29, 0.58, 0.013],
  [0.42, 0.24, 0.011],
  [0.58, 1, 0.014],
  [0.7, 0.42, 0.012],
  [0.87, 0.62, 0.015],
];
const PLOT = { x0: 36, x1: 456, y0: 252, h: 214 };
const OFF_LEVEL = 0.34;
const ARROW = { v: '#6a3fc0', b: '#1074b7', r: '#c8102e' };

function curve(level: number) {
  const n = 220;
  let d = '';
  for (let i = 0; i <= n; i++) {
    const s = i / n;
    const y = 0.035 + 0.03 * (1 - s) + level * PEAKS.reduce((sum, [c, a, w]) => sum + a / (1 + ((s - c) / w) ** 2), 0);
    d += `${i ? 'L' : 'M'}${(PLOT.x0 + s * (PLOT.x1 - PLOT.x0)).toFixed(1)} ${(PLOT.y0 - y * PLOT.h * 0.88).toFixed(1)}`;
  }
  return d;
}

const peakAt = (level: number) => PLOT.y0 - (0.05 + level) * PLOT.h * 0.88;
const peakX = PLOT.x0 + PEAKS[3][0] * (PLOT.x1 - PLOT.x0);

const steps = ['UV light excites electrons in ZnO.', 'The electrons transfer to the Au nanoparticles.', 'The Raman signal of the adsorbed molecules rises.'];

/** A teaching schematic. No value here comes from a measurement, and the figure says so. */
export function PiersExplainer() {
  const [uv, setUv] = useState(100);
  const [still] = useState(prefersReducedMotion);
  const id = useId();
  const u = uv / 100;
  const level = OFF_LEVEL + (1 - OFF_LEVEL) * u;
  const line = useMemo(() => curve(level), [level]);
  const ghost = useMemo(() => curve(OFF_LEVEL), []);

  const electrons = [
    { x: 92, show: u > 0.02, delay: '0s', still: 'translate(92px, 67px)' },
    { x: 136, show: u > 0.34, delay: '-2s', still: 'translate(214px, 80px)' },
    { x: 180, show: u > 0.67, delay: '-4s', still: 'translate(136px, 67px)' },
  ];

  return (
    <figure className="mt-2 bg-panel p-3 md:p-5">
      <div className="grid gap-3 lg:grid-cols-2 lg:gap-5">
        <svg viewBox="0 0 470 290" role="img" aria-label="Schematic: UV light lifts electrons in ZnO from the valence band to the conduction band. They move to gold, and the Raman signal rises." className="block h-auto w-full bg-white">
          <defs>
            <radialGradient id={`${id}-g`}>
              <stop offset="0" stopColor="#ffb648" stopOpacity="0.95" />
              <stop offset="1" stopColor="#ffb648" stopOpacity="0" />
            </radialGradient>
            {Object.entries(ARROW).map(([k, col]) => (
              <marker key={k} id={`${id}-${k}`} viewBox="0 0 10 10" refX="8" refY="5" markerUnits="userSpaceOnUse" markerWidth="14" markerHeight="14" orient="auto">
                <path d="M0 0L10 5L0 10z" fill={col} />
              </marker>
            ))}
          </defs>

          <g fontSize="14" fill="#485361">
            <text x="115" y="38" textAnchor="middle" fontWeight="600">ZnO</text>
            <rect x="20" y="52" width="190" height="30" fill="#c3cdd8" />
            <rect x="20" y="206" width="190" height="30" fill="#c3cdd8" />
            <text x="28" y="72" fontSize="12">CB</text>
            <text x="28" y="226" fontSize="12">VB</text>

            <g opacity={u}>
              <line x1="62" y1="204" x2="62" y2="86" stroke={ARROW.v} strokeWidth="3" markerEnd={`url(#${id}-v)`} />
              <text x="72" y="142" fill="#6a3fc0" fontWeight="600">UV</text>
              <text x="72" y="158" fill="#6a3fc0" fontSize="12">365 nm</text>
              <path d="M210 67C240 67 262 80 288 104" fill="none" stroke={ARROW.b} strokeWidth="1.5" strokeDasharray="4 4" markerEnd={`url(#${id}-b)`} />
            </g>

            <rect x="290" y="100" width="160" height="136" fill="#d9ac3e" />
            <text x="370" y="176" textAnchor="middle" fontWeight="600" fill="#3b2c06">Au</text>
            <ellipse cx="370" cy="102" rx="84" ry="28" fill={`url(#${id}-g)`} opacity={u * 0.9} />

            <circle cx="352" cy="93" r="4" fill="#0f7f8c" />
            <circle cx="363" cy="87" r="4" fill="#0f7f8c" />
            <circle cx="374" cy="93" r="4" fill="#0f7f8c" />
            <path d="M352 93L363 87L374 93" fill="none" stroke="#0f7f8c" strokeWidth="1.6" />
            <text x="363" y="76" textAnchor="middle" fontSize="12">Analyte</text>

            <line x1="330" y1="14" x2="330" y2="94" stroke={ARROW.r} strokeWidth="2.5" markerEnd={`url(#${id}-r)`} />
            <text x="323" y="30" textAnchor="end" fontSize="12" fill="#a50d26">Laser</text>
            <text x="323" y="45" textAnchor="end" fontSize="12" fill="#a50d26">632.8 nm</text>

            <line x1="400" y1="92" x2="400" y2="14" stroke={ARROW.r} strokeWidth={1.4 + 3 * u} opacity={0.45 + 0.55 * u} markerEnd={`url(#${id}-r)`} />
            <text x="414" y="30" fontSize="12" fill="#a50d26">Raman</text>
            <text x="414" y="45" fontSize="12" fill="#a50d26">signal</text>
          </g>

          {electrons.map(
            (e) =>
              e.show && (
                <g key={e.x} className={still ? undefined : 'piers-e'} style={{ '--x': `${e.x}px`, animationDelay: e.delay, transform: still ? e.still : undefined } as CSSProperties}>
                  <circle r="10" fill="#1074b7" />
                  <text textAnchor="middle" y="4" fontSize="12" fill="#fff" fontWeight="600">
                    e⁻
                  </text>
                </g>
              ),
          )}
          {electrons.map(
            (e) =>
              e.show && (
                <circle
                  key={e.x}
                  cx={e.x}
                  cy="221"
                  r="8"
                  fill="#fff"
                  stroke="#1074b7"
                  strokeWidth="1.6"
                  className={still ? undefined : 'piers-h'}
                  style={{ animationDelay: e.delay }}
                />
              ),
          )}
        </svg>

        <svg viewBox="0 0 470 290" role="img" aria-label="Schematic Raman spectrum. The peaks grow as the UV control moves from off to on." className="block h-auto w-full bg-white">
          <g fontSize="13" fill="#485361">
            <line x1={PLOT.x0} y1="26" x2={PLOT.x0} y2={PLOT.y0} stroke="#9aa3ad" />
            <line x1={PLOT.x0} y1={PLOT.y0} x2={PLOT.x1} y2={PLOT.y0} stroke="#9aa3ad" />
            <text x={(PLOT.x0 + PLOT.x1) / 2} y="276" textAnchor="middle">Raman shift</text>
            <text transform={`translate(20 ${(PLOT.y0 + 26) / 2}) rotate(-90)`} textAnchor="middle">Intensity</text>
            {u > 0.12 && (
              <>
                <path d={ghost} fill="none" stroke="#7c8590" strokeWidth="1.5" strokeDasharray="4 3" />
                <text x={peakX - 14} y={peakAt(OFF_LEVEL) + 8} textAnchor="end">UV off</text>
              </>
            )}
            <path d={line} fill="none" stroke="#1074b7" strokeWidth="2" strokeLinejoin="round" />
            <text x={peakX + 14} y={Math.max(30, peakAt(level) + 6)} fontWeight="600" fill="#0b5c93">
              {u > 0.12 ? 'UV on' : 'UV off'}
            </text>
          </g>
        </svg>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <label htmlFor={`${id}-uv`} className="shrink-0 text-card">
          UV off
        </label>
        <input id={`${id}-uv`} type="range" min={0} max={100} value={uv} onChange={(e) => setUv(Number(e.target.value))} aria-label="UV exposure, schematic" className="h-6 min-w-0 flex-1 accent-brand" />
        <span className="shrink-0 text-card">UV on</span>
      </div>

      <ol className="mt-3 grid gap-x-5 gap-y-1 text-card md:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-2 leading-[19px]">
            <span className="font-semibold text-brand-deep">{i + 1}</span>
            {s}
          </li>
        ))}
      </ol>
      <figcaption className="mt-3 border-t border-band pt-2 text-[12.6px] leading-[18px] text-card">
        Schematic illustration, not measured data. CB and VB are the conduction and valence bands. Measured spectra are in the figures above.
      </figcaption>
    </figure>
  );
}
