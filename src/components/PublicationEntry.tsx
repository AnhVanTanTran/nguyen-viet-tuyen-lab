import type { Publication } from '../data/types';
import { asset } from '../lib/asset';
import { Authors, Chem } from '../lib/text';

export function citation(p: Publication) {
  const vol = p.volume ? ` ${p.volume}` : '';
  const iss = p.issue ? ` (${p.issue})` : '';
  const pg = p.pages ? `${vol || iss ? ', ' : ' '}${p.pages}` : '';
  return `${vol}${iss}${pg}`;
}

export function PublicationEntry({ p }: { p: Publication }) {
  return (
    <article className="grid gap-5 border-t border-mist py-6 first:border-t-0 sm:grid-cols-[1fr_auto]">
      <div>
        <h3 className="text-[1.14rem] font-normal leading-snug tracking-[-0.005em]">
          <Chem>{p.title}</Chem>
        </h3>
        <p className="mt-2 max-w-[62ch] font-serif text-[1.02rem] leading-normal text-graphite">
          <Authors names={p.authors} />
        </p>
        <p className="mt-1.5 font-serif text-[1.02rem]">
          {p.journal && <i>{p.journal}</i>}
          {p.journal && citation(p)}
          {p.journal && ', '}
          {p.year}
        </p>
        {(p.doi || p.publisherUrl || p.pdfUrl) && (
          <p className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-[0.86rem]">
            {p.doi && (
              <a className="text-link" href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener noreferrer">
                DOI: {p.doi}
              </a>
            )}
            {p.publisherUrl && (
              <a className="text-link" href={p.publisherUrl} target="_blank" rel="noopener noreferrer">
                {p.journal === 'arXiv preprint' ? 'arXiv page' : 'Publisher page'}
              </a>
            )}
            {p.pdfUrl && (
              <a className="text-link" href={p.pdfUrl} target="_blank" rel="noopener noreferrer">
                PDF
              </a>
            )}
          </p>
        )}
      </div>
      {p.thumbnail && <img src={asset(p.thumbnail)} alt="" loading="lazy" className="h-28 w-auto rounded-lg bg-white object-contain p-1" />}
    </article>
  );
}
