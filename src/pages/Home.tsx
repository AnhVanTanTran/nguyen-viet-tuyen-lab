import { CircleArrow } from '../components/Icons';
import { PhotoCarousel } from '../components/PhotoCarousel';
import { PublicationEntry } from '../components/PublicationEntry';
import { extraAlbums } from '../data/gallery';
import { news } from '../data/news';
import { publications } from '../data/publications';
import { site } from '../data/site';
import { asset } from '../lib/asset';
import { link } from '../lib/router';
import { formatDate } from '../lib/text';

const quick = [
  { label: 'Research', path: '/research' },
  { label: 'People', path: '/people' },
  { label: 'Publications', path: '/publications' },
];

export default function Home() {
  const featured = publications.filter((p) => p.featured);
  const latest = news.filter((n) => n.images.length > 0).slice(0, 6);
  const group = extraAlbums[0];
  return (
    <>
      <section className="relative mx-auto max-w-[1222px]">
        <picture>
          <source media="(prefers-reduced-motion: reduce)" srcSet={asset('images/art/v2/hero.jpg')} />
          <img src={asset('images/art/v2/hero-animated-cw.gif')} alt="" width={1440} height={600} className="h-[220px] w-full object-cover sm:h-[300px] lg:h-[394px]" />
        </picture>
        <div className="bg-[#1a1a1a] px-6 py-5 text-white lg:absolute lg:left-[61px] lg:top-[116px] lg:w-[576px] lg:bg-[rgba(26,26,26,0.8)] lg:px-10 lg:py-[30px]">
          <h1 className="text-[26px] font-light leading-[34px] lg:text-[28px] lg:leading-[36px]">{site.name}</h1>
          <p className="mt-2 text-[15px] font-semibold leading-[22px]">{site.statement}</p>
        </div>
      </section>

      <div className="wrap">
        <div className="mt-5">
          <PhotoCarousel photos={group.images} title={group.title} />
        </div>

        <ul className="mt-5 grid gap-3 md:grid-cols-3 md:gap-5">
          {quick.map((q) => (
            <li key={q.path}>
              <a href={link(q.path)} className="flex h-[84px] items-center justify-between bg-panel pl-5 pr-[17px] text-[16.8px] text-card transition-colors hover:bg-band">
                {q.label}
                <CircleArrow className="size-8" />
              </a>
            </li>
          ))}
        </ul>

        <h2 className="section-title">News</h2>
        <ul className="grid gap-x-5 gap-y-5 md:grid-cols-2">
          {latest.map((n) => {
            const summary = n.paragraphs.find((p) => p !== n.title);
            return (
              <li key={n.id}>
                <a href={link(`/news?item=${n.id}`)} className="group flex gap-4 md:gap-5">
                  <img src={asset(n.images[0].thumb)} alt="" width={160} height={100} loading="lazy" className="h-[75px] w-[120px] shrink-0 bg-panel object-cover md:h-[100px] md:w-[160px]" />
                  <span className="min-w-0">
                    <strong lang="vi" className="block font-normal text-brand group-hover:underline">
                      {n.title}
                    </strong>
                    {summary && (
                      <span lang="vi" className="mt-1 line-clamp-2 text-[12.6px] leading-[18px] text-muted">
                        {summary}
                      </span>
                    )}
                    <span className="mt-1 block text-[11px] leading-[16px] text-muted">News, {n.date ? formatDate(n.date) : n.year}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-right text-[12.6px] uppercase">
          <a className="lnk" href={link('/news')}>
            More news
          </a>
        </p>

        <h2 className="section-title">Selected publications</h2>
        {featured.map((p) => (
          <PublicationEntry key={p.id} p={p} />
        ))}
        <p className="mt-2 text-right text-[12.6px] uppercase">
          <a className="lnk" href={link('/publications')}>
            All {publications.length} publications
          </a>
        </p>
      </div>
    </>
  );
}
