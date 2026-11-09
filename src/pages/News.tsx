import { useEffect, useState } from 'react';
import { PageHead } from '../components/Layout';
import { PhotoGrid } from '../components/PhotoGrid';
import { news } from '../data/news';
import type { NewsCategory } from '../data/types';
import { newsCategories } from '../data/topics';
import { replaceQuery, type Route } from '../lib/router';
import { formatDate } from '../lib/text';

export default function News({ route }: { route: Route }) {
  const [cat, setCat] = useState<NewsCategory | null>(null);
  useEffect(() => setCat((route.query.get('category') as NewsCategory) || null), [route.search]);
  useEffect(() => replaceQuery('/news', { category: cat }), [cat]);

  const items = news.filter((n) => !cat || n.category === cat);
  const years = [...new Set(items.map((n) => n.year))].sort((a, b) => b - a);
  const label = (id: NewsCategory) => newsCategories.find((c) => c.id === id)!.label;

  return (
    <>
      <PageHead title="News" />
      <div className="wrap">
        <div className="mb-12 flex flex-wrap gap-1.5" role="group" aria-label="Filter news">
          <button type="button" className="chip" aria-pressed={!cat} onClick={() => setCat(null)}>
            All
          </button>
          {newsCategories.map((c) => (
            <button key={c.id} type="button" className="chip" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
        {years.map((y) => (
          <section key={y} className="grid gap-2 border-t border-ink/70 pt-4 md:grid-cols-[8.5rem_1fr]">
            <h2 className="display text-[3.1rem] md:sticky md:top-20 md:self-start">{y}</h2>
            <div className="mb-12 min-w-0">
              {items
                .filter((n) => n.year === y)
                .map((n) => (
                  <article key={n.id} className="grid gap-6 border-t border-mist py-7 first:border-t-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
                    <div>
                      <p className="text-[0.86rem] text-graphite">
                        {label(n.category)}
                        {n.date && `, ${formatDate(n.date)}`}
                      </p>
                      <h3 lang="vi" className="mt-1 text-[1.3rem] font-light leading-snug tracking-[-0.005em]">
                        {n.title}
                      </h3>
                      {n.paragraphs.length > 0 && (
                        <div lang="vi" className="prose-serif mt-3.5 space-y-2.5 text-[1.06rem] text-graphite">
                          {n.paragraphs.map((p, i) => (
                            <p key={i}>{p}</p>
                          ))}
                        </div>
                      )}
                      {n.links?.map((l) => (
                        <p key={l.url} className="mt-3 text-[0.93rem]">
                          <a lang="vi" className="text-link" href={l.url} target="_blank" rel="noopener noreferrer">
                            {l.label}
                          </a>
                        </p>
                      ))}
                      {n.photoNotes && (
                        <ul lang="vi" className="mt-4 space-y-1 border-l border-mist pl-4 font-serif text-[0.98rem] text-graphite">
                          {n.photoNotes.map((c) => (
                            <li key={c}>{c}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                    {n.images.length > 0 && <PhotoGrid photos={n.images} title={n.title} limit={n.images.length > 4 ? 4 : undefined} className="columns-2 gap-2.5" />}
                  </article>
                ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
