import type { ReactNode } from 'react';

/** Prints the 2 in TiO2 and MoS2 as a subscript. The stored title is left untouched. */
export function Chem({ children }: { children: string }) {
  const parts = children.split(/(TiO2|MoS2)/);
  return (
    <>
      {parts.map((p, i) =>
        p === 'TiO2' || p === 'MoS2' ? (
          <span key={i}>
            {p.slice(0, -1)}
            <sub>2</sub>
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

const PI = /^(Viet Tuyen Nguyen|Nguyen Viet Tuyen|Tuyen Nguyen Viet)$/;

export function Authors({ names }: { names: string[] }): ReactNode {
  return names.map((n, i) => (
    <span key={n + i}>
      {PI.test(n) ? <span className="font-semibold text-head">{n}</span> : n}
      {i < names.length - 1 ? ', ' : ''}
    </span>
  ));
}

export const fold = (s: string) =>
  s
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();

export function formatDate(iso: string) {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
