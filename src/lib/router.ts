import { useEffect, useState } from 'react';

export interface Route {
  path: string;
  segments: string[];
  query: URLSearchParams;
  search: string;
}

function readRoute(): Route {
  const raw = window.location.hash.replace(/^#/, '') || '/';
  const [pathPart, search = ''] = raw.split('?');
  const path = pathPart.startsWith('/') ? pathPart : `/${pathPart}`;
  return {
    path,
    segments: path.split('/').filter(Boolean),
    query: new URLSearchParams(search),
    search,
  };
}

export function useRoute() {
  const [route, setRoute] = useState(readRoute);
  useEffect(() => {
    const update = () => setRoute(readRoute());
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  return route;
}

export const link = (path: string) => `#${path}`;

/** Keeps filters in the address bar without adding history entries. */
export function replaceQuery(path: string, params: Record<string, string | null>) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v) q.set(k, v);
  });
  const s = q.toString();
  window.history.replaceState(null, '', `#${path}${s ? `?${s}` : ''}`);
}
