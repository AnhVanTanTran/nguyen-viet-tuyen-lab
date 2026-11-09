import { useEffect, useState } from 'react';
import { Chevron } from '../components/Icons';
import { PageHead } from '../components/Layout';
import { PhotoGrid } from '../components/PhotoGrid';
import { Reveal } from '../components/Reveal';
import { k64Memories } from '../data/gallery';
import { cohorts, k64Letter, masterStudents, staff } from '../data/people';
import type { Cohort, Person } from '../data/types';
import { asset } from '../lib/asset';
import { link, replaceQuery, type Route } from '../lib/router';

const initial = (name: string) => name.trim().split(/\s+/).pop()!.charAt(0);

/** Someone already pictured under Staff or Master students is listed by name in their cohort. */
const pictured = new Set([...staff, ...masterStudents.flatMap((g) => g.people)].map((p) => p.photo).filter(Boolean));

function Card({ person, note, tall = false }: { person: Person; note?: string; tall?: boolean }) {
  const name = person.profile ? (
    <a href={person.profile} target="_blank" rel="noopener noreferrer" className="block pr-4 text-[16px] leading-[22px] hover:underline md:text-[17.5px] md:leading-[24.5px]">
      {person.name}
      <Chevron className="absolute right-3 top-5 h-[14px] w-[8px] transition-transform group-hover:translate-x-1 md:right-5 md:top-[26px]" />
    </a>
  ) : (
    <strong className="block text-[16px] font-normal leading-[22px] md:text-[17.5px] md:leading-[24.5px]">{person.name}</strong>
  );
  return (
    <div className={`group flex h-full flex-col bg-panel text-card transition-colors ${person.profile ? 'hover:bg-band' : ''} ${tall ? 'xl:min-h-[430px]' : ''}`}>
      {person.photo ? (
        <span className="block overflow-hidden">
          <img src={asset(person.photo)} alt={person.name} width={800} height={800} loading="lazy" className={`aspect-square w-full object-cover transition-transform duration-500 ${person.profile ? 'group-hover:scale-[1.04]' : ''}`} />
        </span>
      ) : (
        <div aria-hidden="true" className="grid aspect-square w-full place-items-center bg-brand text-[72px] font-light text-white">
          {initial(person.name)}
        </div>
      )}
      <div className="relative flex-1 p-3 md:p-5">
        {name}
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

function Mini({ person }: { person: Person }) {
  return (
    <div className="flex h-full flex-col bg-panel text-card">
      <img src={asset(person.photo!)} alt={person.name} width={800} height={800} loading="lazy" className="aspect-square w-full object-cover" />
      <div className="flex-1 px-1.5 py-1.5 md:px-2">
        <span className="block text-[12.6px] leading-[16px]">{person.name}</span>
        {person.degree && <small className="mt-0.5 block text-[11px] leading-[14px]">{person.degree}</small>}
      </div>
    </div>
  );
}

function CohortBlock({ c, showExtras, onOpen }: { c: Cohort; showExtras: boolean; onOpen: () => void }) {
  const withPhoto = c.people.filter((p) => p.photo && !pictured.has(p.photo));
  const namesOnly = c.people.filter((p) => !p.photo || pictured.has(p.photo));
  return (
    <div>
      <h3 className="sub-title">
        {c.label} <span className="font-normal">({c.period})</span>
      </h3>
      {withPhoto.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:gap-3 lg:grid-cols-8">
          {withPhoto.map((p) => (
            <li key={p.name} lang="vi">
              <Mini person={p} />
            </li>
          ))}
        </ul>
      )}
      {namesOnly.length > 0 && (
        <ul className={`grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-5 ${withPhoto.length > 0 ? 'mt-2 md:mt-3' : ''}`}>
          {namesOnly.map((p) => (
            <li key={p.name} lang="vi" className="bg-panel px-2.5 py-1.5 text-[12.6px] leading-[17px] text-card">
              {p.name}
              {p.degree && <small className="block text-[11px] leading-[14px]">{p.degree}</small>}
            </li>
          ))}
        </ul>
      )}
      {c.label === 'K64' &&
        (showExtras ? (
          <>
            <h4 className="pb-2 pt-5 text-[15px] font-semibold text-head">K64 memories</h4>
            <PhotoGrid photos={k64Memories} title="K64 memories" contain />
            <details className="mt-3">
              <summary className="lnk cursor-pointer">Lời tri ân của sinh viên khoá 64</summary>
              <div lang="vi" className="copy mt-3 max-w-[820px]">
                {k64Letter.map((t) => (
                  <p key={t.slice(0, 20)}>{t}</p>
                ))}
              </div>
            </details>
          </>
        ) : (
          <p className="mt-2">
            <a
              className="lnk"
              href={link('/people?cohort=K64')}
              onClick={(e) => {
                e.preventDefault();
                onOpen();
              }}
            >
              K64 memories and letter of thanks
            </a>
          </p>
        ))}
    </div>
  );
}

export default function People({ route }: { route: Route }) {
  const [tab, setTab] = useState<string | null>(route.query.get('cohort'));
  useEffect(() => setTab(route.query.get('cohort')), [route.search]);
  useEffect(() => replaceQuery('/people', { cohort: tab }), [tab]);
  const shown = cohorts.filter((c) => !tab || c.label === tab);

  return (
    <>
      <PageHead title="People" />
      <Reveal className="wrap">
        <h2 className="sr-only">Staff</h2>
        <ul className="card-grid">
          {staff.map((p) => (
            <li key={p.name} lang="vi" className={p.ownRow ? 'lg:col-start-1' : undefined}>
              <Card person={p} tall />
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal className="wrap">
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
      </Reveal>

      <Reveal className="wrap">
        <h2 className="section-title">Undergraduate students</h2>
        <div className="flex flex-wrap border-b border-panel" role="group" aria-label="Choose a cohort">
          <button type="button" className="tab" aria-pressed={!tab} onClick={() => setTab(null)}>
            All
          </button>
          {cohorts.map((c) => (
            <button key={c.label} type="button" className="tab" aria-pressed={tab === c.label} onClick={() => setTab(c.label)}>
              {c.label}
            </button>
          ))}
        </div>
        {shown.map((c) => (
          <CohortBlock key={c.label} c={c} showExtras={tab === c.label} onOpen={() => setTab(c.label)} />
        ))}
      </Reveal>
    </>
  );
}
