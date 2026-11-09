import { useEffect, useState, type ReactNode } from 'react';
import { nav, site } from '../data/site';
import { asset } from '../lib/asset';
import { link, type Route } from '../lib/router';

export function Header({ route }: { route: Route }) {
  const [open, setOpen] = useState(false);
  const current = `/${route.segments[0] ?? ''}`;

  useEffect(() => setOpen(false), [route.path]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-mist/80 bg-wafer/85 backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-6">
        <a href={link('/')} className="text-[1.12rem] font-light tracking-[-0.01em]">
          {site.name}
        </a>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex gap-8 text-[0.93rem]">
            {nav.map((n) => (
              <li key={n.path}>
                <a
                  href={link(n.path)}
                  aria-current={current === n.path ? 'page' : undefined}
                  className="text-graphite transition-colors hover:text-ink aria-[current=page]:text-ink aria-[current=page]:underline"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          type="button"
          className="rounded-full border border-mist px-4 py-1.5 text-[0.9rem] lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Main" className="page-enter h-[calc(100dvh-4rem)] bg-wafer lg:hidden">
          <ul className="wrap flex flex-col gap-1 pt-6">
            {nav.map((n) => (
              <li key={n.path}>
                <a
                  href={link(n.path)}
                  onClick={() => setOpen(false)}
                  aria-current={current === n.path ? 'page' : undefined}
                  className="display block py-2 text-[2.3rem] aria-[current=page]:text-uv"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-mist">
      <div className="wrap grid gap-10 py-12 md:grid-cols-[1.5fr_1fr_auto]">
        <div>
          <p className="text-[1.3rem] font-extralight">{site.name}</p>
          <address className="mt-3 text-[0.93rem] not-italic leading-relaxed text-graphite">
            {site.faculty}, {site.university}
            <br />
            {site.address}
            <br />
            <a className="text-link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </address>
        </div>
        <nav aria-label="Footer">
          <ul className="columns-2 gap-8 text-[0.93rem] leading-8 text-graphite">
            {nav.map((n) => (
              <li key={n.path}>
                <a href={link(n.path)} className="hover:text-ink">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <ul className="flex items-center gap-7">
          {site.institutions.map((i) => (
            <li key={i.name}>
              <a href={i.url} target="_blank" rel="noopener noreferrer">
                <img src={asset(i.logo)} alt={i.name} width={i.width} height={i.height} loading="lazy" className="h-14 w-auto rounded-md bg-white p-1.5" />
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="wrap pb-8 text-[0.82rem] text-graphite">© All rights reserved by {site.name}</p>
    </footer>
  );
}

export function PageHead({ title, long = false, children }: { title: string; long?: boolean; children?: ReactNode }) {
  return (
    <div className="wrap pb-10 pt-14 lg:pt-20">
      <h1 className={`display ${long ? 'max-w-[20em] text-[clamp(2.1rem,4.1vw,3.7rem)]' : 'text-[clamp(2.7rem,6.4vw,5.6rem)]'}`}>{title}</h1>
      {children && <div className="prose-serif mt-6 text-graphite">{children}</div>}
    </div>
  );
}
