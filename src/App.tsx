import { useEffect, useRef } from 'react';
import { Footer, Header } from './components/Layout';
import { NanoBackground } from './components/NanoBackground';
import { site } from './data/site';
import { topics } from './data/topics';
import { useRoute, type Route } from './lib/router';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Home from './pages/Home';
import News from './pages/News';
import NotFound from './pages/NotFound';
import People from './pages/People';
import Publications from './pages/Publications';
import ResearchDetail from './pages/ResearchDetail';
import ResearchIndex from './pages/ResearchIndex';

function resolve(route: Route) {
  const [first, second] = route.segments;
  if (!first) return { title: '', page: <Home /> };
  if (first === 'research' && !second) return { title: 'Research', page: <ResearchIndex /> };
  if (first === 'research') {
    const topic = topics.find((t) => t.id === second);
    if (topic) return { title: topic.label, page: <ResearchDetail topic={topic} /> };
  }
  if (first === 'people') return { title: 'People', page: <People /> };
  if (first === 'publications') return { title: 'Publications', page: <Publications route={route} /> };
  if (first === 'gallery') return { title: 'Gallery', page: <Gallery /> };
  if (first === 'news') return { title: 'News', page: <News route={route} /> };
  if (first === 'contact') return { title: 'Contact', page: <Contact /> };
  return { title: 'Page not found', page: <NotFound /> };
}

export default function App() {
  const route = useRoute();
  const main = useRef<HTMLElement>(null);
  const { title, page } = resolve(route);

  useEffect(() => {
    document.title = title ? `${title} | ${site.name}` : site.name;
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [route.path, title]);

  return (
    <div className="relative isolate flex min-h-svh flex-col">
      {/* Decorative SERS background. Lower the numbers for a quieter page, or remove this line to turn it off. */}
      <NanoBackground intensity={route.segments.length === 0 ? 1 : 0.6} />
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Header route={route} />
      <main id="main" ref={main} tabIndex={-1} key={route.path} className="page-enter flex-1 outline-none">
        {page}
      </main>
      <Footer />
    </div>
  );
}
