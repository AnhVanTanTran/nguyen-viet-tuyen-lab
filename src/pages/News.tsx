import { useEffect, useState } from 'react';
import { PageHead } from '../components/Layout';
import { Lightbox } from '../components/Lightbox';
import { PhotoGrid } from '../components/PhotoGrid';
import { news } from '../data/news';
import { site } from '../data/site';
import type { NewsCategory, NewsItem } from '../data/types';
import { newsCategories } from '../data/topics';
import { asset } from '../lib/asset';
import { replaceQuery, type Route } from '../lib/router';
import { formatDate } from '../lib/text';

const thumbBox = 'h-[75px] w-[120px] shrink-0 md:h-[100px] md:w-[160px]';

function Article({ n, label, startOpen }: { n: NewsItem; label: string; startOpen: boolean }) {
  const [zoom, setZoom] = useState(false);
  const summary = n.paragraphs.find((p) => p !== n.title);
  const hasMore = n.paragraphs.length > 0 || n.images.length > 1 || Boolean(n.links?.length) || Boolean(n.photoNotes?.length);
  return (
    <article id={n.id} className="flex gap-4 scroll-mt-3 border-b border-panel py-4 md:gap-5">
      {n.images.length > 0 ? (
        <button type="button" onClick={() => setZoom(true)} className={`${thumbBox} cursor-zoom-in`} aria-label={`Open photo: ${n.title}`}>
          <img src={asset(n.images[0].thumb)} alt="" width={160} height={100} loading="lazy" className="size-full bg-panel object-cover" />
        </button>
      ) : (
        <div aria-hidden="true" className={`${thumbBox} grid place-items-center bg-panel`}>
          <img src={asset(site.logo)} alt="" width={512} height={512} loading="lazy" className="size-12" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h3 lang="vi" className="font-normal leading-[20px] text-brand">
          {n.title}
        </h3>
        {summary && (
          <p lang="vi" className="mt-1 line-clamp-2 text-[12.6px] leading-[18px] text-muted">
            {summary}
          </p>
        )}
        <p className="mt-1 text-[11px] leading-[16px] text-muted">
          {label}
          {n.date ? `, ${formatDate(n.date)}` : `, ${n.year}`}
          {n.images.length > 1 && ` · ${n.images.length} photos`}
        </p>
        {hasMore && (
          <details className="mt-1.5" open={startOpen}>
            <summary className="lnk cursor-pointer text-[12.6px]">Read more</summary>
            {n.paragraphs.length > 0 && (
              <div lang="vi" className="copy mt-3 max-w-[820px]">
                {n.paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            )}
            {n.links?.map((l) => (
              <p key={l.url} className="mt-3">
                <a lang="vi" className="lnk" href={l.url} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </p>
            ))}
            {n.photoNotes && (
              <ul lang="vi" className="mt-3 list-disc space-y-1 pl-5">
                {n.photoNotes.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            )}
            {n.images.length > 0 && <PhotoGrid photos={n.images} title={n.title} className="mt-3" />}
          </details>
        )}
      </div>
      {zoom && <Lightbox images={n.images.map((p) => ({ src: asset(p.src), alt: `Photo: ${n.title}`, caption: n.title }))} start={0} onClose={() => setZoom(false)} />}
    </article>
  );
}

export default function News({ route }: { route: Route }) {
  const [cat, setCat] = useState<NewsCategory | null>(null);
  const item = route.query.get('item');
  useEffect(() => setCat((route.query.get('category') as NewsCategory) || null), [route.search]);
  useEffect(() => replaceQuery('/news', { category: cat }), [cat]);
  useEffect(() => {
    if (!item) return;
    const timer = window.setTimeout(() => document.getElementById(item)?.scrollIntoView({ block: 'start' }), 80);
    return () => window.clearTimeout(timer);
  }, [item]);

  const items = news.filter((n) => !cat || n.category === cat);
  const years = [...new Set(items.map((n) => n.year))].sort((a, b) => b - a);
  const label = (id: NewsCategory) => newsCategories.find((c) => c.id === id)!.label;

  return (
    <>
      <PageHead title="News" />
      <div className="wrap">
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2" role="group" aria-label="Filter news">
          <span className="mr-1">Show:</span>
          <button type="button" className="pill" aria-pressed={!cat} onClick={() => setCat(null)}>
            All
          </button>
          {newsCategories.map((c) => (
            <button key={c.id} type="button" className="pill" aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>
              {c.label}
            </button>
          ))}
        </div>
        {years.map((y) => (
          <section key={y}>
            <h2 className="section-title">{y}</h2>
            {items
              .filter((n) => n.year === y)
              .map((n) => (
                <Article key={n.id} n={n} label={label(n.category)} startOpen={item === n.id} />
              ))}
          </section>
        ))}
      </div>
    </>
  );
}
