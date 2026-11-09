import { useEffect, useRef, useState } from 'react';
import { CircleArrow, PauseIcon, PlayIcon } from '../components/Icons';
import { PhotoCarousel } from '../components/PhotoCarousel';
import { PublicationEntry } from '../components/PublicationEntry';
import { Reveal } from '../components/Reveal';
import { extraAlbums } from '../data/gallery';
import { news } from '../data/news';
import { cohorts, masterStudents, staff } from '../data/people';
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

const heroClass = 'h-[220px] w-full object-cover object-right sm:h-[300px] lg:h-[394px]';

/** Banner film: a molecule vibrates in the gold gap under a continuous laser wave while the Raman spectrum glows. It starts by itself. */
function Hero() {
  const [playing, setPlaying] = useState(false);
  const film = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = film.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => setPlaying(false));
  }, []);

  const toggle = () => {
    const v = film.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => setPlaying(false));
    else v.pause();
  };

  return (
    <div className="relative">
      <video ref={film} autoPlay muted loop playsInline poster={asset('images/art/v2/banner-molecule-start.jpg')} width={1920} height={800} aria-hidden="true" className={heroClass} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}>
        <source src={asset('images/art/v2/banner-molecule.webm')} type="video/webm" />
        <source src={asset('images/art/v2/banner-molecule.mp4')} type="video/mp4" />
      </video>
      <button type="button" onClick={toggle} aria-label={playing ? 'Pause animation' : 'Play animation'} className="absolute bottom-2 right-2 z-10 grid size-8 place-items-center bg-black/55 text-white hover:bg-black/75">
        {playing ? <PauseIcon className="h-[12px] w-[10px]" /> : <PlayIcon className="h-[12px] w-[10px]" />}
      </button>
    </div>
  );
}

const stats = [
  { n: publications.length, label: 'Publications' },
  { n: staff.length, label: 'Staff' },
  { n: masterStudents.reduce((sum, g) => sum + g.people.length, 0), label: 'Master students' },
  { n: cohorts.reduce((sum, c) => sum + c.people.length, 0), label: `Undergraduate students, ${cohorts[cohorts.length - 1].label} to ${cohorts[0].label}` },
];

export default function Home() {
  const featured = publications.filter((p) => p.featured);
  const latest = news.filter((n) => n.images.length > 0).slice(0, 6);
  const group = extraAlbums[0];
  const slides = [...group.images, ...extraAlbums[1].images.filter((p) => /k64-class\/1[0-3]\.jpg$/.test(p.src))];
  return (
    <>
      <section className="relative mx-auto max-w-[1222px]">
        <Hero />
        <div className="bg-[#1a1a1a] px-6 py-5 text-white lg:absolute lg:left-[61px] lg:top-[116px] lg:w-[576px] lg:bg-[rgba(26,26,26,0.8)] lg:px-10 lg:py-[30px]">
          <h1 className="text-[26px] font-light leading-[34px] lg:text-[28px] lg:leading-[36px]">{site.name}</h1>
          <p className="mt-2 text-[15px] font-semibold leading-[22px]">{site.statement}</p>
        </div>
      </section>

      <div className="wrap">
        <div className="mt-5">
          <PhotoCarousel photos={slides} title={group.title} />
        </div>

        <ul className="mt-5 grid gap-3 md:grid-cols-3 md:gap-5">
          {quick.map((q) => (
            <li key={q.path}>
              <a href={link(q.path)} className="group flex h-[84px] items-center justify-between bg-panel pl-5 pr-[17px] text-[16.8px] text-card transition-colors hover:bg-band">
                {q.label}
                <CircleArrow className="size-8 transition-transform group-hover:translate-x-1" />
              </a>
            </li>
          ))}
        </ul>

        <Reveal>
          <dl className="mt-5 grid grid-cols-2 bg-night text-white md:grid-cols-4">
            {stats.map((x) => (
              <div key={x.label} className="flex flex-col-reverse justify-end px-5 py-4">
                <dt className="text-[13px] leading-[18px] text-white/85">{x.label}</dt>
                <dd className="text-[34px] font-light leading-[42px]">{x.n}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal>
        <h2 className="section-title">News</h2>
        <ul className="grid gap-x-5 gap-y-5 md:grid-cols-2">
          {latest.map((n) => {
            const summary = n.paragraphs.find((p) => p !== n.title);
            return (
              <li key={n.id}>
                <a href={link(`/news?item=${n.id}`)} className="group flex gap-4 md:gap-5">
                  <span className="block h-[75px] w-[120px] shrink-0 overflow-hidden md:h-[100px] md:w-[160px]">
                    <img src={asset(n.images[0].thumb)} alt="" width={160} height={100} loading="lazy" className="size-full bg-panel object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  </span>
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

        </Reveal>

        <Reveal>
        <h2 className="section-title">Selected publications</h2>
        {featured.map((p) => (
          <PublicationEntry key={p.id} p={p} />
        ))}
        <p className="mt-2 text-right text-[12.6px] uppercase">
          <a className="lnk" href={link('/publications')}>
            All {publications.length} publications
          </a>
        </p>
        </Reveal>
      </div>
    </>
  );
}
