import { PageHead } from '../components/Layout';
import { piersFigures } from '../data/gallery';
import { piers } from '../data/piers';
import { publications } from '../data/publications';
import { topics } from '../data/topics';
import { asset } from '../lib/asset';
import { link } from '../lib/router';
import { Chem } from '../lib/text';

export default function ResearchIndex() {
  const [main, ...rest] = topics;
  const count = (id: string) => publications.filter((p) => p.topics.includes(id as never)).length;
  return (
    <>
      <PageHead title="Research">
        <p>{piers.paragraphs[0].split('. ')[0]}.</p>
      </PageHead>
      <section className="wrap">
        <a href={link('/research/piers')} className="group grid items-center gap-8 rounded-[1.75rem] lg:grid-cols-12">
          <div className="glass p-4 sm:p-7 lg:col-span-7">
            <img src={asset(piersFigures[0].src)} alt={piersFigures[0].alt} width={piersFigures[0].width} height={piersFigures[0].height} className="h-auto w-full" />
          </div>
          <div className="lg:col-span-5">
            <h2 className="display text-[clamp(1.9rem,3.2vw,3rem)] group-hover:text-uv">{piers.title}</h2>
            <p className="prose-serif mt-5 text-graphite">{main.summary}</p>
          </div>
        </a>
      </section>
      <section className="wrap mt-24">
        <h2 className="display text-[clamp(1.6rem,2.6vw,2.4rem)]">Also in the publication record</h2>
        <ul className="mt-6">
          {rest.map((t) => (
            <li key={t.id} className="border-t border-mist">
              <a href={link(`/research/${t.id}`)} className="group grid gap-2 py-6 md:grid-cols-12">
                <span className="text-[1.3rem] font-light group-hover:text-uv md:col-span-5">{t.label}</span>
                <span className="font-serif text-[1.08rem] text-graphite md:col-span-6">
                  <Chem>{t.summary}</Chem>
                </span>
                <span className="text-[0.9rem] text-graphite md:col-span-1 md:text-right">
                  {count(t.id)} {count(t.id) === 1 ? 'paper' : 'papers'}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
