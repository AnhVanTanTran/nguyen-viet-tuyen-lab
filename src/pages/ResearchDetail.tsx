import { PageHead } from '../components/Layout';
import { PiersExplainer } from '../components/PiersExplainer';
import { PublicationEntry } from '../components/PublicationEntry';
import { Reveal } from '../components/Reveal';
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
      <PageHead title={isPiers ? piers.title : topic.label}>
        {!isPiers && (
          <p>
            <Chem>{topic.summary}</Chem>
          </p>
        )}
      </PageHead>
      {isPiers && (
        <section className="wrap mt-2 grid items-start gap-8 lg:grid-cols-2">
          <div className="copy">
            {piers.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
          <div className="space-y-5">
            {piersFigures.map((f, i) => (
              <ScienceFigure key={f.src} figure={f} label={`PIERS research, figure ${i + 1}`} />
            ))}
          </div>
        </section>
      )}
      {isPiers && (
        <Reveal className="wrap">
          <h2 className="section-title">How the UV step changes the signal</h2>
          <PiersExplainer />
        </Reveal>
      )}
      <section className="wrap">
        <h2 className="section-title">Publications</h2>
        {papers.map((p) => (
          <PublicationEntry key={p.id} p={p} />
        ))}
        <p className="mt-4">
          <a className="lnk" href={link('/research')}>
            All research
          </a>
        </p>
      </section>
    </>
  );
}
