/** Only the fade-in on scroll follows this. The banner, carousel and card loops run for everyone and can be paused or left alone. */
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
