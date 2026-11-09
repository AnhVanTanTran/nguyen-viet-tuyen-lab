/** Read once per component. People who ask for less motion get the still version of everything. */
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
