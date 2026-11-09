/** Resolves a file in /public so it works at any GitHub Pages path. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
