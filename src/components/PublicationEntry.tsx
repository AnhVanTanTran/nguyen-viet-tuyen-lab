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
  const href = p.doi ? `https://doi.org/${p.doi}` : p.publisherUrl;
  return (
    <article className="grid gap-4 border-b border-panel py-4 last:border-b-0 sm:grid-cols-[1fr_auto]">
      <div>
        <h3 className="text-[15px] font-semibold leading-[21px]">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="lnk">
              <Chem>{p.title}</Chem>
            </a>
          ) : (
            <span className="text-head">
              <Chem>{p.title}</Chem>
            </span>
          )}
        </h3>
        <p className="mt-1">
          <Authors names={p.authors} />
        </p>
        <p className="mt-1 text-[12.6px] leading-[18px] text-muted">
          {p.journal && <i>{p.journal}</i>}
          {p.journal && citation(p)}
          {p.journal && ', '}
          {p.year}
          {p.doi && <> · doi: {p.doi}</>}
          {p.publisherUrl && (
            <>
              {' · '}
              <a className="lnk" href={p.publisherUrl} target="_blank" rel="noopener noreferrer">
                {p.journal === 'arXiv preprint' ? 'arXiv page' : 'Publisher page'}
              </a>
            </>
          )}
          {p.pdfUrl && (
            <>
              {' · '}
              <a className="lnk" href={p.pdfUrl} target="_blank" rel="noopener noreferrer">
                PDF
              </a>
            </>
          )}
        </p>
      </div>
      {p.thumbnail && <img src={asset(p.thumbnail)} alt="" loading="lazy" className="h-[100px] w-auto bg-white object-contain" />}
    </article>
  );
}
