import { PageHead } from '../components/Layout';
import { PublicationEntry } from '../components/PublicationEntry';
import { ScienceFigure } from '../components/ScienceFigure';
import { piersFigures } from '../data/gallery';
import { piers } from '../data/piers';
import { publications } from '../data/publications';
import type { Topic } from '../data/types';
import { link } from '../lib/router';
import { Chem } from '../lib/text';

export default function ResearchDetail({ topic }: { topic: { id: Topic; label: string; summary: string } }) {
  const papers = publications.filter((p) => p.topics.includes(topic.id));
  const isPiers = topic.id === 'piers';
  return (
    <>
      <PageHead title={isPiers ? piers.title : topic.label} long>
        {!isPiers && (
          <p>
            <Chem>{topic.summary}</Chem>
          </p>
        )}
      </PageHead>
      {isPiers && (
        <section className="wrap grid gap-12 lg:grid-cols-12">
          <div className="prose-serif space-y-5 lg:col-span-5">
            {piers.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="space-y-8 lg:col-span-7">
            {piersFigures.map((f, i) => (
              <ScienceFigure key={f.src} figure={f} label={`PIERS research, figure ${i + 1}`} />
            ))}
          </div>
        </section>
      )}
      <section className="wrap mt-20">
        <h2 className="display text-[clamp(1.6rem,2.6vw,2.4rem)]">Publications</h2>
        <div className="mt-4">
          {papers.map((p) => (
            <PublicationEntry key={p.id} p={p} />
          ))}
        </div>
        <p className="mt-8">
          <a className="text-link" href={link('/research')}>
            All research
          </a>
        </p>
      </section>
    </>
  );
}
