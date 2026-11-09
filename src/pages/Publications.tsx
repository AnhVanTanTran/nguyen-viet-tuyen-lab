import { useEffect, useMemo, useState } from 'react';
import { PageHead } from '../components/Layout';
import { PublicationEntry } from '../components/PublicationEntry';
import { publications } from '../data/publications';
import type { Topic } from '../data/types';
import { topics } from '../data/topics';
import { replaceQuery, type Route } from '../lib/router';
import { fold } from '../lib/text';

/** Papers per year. Each column is a button that filters the list below. */
function YearChart({ counts, peak, year, onPick }: { counts: { year: number; n: number }[]; peak: number; year: number | null; onPick: (y: number | null) => void }) {
  const tallest = Math.max(...counts.map((c) => c.n));
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-[13px] font-semibold text-head">Papers per year</h2>
        <button type="button" className="pill" aria-pressed={!year} onClick={() => onPick(null)}>
          All years
        </button>
      </div>
      <ul className="mt-1 flex border-b border-[#9aa3ad]" aria-label="Choose a year">
        {counts.map(({ year: y, n }) => {
          const on = year === y;
          return (
            <li key={y} className="min-w-0 flex-1">
              <button
                type="button"
                disabled={n === 0}
                aria-pressed={on}
                aria-label={`${y}: ${n} ${n === 1 ? 'paper' : 'papers'}`}
                onClick={() => onPick(on ? null : y)}
                className="group flex h-[92px] w-full flex-col items-center justify-end disabled:cursor-default"
              >
                <span aria-hidden="true" className={`text-[12px] leading-[16px] text-card ${on || (n === tallest && !year) ? '' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`}>
                  {n}
                </span>
                <span
                  aria-hidden="true"
                  style={{ height: `${n === 0 ? 0 : Math.max(4, (n / peak) * 70)}px` }}
                  className={`block w-[min(70%,26px)] rounded-t-[4px] transition-[height,background-color] duration-200 group-hover:bg-brand-deep ${on ? 'bg-brand-deep' : year ? 'bg-brand/35' : 'bg-brand'}`}
                />
              </button>
            </li>
          );
        })}
      </ul>
      <ul aria-hidden="true" className="flex">
        {counts.map(({ year: y, n }) => (
          <li key={y} className={`min-w-0 flex-1 pt-1 text-center text-[11px] leading-[15px] ${year === y ? 'font-semibold text-head' : n === 0 ? 'text-[#a2a9b2]' : 'text-card'}`}>
            <span className="sm:hidden">’{String(y).slice(2)}</span>
            <span className="hidden sm:inline">{y}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Publications({ route }: { route: Route }) {
  const [year, setYear] = useState<number | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    const y = route.query.get('year');
    setYear(y ? Number(y) : null);
    setTopic((route.query.get('topic') as Topic) || null);
    setQ(route.query.get('q') ?? '');
  }, [route.search]);

  useEffect(() => {
    replaceQuery('/publications', { year: year ? String(year) : null, topic, q: q || null });
  }, [year, topic, q]);

  const years = useMemo(() => [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a), []);
  const haystacks = useMemo(
    () => new Map(publications.map((p) => [p.id, fold([p.title, p.authors.join(' '), p.journal ?? '', p.doi ?? '', p.year].join(' '))])),
    [],
  );

  const needle = fold(q.trim());
  const results = publications.filter(
    (p) =>
      (!year || p.year === year) &&
      (!topic || p.topics.includes(topic)) &&
      (!needle || needle.split(/\s+/).every((w) => haystacks.get(p.id)!.includes(w))),
  );
  const filtering = Boolean(year || topic || needle);
  const yearCounts = useMemo(() => {
    const low = Math.min(...years);
    const high = Math.max(...years);
    const hits = publications.filter((p) => (!topic || p.topics.includes(topic)) && (!needle || needle.split(/\s+/).every((w) => haystacks.get(p.id)!.includes(w))));
    return Array.from({ length: high - low + 1 }, (_, i) => low + i).map((y) => ({ year: y, n: hits.filter((p) => p.year === y).length }));
  }, [years, haystacks, topic, needle]);
  const peak = useMemo(() => Math.max(1, ...years.map((y) => publications.filter((p) => p.year === y).length)), [years]);
  const shownYears = years.filter((y) => results.some((p) => p.year === y));
  const clear = () => {
    setYear(null);
    setTopic(null);
    setQ('');
  };

  return (
    <>
      <PageHead title="Publications" />
      <div className="wrap">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2" role="group" aria-label="Filter by topic">
          <span className="mr-1">Show:</span>
          <button type="button" className="pill" aria-pressed={!topic} onClick={() => setTopic(null)}>
            All
          </button>
          {topics.map((t) => (
            <button key={t.id} type="button" className="pill" aria-pressed={topic === t.id} onClick={() => setTopic(topic === t.id ? null : t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid items-end gap-x-8 gap-y-4 md:grid-cols-[minmax(0,1fr)_300px]">
          <YearChart counts={yearCounts} peak={peak} year={year} onPick={setYear} />
          <div>
            <label htmlFor="pub-search" className="sr-only">
              Search titles, authors, journals
            </label>
            <input
              id="pub-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search titles, authors, journals"
              className="h-[35px] w-full bg-panel px-[9px] text-[14px] text-[#444] outline-none placeholder:text-[#666]"
            />
          </div>
        </div>

        <p className="mt-3 text-muted" aria-live="polite">
          {results.length} of {publications.length} publications
          {filtering && (
            <>
              {' · '}
              <button type="button" onClick={clear} className="lnk">
                Clear filters
              </button>
            </>
          )}
        </p>

        {results.length === 0 && <p className="copy mt-4">No publications match these filters. Remove a filter or try another search term.</p>}
        {shownYears.map((y) => (
          <section key={y}>
            <h2 className="section-title">{y}</h2>
            {results
              .filter((p) => p.year === y)
              .map((p) => (
                <PublicationEntry key={p.id} p={p} />
              ))}
          </section>
        ))}
      </div>
    </>
  );
}
