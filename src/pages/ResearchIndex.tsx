import { Chevron, CircleArrow } from '../components/Icons';
import { HoverLoop } from '../components/HoverLoop';
import { PageHead } from '../components/Layout';
import { Reveal } from '../components/Reveal';
import { piers } from '../data/piers';
import { publications } from '../data/publications';
import { topics } from '../data/topics';
import { link } from '../lib/router';
import { Chem } from '../lib/text';

const cards = [
  { id: 'piers', image: 'images/art/v2/card-zno-au.jpg', loop: 'images/art/v2/loop-zno-au' },
  { id: 'sers', image: 'images/art/v2/card-sers.jpg', loop: 'images/art/v2/loop-sers' },
  { id: 'fabrication', image: 'images/art/v2/card-cuo-wires.jpg', loop: 'images/art/v2/loop-cuo-wires' },
];

export default function ResearchIndex() {
  const count = (id: string) => publications.filter((p) => p.topics.includes(id as never)).length;
  const others = topics.filter((t) => t.id === 'optics');
  return (
    <>
      <PageHead title="Research">
        <p>{piers.paragraphs[0].split('. ')[0]}.</p>
      </PageHead>
      <Reveal className="wrap">
        <ul className="mt-2 grid gap-5 md:grid-cols-3">
          {cards.map((c) => {
            const t = topics.find((x) => x.id === c.id)!;
            return (
              <li key={c.id}>
                <a href={link(`/research/${c.id}`)} className="group flex h-full flex-col bg-panel text-card transition-colors hover:bg-band">
                  <span className="block overflow-hidden">
                    <HoverLoop poster={c.image} video={c.loop} width={1000} height={667} className="aspect-[3/2] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
                  </span>
                  <span className="relative flex-1 p-5">
                    <strong className="block pr-5 text-[17.5px] font-normal leading-[24.5px]">{t.label}</strong>
                    <Chevron className="absolute right-5 top-[26px] h-[14px] w-[8px] transition-transform group-hover:translate-x-1" />
                    <span className="block pt-[7px] leading-[19.6px]">
                      <Chem>{t.summary}</Chem>
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        <ul className="mt-5 grid gap-5 md:grid-cols-3">
          {others.map((t) => (
            <li key={t.id}>
              <a href={link(`/research/${t.id}`)} className="group flex h-[84px] items-center justify-between gap-3 bg-panel pl-5 pr-[17px] text-[15px] leading-[21px] text-card transition-colors hover:bg-band">
                <span>
                  {t.label}
                  <small className="block text-[12.6px]">
                    {count(t.id)} {count(t.id) === 1 ? 'paper' : 'papers'}
                  </small>
                </span>
                <CircleArrow className="size-8 shrink-0 transition-transform group-hover:translate-x-1" />
              </a>
            </li>
          ))}
        </ul>
      </Reveal>
    </>
  );
}
