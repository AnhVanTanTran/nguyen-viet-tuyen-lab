import { Chevron } from '../components/Icons';
import { PageHead } from '../components/Layout';
import { PhotoGrid } from '../components/PhotoGrid';
import { Reveal } from '../components/Reveal';
import { extraAlbums } from '../data/gallery';
import { news } from '../data/news';
import type { Album, NewsCategory, Photo } from '../data/types';
import { asset } from '../lib/asset';
import { link, type Route } from '../lib/router';

type Entry = Album & { year?: number; fromNews?: boolean };

const groups: { id: NewsCategory; label: string }[] = [
  { id: 'research', label: 'Student research conferences' },
  { id: 'exchange', label: 'Academic exchange' },
  { id: 'life', label: 'Lab life' },
];

/** A photo that appears in two sources stays only in the first album. */
function dedupe(albums: Entry[]) {
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

const newsAlbums: Entry[] = news.filter((n) => n.images.length > 0).map((n) => ({ id: n.id, title: n.title, source: n.source, images: n.images, year: n.year, fromNews: true }));
const all = dedupe([...newsAlbums, ...extraAlbums]);
const byId = new Map(all.map((a) => [a.id, a]));
const sections = [
  { id: 'group', label: 'Group photographs', albums: extraAlbums.map((a) => byId.get(a.id)).filter(Boolean) as Entry[] },
  ...groups.map((g) => ({
    ...g,
    albums: news.filter((n) => n.category === g.id).map((n) => byId.get(n.id)).filter(Boolean) as Entry[],
  })),
];
const ordered = sections.flatMap((s) => s.albums);

const count = (a: Entry) => `${a.images.length} ${a.images.length === 1 ? 'photo' : 'photos'}`;

function AlbumCard({ a }: { a: Entry }) {
  return (
    <a href={link(`/gallery/${a.id}`)} className="group flex h-full flex-col bg-panel text-card transition-colors hover:bg-band">
      <span className="block overflow-hidden">
        <img src={asset(a.images[0].thumb)} alt="" width={a.images[0].width} height={a.images[0].height} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
      </span>
      <span className="flex flex-1 flex-col p-3 md:p-4">
        <span lang="vi" className="line-clamp-3 leading-[20px]">
          {a.title}
        </span>
        <span className="mt-auto flex items-center justify-between pt-2 text-[12.6px] leading-[18px]">
          {count(a)}
          {a.year ? ` · ${a.year}` : ''}
          <Chevron className="h-[12px] w-[7px] transition-transform group-hover:translate-x-1" />
        </span>
      </span>
    </a>
  );
}

function AlbumPage({ a }: { a: Entry }) {
  const i = ordered.findIndex((x) => x.id === a.id);
  const prev = ordered[i - 1];
  const next = ordered[i + 1];
  return (
    <>
      <div className="wrap">
        <p className="pt-5">
          <a className="lnk" href={link('/gallery')}>
            All albums
          </a>
        </p>
        <h1 lang="vi" className="page-title !pt-2">
          {a.title}
        </h1>
        <p className="mb-3 text-muted">
          {count(a)}
          {a.year ? ` · ${a.year}` : ''}
          {a.fromNews && (
            <>
              {' · '}
              <a className="lnk" href={link(`/news?item=${a.id}`)}>
                Read the news item
              </a>
            </>
          )}
        </p>
        <PhotoGrid photos={a.images} title={a.title} whole />
        <nav aria-label="Other albums" className="mt-6 grid gap-3 border-t border-panel pt-4 md:grid-cols-2 md:gap-5">
          {prev ? (
            <a lang="vi" className="lnk line-clamp-2" href={link(`/gallery/${prev.id}`)}>
              ‹ {prev.title}
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a lang="vi" className="lnk line-clamp-2 md:text-right" href={link(`/gallery/${next.id}`)}>
              {next.title} ›
            </a>
          )}
        </nav>
      </div>
    </>
  );
}

export default function Gallery({ route }: { route: Route }) {
  const id = route.segments[1];
  if (id) {
    const album = byId.get(id);
    if (album) return <AlbumPage a={album} />;
    return (
      <div className="wrap">
        <h1 className="page-title">Album not found</h1>
        <p>
          <a className="lnk" href={link('/gallery')}>
            All albums
          </a>
        </p>
      </div>
    );
  }
  return (
    <>
      <PageHead title="Gallery" />
      {sections.map((s) => (
        <Reveal key={s.id} className="wrap">
          <h2 className="section-title">{s.label}</h2>
          <ul className="card-grid">
            {s.albums.map((a) => (
              <li key={a.id}>
                <AlbumCard a={a} />
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </>
  );
}
