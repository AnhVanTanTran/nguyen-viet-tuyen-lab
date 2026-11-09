import type { ReactNode } from 'react';

/** Prints the 2 in TiO2, MoS2 and SnO2 as a subscript. The stored title is left untouched. */
export function Chem({ children }: { children: string }) {
  const parts = children.split(/(TiO2|MoS2|SnO2)/);
  return (
    <>
      {parts.map((p, i) =>
        p === 'TiO2' || p === 'MoS2' || p === 'SnO2' ? (
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

const HA = /^(Thi Ha Tran|Tran Thi Ha)$/;
const TAN = /^(Van Tan Tran|Tran Van Tan|Tan Tran Van)$/;

/** A paper without Tran Thi Ha is a collaboration with another lab, so Tran Van Tan is marked as well as the lab head. */
export function Authors({ names }: { names: string[] }): ReactNode {
  const partnerPaper = !names.some((n) => HA.test(n));
  return names.map((n, i) => (
    <span key={n + i}>
      {PI.test(n) || (partnerPaper && TAN.test(n)) ? <span className="font-semibold text-head">{n}</span> : n}
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
