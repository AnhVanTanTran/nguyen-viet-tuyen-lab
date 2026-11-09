import { useEffect, useState, type ReactNode, type SyntheticEvent } from 'react';
import { nav, site } from '../data/site';
import { asset } from '../lib/asset';
import { link, type Route } from '../lib/router';
import { MenuIcon, SearchIcon } from './Icons';

export function Header({ route }: { route: Route }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const current = `/${route.segments[0] ?? ''}`;
  const hus = site.institutions[0];

  useEffect(() => setOpen(false), [route.path]);

  const search = (e: SyntheticEvent) => {
    e.preventDefault();
    const term = q.trim();
    window.location.hash = term ? `#/publications?q=${encodeURIComponent(term)}` : '#/publications';
  };

  return (
    <>
    <header>
      <div className="bg-white">
        <div className="wrap flex min-h-[84px] items-center justify-between gap-6 py-2 md:h-[100px]">
          <a href={hus.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
            <img src={asset(hus.logo)} alt="" width={hus.width} height={hus.height} className="h-[62px] w-auto md:h-[72px]" />
            <span className="leading-tight">
              <span className="block text-[15px] font-semibold text-[#2b3640] md:text-[16px]">{site.university}</span>
              <span className="block text-[13px] text-[#2b3640]">{site.faculty}</span>
              <span className="block text-[12px] text-brand">Vietnam National University, Hanoi</span>
            </span>
          </a>
          <div className="hidden flex-col items-end gap-3 md:flex">
            <ul className="flex gap-5 text-[13px] text-[#2b3640]">
              {site.institutions.map((i) => (
                <li key={i.name}>
                  <a href={i.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand hover:underline">
                    {i.name}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="hover:text-brand hover:underline">
                  Email
                </a>
              </li>
            </ul>
            <form onSubmit={search} role="search" className="flex">
              <label htmlFor="site-search" className="sr-only">
                Search publications
              </label>
              <input
                id="site-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search publications"
                className="h-[35px] w-[300px] bg-panel px-[9px] text-[15px] text-[#444] outline-none placeholder:text-[#666]"
              />
              <button type="submit" aria-label="Search publications" className="grid size-[35px] place-items-center bg-brand text-white hover:bg-brand-deep">
                <SearchIcon className="size-[17px]" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="bg-brand text-white">
        <div className="wrap flex min-h-[59px] items-center gap-3 py-2">
          <img src={asset(site.logo)} alt="" width={512} height={512} className="size-10 shrink-0" />
          <a href={link('/')} className="text-[22px] font-light leading-[28px] md:text-[28px] md:leading-[36px]">
            {site.name}
          </a>
        </div>
      </div>
    </header>
        <nav aria-label="Main" className="sticky top-0 z-40 border-t border-white/20 bg-brand text-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]">
          <div className="wrap">
            <button
              type="button"
              className="flex h-10 items-center gap-2 text-[15.7px] lg:hidden"
              aria-expanded={open}
              aria-controls="site-nav"
              onClick={() => setOpen((v) => !v)}
            >
              <MenuIcon className="h-[14px] w-[18px]" />
              Menu
            </button>
            <ul id="site-nav" className={`${open ? 'block' : 'hidden'} pb-2 lg:-ml-5 lg:flex lg:pb-0`}>
              {nav.map((n) => (
                <li key={n.path}>
                  <a
                    href={link(n.path)}
                    aria-current={current === n.path ? 'page' : undefined}
                    className="block px-0 py-2 text-[15.7px] leading-[21px] hover:bg-brand-deep aria-[current=page]:font-semibold lg:px-5 lg:pb-[10px] lg:pt-[9px] lg:aria-[current=page]:bg-brand-deep"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
    </>
  );
}

export function Footer({ route }: { route: Route }) {
  const here = nav.find((n) => n.path === `/${route.segments[0] ?? ''}`);
  return (
    <footer>
      <div className="bg-band py-5">
        <div className="wrap">
          <p className="text-[11.2px] uppercase leading-[15px] text-card">
            <a href={link('/')} className="hover:underline">
              {site.name}
            </a>
            {here && here.path !== '/' && (
              <>
                <span className="mx-2 font-bold text-[#0390c6]">&gt;</span>
                <a href={link(here.path)} className="hover:underline">
                  {here.label}
                </a>
              </>
            )}
          </p>
          <nav aria-label="Footer" className="mt-3">
            <ul className="flex flex-wrap gap-x-9 text-[16.8px] leading-[34px]">
              {nav.map((n) => (
                <li key={n.path}>
                  <a href={link(n.path)} className="hover:underline">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
      <div className="bg-night py-8 text-white">
        <div className="wrap grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-[16px] font-semibold">{site.name}</p>
            <address className="mt-2 not-italic leading-[22px] text-white/85">
              {site.faculty}, {site.university}
              <br />
              {site.address}
              <br />
              <a className="underline-offset-2 hover:underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </address>
            <p className="mt-4 text-[12.6px] text-white/70">© All rights reserved by {site.name}</p>
          </div>
          <ul className="flex items-center gap-5">
            {site.institutions.map((i) => (
              <li key={i.name}>
                <a href={i.url} target="_blank" rel="noopener noreferrer">
                  <img src={asset(i.logo)} alt={i.name} width={i.width} height={i.height} loading="lazy" className="h-[60px] w-auto bg-white p-1.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}

export function PageHead({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="wrap">
      <h1 className="page-title">{title}</h1>
      {children && <div className="copy mb-3 max-w-[820px]">{children}</div>}
    </div>
  );
}
