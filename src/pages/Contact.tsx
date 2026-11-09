import { PageHead } from '../components/Layout';
import { site } from '../data/site';
import { asset } from '../lib/asset';

export default function Contact() {
  return (
    <>
      <PageHead title="Contact" />
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <address className="font-serif text-[1.3rem] not-italic leading-snug">
            {site.name}
            <br />
            {site.faculty}
            <br />
            {site.university}
            <br />
            {site.address}
          </address>
          <p className="mt-6 text-[1.05rem]">
            <a className="text-link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </p>
          <ul className="mt-10 flex items-center gap-8">
            {site.institutions.map((i) => (
              <li key={i.name}>
                <a href={i.url} target="_blank" rel="noopener noreferrer">
                  <img src={asset(i.logo)} alt={i.name} width={i.width} height={i.height} loading="lazy" className="h-20 w-auto rounded-md bg-white p-2" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-7">
          <iframe title={`Map showing ${site.university}`} src={site.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-[26rem] w-full rounded-[1.75rem] border border-white bg-mist" />
        </div>
      </div>
    </>
  );
}
