import { Beams } from '../components/Beams';
import { PublicationEntry } from '../components/PublicationEntry';
import { extraAlbums, piersFigures } from '../data/gallery';
import { news } from '../data/news';
import { staff } from '../data/people';
import { piers } from '../data/piers';
import { publications } from '../data/publications';
import { site } from '../data/site';
import { asset } from '../lib/asset';
import { link } from '../lib/router';
import { formatDate } from '../lib/text';

export default function Home() {
  const featured = publications.filter((p) => p.featured);
  const latest = news.filter((n) => n.images.length > 0).slice(0, 4);
  const group = extraAlbums[0].images[0];
  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/70">
        <div className="wrap relative z-10 flex flex-col lg:min-h-[min(78svh,50rem)] lg:justify-end">
          <h1 className="display max-w-[11em] pb-10 pt-12 text-[clamp(2.55rem,5.7vw,5.5rem)] lg:pb-16">{site.statement}</h1>
        </div>
        <Beams className="pointer-events-none relative block h-64 w-full [mask-image:linear-gradient(to_bottom,transparent,black_30%)] sm:h-80 lg:absolute lg:[mask-image:none] lg:bottom-0 lg:right-[5vw] lg:h-full lg:w-[43vw] lg:max-w-[46rem]" />
      </section>

      <section className="wrap flex flex-col gap-1 py-5 text-[0.95rem] text-graphite sm:flex-row sm:justify-between">
        <p>
          {site.faculty}, {site.university}
        </p>
        <p>{site.city}</p>
      </section>

      <section className="wrap mt-12 grid items-start gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5 lg:pt-6">
          <h2 className="display text-[clamp(1.9rem,3.2vw,3rem)]">{piers.title}</h2>
          <p className="prose-serif mt-6 text-graphite">{piers.paragraphs[1]}</p>
          <p className="mt-6">
            <a className="text-link" href={link('/research/piers')}>
              Read about this research
            </a>
          </p>
        </div>
        <figure className="glass p-4 sm:p-7 lg:col-span-7">
          <img src={asset(piersFigures[0].src)} alt={piersFigures[0].alt} width={piersFigures[0].width} height={piersFigures[0].height} className="h-auto w-full" />
        </figure>
      </section>

      <section className="wrap mt-28 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="display text-[clamp(1.9rem,3.2vw,3rem)]">Selected papers</h2>
          <p className="mt-5">
            <a className="text-link" href={link('/publications')}>
              Browse all {publications.length} publications
            </a>
          </p>
        </div>
        <div className="lg:col-span-8">
          {featured.map((p) => (
            <PublicationEntry key={p.id} p={p} />
          ))}
        </div>
      </section>

      <section className="wrap mt-28">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="display text-[clamp(1.9rem,3.2vw,3rem)]">People</h2>
          <a className="text-link" href={link('/people')}>
            Meet the team
          </a>
        </div>
        <ul className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {staff.map((s) => (
            <li key={s.name}>
              <img src={asset(s.photo!)} alt={s.name} width={800} height={800} loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
              <p className="mt-3.5 text-[1.05rem]">{s.name}</p>
              {s.role && <p className="text-[0.93rem] text-graphite">{s.role}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap mt-28 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <img src={asset(group.src)} alt="Members of the lab at the Faculty of Physics" width={group.width} height={group.height} loading="lazy" className="h-auto w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-5">
          <h2 className="display text-[clamp(1.9rem,3.2vw,3rem)]">From the lab</h2>
          <ul className="mt-6">
            {latest.map((n) => (
              <li key={n.id} className="border-t border-mist py-4 first:border-t-0">
                <p className="text-[0.86rem] text-graphite">{n.date ? formatDate(n.date) : n.year}</p>
                <p lang="vi" className="mt-0.5 font-serif text-[1.14rem] leading-snug">
                  {n.title}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-3">
            <a className="text-link" href={link('/news')}>
              All news
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
