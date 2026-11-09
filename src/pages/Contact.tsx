import { PageHead } from '../components/Layout';
import { site } from '../data/site';
import { asset } from '../lib/asset';

export default function Contact() {
  return (
    <>
      <PageHead title="Contact" />
      <div className="wrap mt-2 grid gap-8 lg:grid-cols-2">
        <div className="copy">
          <address className="not-italic">
            <strong className="font-semibold text-head">{site.name}</strong>
            <br />
            {site.faculty}
            <br />
            {site.university}
            <br />
            {site.address}
          </address>
          <p className="mt-3">
            <a className="lnk" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <ul className="mt-6 flex items-center gap-6">
            {site.institutions.map((i) => (
              <li key={i.name}>
                <a href={i.url} target="_blank" rel="noopener noreferrer">
                  <img src={asset(i.logo)} alt={i.name} width={i.width} height={i.height} loading="lazy" className="h-[72px] w-auto" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <iframe title={`Map showing ${site.university}`} src={site.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[380px] w-full border-0 bg-panel" />
      </div>
    </>
  );
}
