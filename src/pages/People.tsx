import { Chevron } from '../components/Icons';
import { PageHead } from '../components/Layout';
import { cohorts, k64Letter, masterStudents, staff } from '../data/people';
import type { Person } from '../data/types';
import { asset } from '../lib/asset';

const initial = (name: string) => name.trim().split(/\s+/).pop()!.charAt(0);

function Card({ person, note, tall = false }: { person: Person; note?: string; tall?: boolean }) {
  return (
    <div className={`flex h-full flex-col bg-panel text-card ${tall ? 'xl:min-h-[430px]' : ''}`}>
      {person.photo ? (
        <img src={asset(person.photo)} alt={person.name} width={800} height={800} loading="lazy" className="aspect-square w-full object-cover" />
      ) : (
        <div aria-hidden="true" className="grid aspect-square w-full place-items-center bg-brand text-[72px] font-light text-white">
          {initial(person.name)}
        </div>
      )}
      <div className="relative flex-1 p-3 md:p-5">
        {person.profile ? (
          <a href={person.profile} target="_blank" rel="noopener noreferrer" className="block pr-4 text-[16px] leading-[22px] hover:underline md:text-[17.5px] md:leading-[24.5px]">
            {person.name}
            <Chevron className="absolute right-3 top-5 h-[14px] w-[8px] md:right-5 md:top-[26px]" />
          </a>
        ) : (
          <strong className="block text-[16px] font-normal leading-[22px] md:text-[17.5px] md:leading-[24.5px]">{person.name}</strong>
        )}
        {person.role && <small className="block text-[14px] leading-[19.6px]">{person.role}</small>}
        {note && <small className="block text-[14px] leading-[19.6px]">{note}</small>}
        {person.degree && <small className="block text-[14px] leading-[19.6px]">{person.degree}</small>}
        {person.email && (
          <p className="break-words pt-[7px] leading-[19.6px]">
            Email:{' '}
            <a className="hover:underline" href={`mailto:${person.email}`}>
              {person.email}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

function Cards({ people, tall = false }: { people: Person[]; tall?: boolean }) {
  return (
    <ul className="card-grid">
      {people.map((p) => (
        <li key={p.name} lang="vi" className={p.ownRow ? 'lg:col-start-1' : undefined}>
          <Card person={p} tall={tall} />
        </li>
      ))}
    </ul>
  );
}

export default function People() {
  return (
    <>
      <PageHead title="People" />
      <section className="wrap">
        <h2 className="sr-only">Staff</h2>
        <Cards people={staff} tall />
      </section>

      <section className="wrap">
        <h2 className="section-title">Master students</h2>
        <ul className="card-grid">
          {masterStudents.flatMap((g) =>
            g.people.map((p) => (
              <li key={p.name} lang="vi">
                <Card person={p} note={`Master student, ${g.period}`} tall />
              </li>
            )),
          )}
        </ul>
      </section>

      <section className="wrap">
        <h2 className="section-title">Undergraduate students</h2>
        {cohorts.map((c) => {
          const withPhoto = c.people.filter((p) => p.photo);
          const namesOnly = c.people.filter((p) => !p.photo);
          return (
            <div key={c.label}>
              <h3 className="sub-title">
                {c.label} <span className="font-normal">({c.period})</span>
              </h3>
              {withPhoto.length > 0 && <Cards people={withPhoto} />}
              {namesOnly.length > 0 && (
                <ul className={`card-grid ${withPhoto.length > 0 ? 'mt-3 md:mt-5' : ''}`}>
                  {namesOnly.map((p) => (
                    <li key={p.name} lang="vi" className="bg-panel px-3 py-2.5 text-card md:px-5 md:py-3">
                      <span className="block leading-[20px]">{p.name}</span>
                      {p.degree && <small className="block text-[12.6px] leading-[18px]">{p.degree}</small>}
                    </li>
                  ))}
                </ul>
              )}
              {c.label === 'K64' && (
                <details className="mt-3">
                  <summary className="lnk cursor-pointer">Lời tri ân của sinh viên khoá 64</summary>
                  <div lang="vi" className="copy mt-3 max-w-[820px]">
                    {k64Letter.map((t) => (
                      <p key={t.slice(0, 20)}>{t}</p>
                    ))}
                  </div>
                </details>
              )}
            </div>
          );
        })}
      </section>
    </>
  );
}
