import type { NewsCategory, Topic } from './types';

/**
 * Only PIERS is described as a research direction on the lab's original site.
 * The other groupings are drawn from the titles of the lab's papers and should
 * be confirmed or reworded by the lab.
 */
export const topics: { id: Topic; label: string; summary: string }[] = [
  {
    id: 'piers',
    label: 'Photo-induced enhanced Raman scattering',
    summary:
      'UV excitation before or during Raman measurements, studied on nanostructured substrates for detecting toxic agricultural chemicals.',
  },
  {
    id: 'sers',
    label: 'Surface-enhanced Raman scattering substrates',
    summary:
      'Gold nanostructures, ZnO/Ag nanorods, CuO/Au core/shell nanowires, silver nanodendrites and TiO2/Au.',
  },
  {
    id: 'photocatalysis',
    label: 'Photocatalytic degradation',
    summary:
      'Papers on TiO2-based composites for the photocatalytic degradation of methylene blue and RhB.',
  },
  {
    id: 'fabrication',
    label: 'Nanostructure and thin-film fabrication',
    summary:
      'CuO nanowires and nanorods, ZnO/Au nanorods, Ag-doped ZnO thin films and silicon nitride membranes.',
  },
  {
    id: 'optics',
    label: 'Optical properties of nanoparticles',
    summary: 'Absorption and scattering of nanoparticles in an absorbing medium.',
  },
];

export const topicLabel = (id: Topic) => topics.find((t) => t.id === id)?.label ?? id;

export const newsCategories: { id: NewsCategory; label: string }[] = [
  { id: 'research', label: 'Student research' },
  { id: 'exchange', label: 'Academic exchange' },
  { id: 'life', label: 'Lab life' },
];
