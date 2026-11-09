/**
 * Hero motif: the geometry of a PIERS measurement. A broad UV cone and a narrow
 * 632.8 nm laser meet on a substrate decorated with gold nanoparticles.
 * It is an illustration only and contains no measured data.
 */
const AU = [132, 158, 180, 207, 232, 252, 278, 322, 346, 368, 394, 418, 446, 470];

export function Beams({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 640 760" preserveAspectRatio="xMidYMax slice" className={className} role="img" aria-label="Illustration of a UV beam at 365 nm and a laser beam at 632.8 nm meeting on a substrate">
      <defs>
        <linearGradient id="uvCone" gradientUnits="userSpaceOnUse" x1="590" y1="0" x2="300" y2="760">
          <stop offset="0" stopColor="#4f35c2" stopOpacity="0" />
          <stop offset="0.5" stopColor="#4f35c2" stopOpacity="0.1" />
          <stop offset="1" stopColor="#4f35c2" stopOpacity="0.36" />
        </linearGradient>
        <linearGradient id="uvLine" gradientUnits="userSpaceOnUse" x1="590" y1="0" x2="300" y2="760">
          <stop offset="0" stopColor="#4f35c2" stopOpacity="0" />
          <stop offset="0.4" stopColor="#4f35c2" stopOpacity="0.65" />
          <stop offset="1" stopColor="#4f35c2" />
        </linearGradient>
        <linearGradient id="redLine" gradientUnits="userSpaceOnUse" x1="300" y1="0" x2="300" y2="760">
          <stop offset="0" stopColor="#cf1f3a" stopOpacity="0" />
          <stop offset="0.3" stopColor="#cf1f3a" stopOpacity="0.8" />
          <stop offset="1" stopColor="#cf1f3a" />
        </linearGradient>
      </defs>
      <polygon className="uv-cone" points="580,0 600,0 392,760 208,760" fill="url(#uvCone)" />
      <line className="uv-line" pathLength={1} x1="590" y1="0" x2="300" y2="760" stroke="url(#uvLine)" strokeWidth="1.1" />
      <line className="red-glow" pathLength={1} x1="300" y1="0" x2="300" y2="760" stroke="url(#redLine)" strokeWidth="9" opacity="0.14" />
      <line className="red-line" pathLength={1} x1="300" y1="0" x2="300" y2="760" stroke="url(#redLine)" strokeWidth="1.8" />
      {AU.map((x) => (
        <circle key={x} className="au" cx={x} cy={755.5} r={4} fill="#c49a23" />
      ))}
      {[2.0, 2.3, 2.6].map((d) => (
        <circle key={d} className="ring" style={{ ['--delay' as string]: `${d}s` }} cx="300" cy="756" r="140" fill="none" stroke="#cf1f3a" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
      ))}
      <circle className="spot" cx="300" cy="755" r="5.5" fill="#cf1f3a" />
      <text className="beam-label" style={{ ['--delay' as string]: '1s' }} x="470" y="462" fill="#4f35c2" fontSize="17" fontWeight="400">
        365 nm
      </text>
      <text className="beam-label" style={{ ['--delay' as string]: '1.8s' }} x="314" y="500" fill="#cf1f3a" fontSize="17" fontWeight="400">
        632.8 nm
      </text>
    </svg>
  );
}
