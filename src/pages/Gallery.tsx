import { useMemo } from 'react';
import { PageHead } from '../components/Layout';
import { PhotoGrid } from '../components/PhotoGrid';
import { ScienceFigure } from '../components/ScienceFigure';
import { extraAlbums, piersFigures } from '../data/gallery';
import { news } from '../data/news';
import type { Album, NewsCategory, Photo } from '../data/types';

const groups: { id: NewsCategory; label: string }[] = [
  { id: 'research', label: 'Student research conferences' },
  { id: 'exchange', label: 'Academic exchange' },
  { id: 'life', label: 'Lab life' },
];
const grid = 'columns-2 gap-2.5 md:columns-3 lg:columns-4';

function dedupe(albums: Album[]) {
  const seen = new Set<string>();
  return albums
    .map((a) => ({
      ...a,
      images: a.images.filter((p: Photo) => {
        if (seen.has(p.src)) return false;
        seen.add(p.src);
        return true;
      }),
    }))
    .filter((a) => a.images.length > 0);
}

export default function Gallery() {
  const sections = useMemo(() => {
    const fromNews = groups.map((g) => ({
      ...g,
      albums: news.filter((n) => n.category === g.id && n.images.length > 0).map((n) => ({ id: n.id, title: n.title, source: n.source, images: n.images })),
    }));
    const all = dedupe([...fromNews.flatMap((s) => s.albums), ...extraAlbums]);
    const byId = new Map(all.map((a) => [a.id, a]));
    return {
      groups: fromNews.map((s) => ({ ...s, albums: s.albums.map((a) => byId.get(a.id)).filter(Boolean) as Album[] })),
      extra: extraAlbums.map((a) => byId.get(a.id)).filter(Boolean) as Album[],
    };
  }, []);

  return (
    <>
      <PageHead title="Gallery" />
      <section className="wrap">
        <h2 className="display text-[clamp(1.9rem,3.2vw,3rem)]">Research figures</h2>
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
          {piersFigures.map((f, i) => (
            <ScienceFigure key={f.src} figure={f} label={`PIERS research, figure ${i + 1}`} />
          ))}
        </div>
      </section>
      {sections.groups.map((g) => (
        <section key={g.id} className="wrap mt-24">
          <h2 className="display text-[clamp(1.9rem,3.2vw,3rem)]">{g.label}</h2>
          {g.albums.map((a) => (
            <div key={a.id} className="mt-9">
              <h3 lang="vi" className="mb-3.5 max-w-[60ch] font-serif text-[1.14rem] leading-snug">
                {a.title}
              </h3>
              <PhotoGrid photos={a.images} title={a.title} className={grid} />
            </div>
          ))}
        </section>
      ))}
      <section className="wrap mt-24">
        <h2 className="display text-[clamp(1.9rem,3.2vw,3rem)]">Group photographs</h2>
        {sections.extra.map((a) => (
          <div key={a.id} className="mt-9">
            <h3 className="mb-3.5 font-serif text-[1.14rem]">{a.title}</h3>
            <PhotoGrid photos={a.images} title={a.title} className={grid} />
          </div>
        ))}
      </section>
    </>
  );
}
