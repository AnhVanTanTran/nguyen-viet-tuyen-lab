import { useEffect, useMemo, useState } from 'react';
import { PageHead } from '../components/Layout';
import { PublicationEntry } from '../components/PublicationEntry';
import { publications } from '../data/publications';
import type { Topic } from '../data/types';
import { topics } from '../data/topics';
import { replaceQuery, type Route } from '../lib/router';
import { fold } from '../lib/text';

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

        <div className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 border-b border-panel">
          <div className="flex flex-wrap" role="group" aria-label="Filter by year">
            <button type="button" className="tab" aria-pressed={!year} onClick={() => setYear(null)}>
              All
            </button>
            {years.map((y) => (
              <button key={y} type="button" className="tab" aria-pressed={year === y} onClick={() => setYear(year === y ? null : y)}>
                {y}
              </button>
            ))}
          </div>
          <div className="mb-2 w-full sm:w-[300px]">
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
