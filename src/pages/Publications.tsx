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
  const featured = publications.filter((p) => p.featured);
  const shownYears = years.filter((y) => results.some((p) => p.year === y));
  const clear = () => {
    setYear(null);
    setTopic(null);
    setQ('');
  };

  return (
    <>
      <PageHead title="Publications" />
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="space-y-7 lg:sticky lg:top-24">
            <div>
              <label htmlFor="pub-search" className="text-[0.93rem] text-graphite">
                Search titles, authors, journals
              </label>
              <input
                id="pub-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="mt-2 w-full rounded-xl border border-mist bg-white/70 px-3.5 py-2 text-[1rem]"
              />
            </div>
            <fieldset>
              <legend className="text-[0.93rem] text-graphite">Year</legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {years.map((y) => (
                  <button key={y} type="button" className="chip" aria-pressed={year === y} onClick={() => setYear(year === y ? null : y)}>
                    {y}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend className="text-[0.93rem] text-graphite">Topic</legend>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {topics.map((t) => (
                  <button key={t.id} type="button" className="chip text-left" aria-pressed={topic === t.id} onClick={() => setTopic(topic === t.id ? null : t.id)}>
                    {t.label}
                  </button>
                ))}
              </div>
            </fieldset>
            <p className="text-[0.93rem] text-graphite" aria-live="polite">
              {results.length} of {publications.length} publications
              {filtering && (
                <>
                  {' '}
                  <button type="button" onClick={clear} className="text-link">
                    Clear filters
                  </button>
                </>
              )}
            </p>
          </div>
        </aside>

        <div className="min-w-0 lg:col-span-9">
          {!filtering && (
            <section className="glass mb-14 px-5 py-3 sm:px-8">
              <h2 className="pt-4 text-[1.05rem] text-graphite">Featured</h2>
              {featured.map((p) => (
                <PublicationEntry key={p.id} p={p} />
              ))}
            </section>
          )}
          {results.length === 0 && <p className="prose-serif">No publications match these filters. Remove a filter or try another search term.</p>}
          {shownYears.map((y) => (
            <section key={y} className="grid gap-2 border-t border-ink/70 pt-4 md:grid-cols-[8.5rem_1fr]">
              <h2 className="display text-[3.1rem]">{y}</h2>
              <div className="mb-10 min-w-0">
                {results
                  .filter((p) => p.year === y)
                  .map((p) => (
                    <PublicationEntry key={p.id} p={p} />
                  ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
