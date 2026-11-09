export type Topic = 'piers' | 'sers' | 'photocatalysis' | 'fabrication' | 'optics';

export interface Publication {
  id: string;
  /** Exact title as printed on the lab's publication page. */
  title: string;
  /** Full author list, in the published order. */
  authors: string[];
  journal: string | null;
  year: number;
  volume: string | null;
  issue: string | null;
  /** Page range or article number. */
  pages: string | null;
  doi: string | null;
  publisherUrl: string | null;
  pdfUrl?: string;
  /** Graphical abstract supplied by the lab, e.g. 'images/research/my-paper.jpg'. */
  thumbnail?: string;
  topics: Topic[];
  featured?: boolean;
  /** Where the record came from. Used by the migration report, not shown on the site. */
  source: {
    page: string;
    listedUnderYear: number;
    originalLink: string | null;
    authorsFrom: 'source' | 'crossref' | 'datacite' | 'source-only';
    metadataFrom: 'crossref' | 'datacite' | 'source-only';
  };
  verification: 'doi-verified' | 'doi-found-by-title' | 'unverified';
}

export interface Photo {
  src: string;
  thumb: string;
  width: number;
  height: number;
}

export interface ResearchFigure {
  src: string;
  alt: string;
  width: number;
  height: number;
}

export type NewsCategory = 'research' | 'exchange' | 'life';

export interface NewsItem {
  id: string;
  category: NewsCategory;
  year: number;
  /** YYYY-MM-DD, only when the source page states a date. */
  date?: string;
  title: string;
  paragraphs: string[];
  images: Photo[];
  /** Captions from the source carousel. They describe the album, not one specific photo. */
  photoNotes?: string[];
  links?: { label: string; url: string }[];
  source: string;
}

export interface Album {
  id: string;
  title: string;
  source: string;
  images: Photo[];
}

export interface Person {
  name: string;
  role?: string;
  degree?: string;
  email?: string;
  photo?: string;
  profile?: string;
}

export interface MasterGroup {
  period: string;
  people: Person[];
}

export interface Cohort {
  label: string;
  period: string;
  people: Person[];
}
