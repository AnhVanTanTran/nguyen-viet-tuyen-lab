import { PageHead } from '../components/Layout';
import { cohorts, k64Letter, masterStudents, staff } from '../data/people';
import type { Person } from '../data/types';
import { asset } from '../lib/asset';

const initial = (name: string) => name.trim().split(/\s+/).pop()!.charAt(0);

function Portrait({ person, size = 'large' }: { person: Person; size?: 'large' | 'medium' }) {
  return (
    <div>
      {person.photo ? (
        <img src={asset(person.photo)} alt={person.name} width={800} height={800} loading="lazy" className="aspect-square w-full rounded-2xl object-cover" />
      ) : (
        <div aria-hidden="true" className="display grid aspect-square w-full place-items-center rounded-2xl bg-mist/55 text-[4rem] text-graphite">
          {initial(person.name)}
        </div>
      )}
      <p className={`mt-3.5 ${size === 'large' ? 'text-[1.1rem]' : 'text-[1rem]'}`}>{person.name}</p>
      {person.role && <p className="text-[0.93rem] text-graphite">{person.role}</p>}
      {person.email && (
        <p className="mt-1 text-[0.9rem]">
          <a className="text-link break-all" href={`mailto:${person.email}`}>
            {person.email}
          </a>
        </p>
      )}
      {person.profile && (
        <p className="mt-1 text-[0.9rem]">
          <a className="text-link" href={person.profile} target="_blank" rel="noopener noreferrer">
            ResearchGate profile
          </a>
        </p>
      )}
    </div>
  );
}

function Name({ person }: { person: Person }) {
  return (
    <li className="flex min-h-12 items-center gap-3 break-inside-avoid py-1.5">
      {person.photo ? (
        <img src={asset(person.photo)} alt="" width={44} height={44} loading="lazy" className="size-11 shrink-0 rounded-full object-cover" />
      ) : (
        <span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full bg-mist/55 text-[1rem] font-light text-graphite">
          {initial(person.name)}
        </span>
      )}
      <span>
        <span lang="vi" className="block leading-tight">
          {person.name}
        </span>
        {person.degree && <span className="block text-[0.84rem] leading-tight text-graphite">{person.degree}</span>}
      </span>
    </li>
  );
}

export default function People() {
  return (
    <>
      <PageHead title="People" />
      <section className="wrap">
        <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {staff.map((p) => (
            <li key={p.name}>
              <Portrait person={p} />
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap mt-24">
        <h2 className="display text-[clamp(1.9rem,3.2vw,3rem)]">Master students</h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {masterStudents.flatMap((g) =>
            g.people.map((p) => (
              <li key={p.name} lang="vi">
                <Portrait person={p} size="medium" />
                <p className="text-[0.93rem] text-graphite">{g.period}</p>
              </li>
            )),
          )}
        </ul>
      </section>

      <section className="wrap mt-24">
        <h2 className="display text-[clamp(1.9rem,3.2vw,3rem)]">Undergraduate students</h2>
        <div className="mt-8">
          {cohorts.map((c) => (
            <div key={c.label} className="grid gap-4 border-t border-mist py-7 md:grid-cols-12">
              <div className="md:col-span-3">
                <h3 className="display text-[2.4rem]">{c.label}</h3>
                <p className="mt-1 text-[0.93rem] text-graphite">{c.period}</p>
              </div>
              <ul className="gap-x-8 sm:columns-2 lg:columns-3 md:col-span-9">
                {c.people.map((p) => (
                  <Name key={p.name} person={p} />
                ))}
              </ul>
              {c.label === 'K64' && (
                <details className="md:col-span-9 md:col-start-4">
                  <summary className="text-link cursor-pointer text-[0.95rem]">Lời tri ân của sinh viên khoá 64</summary>
                  <div lang="vi" className="prose-serif mt-4 space-y-4 text-graphite">
                    {k64Letter.map((t) => (
                      <p key={t.slice(0, 20)}>{t}</p>
                    ))}
                  </div>
                </details>
              )}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
