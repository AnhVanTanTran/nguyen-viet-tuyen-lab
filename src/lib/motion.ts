const KEY = 'lab-motion';
let chosen = false;
try {
  chosen = localStorage.getItem(KEY) === 'on';
} catch {
  // Storage can be blocked. The choice then lasts until the page is closed.
}

/** Still version for anyone whose system asks for less motion, unless they pressed Play on the banner. */
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches && !chosen;

export function syncMotionClass() {
  document.documentElement.classList.toggle('motion-on', chosen);
}

export function allowMotion() {
  chosen = true;
  try {
    localStorage.setItem(KEY, 'on');
  } catch {
    // See above.
  }
  syncMotionClass();
  window.dispatchEvent(new Event('motionchange'));
}
